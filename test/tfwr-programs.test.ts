/**
 * End to end programs: every case is a script a player could really write, and
 * every number is computed by hand from the engine's cost model, so a change to
 * how much an action costs, or to the board, shows up as a failing assertion.
 */
import assert from 'node:assert/strict'
import { test } from 'node:test'
import type { TfwrCell, TfwrRun, TfwrState } from '../app/utils/tfwr-runner.ts'
import { createTestRunner } from './helpers/pyodide.ts'

const runner = createTestRunner()

/** Builds a script from source lines so cases keep readable indentation. */
function script(...lines: string[]): string {
  return `${lines.join('\n')}\n`
}

/** Failure context without dumping a whole 32x32 board into the diff. */
function dump(run: TfwrRun): string {
  return JSON.stringify({
    status: run.status,
    error: run.error?.summary ?? null,
    output: run.output,
    ticks: run.state?.ticks ?? null,
    pos: run.state ? [run.state.posX, run.state.posY] : null,
    inventory: run.state?.inventory ?? null,
  })
}

/** Fails fast when the script did not run to completion, then hands back state. */
function completed(run: TfwrRun): TfwrState {
  assert.equal(run.status, 'ok', dump(run))
  assert.equal(run.error, null, dump(run))
  assert.ok(run.state, `no state: ${dump(run)}`)
  return run.state
}

const PRISTINE_CELL: TfwrCell = {
  ground: 'Grassland',
  entity: null,
  water_level: 0,
  fertiliser_level: 0,
  growth: 0,
}

/** Coordinates of the cells that differ from a pristine board. */
function changedCells(board: TfwrCell[][]): string[] {
  const changed: string[] = []
  board.forEach((row, y) => row.forEach((cell, x) => {
    if (cell.ground !== 'Grassland' || cell.entity !== null) changed.push(`${x},${y}`)
  }))
  return changed
}

/** Every cell of the board that never went through the drone is untouched. */
function assertUntouched(board: TfwrCell[][], changed: string[]) {
  assert.deepEqual(changedCells(board), changed, 'unexpected cells changed')
}

/**
 * What the board settles to after ten or more ticks: grassland regrew Grass
 * on its own everywhere the drone did not change it. Exceptions list the
 * cells the script touched, with whatever differs from a pristine cell.
 */
function assertGrassboard(board: TfwrCell[][], exceptions: Record<string, Partial<TfwrCell>> = {}) {
  board.forEach((row, y) => row.forEach((cell, x) => {
    const key = `${x},${y}`
    const want = key in exceptions
      ? { ...PRISTINE_CELL, ...exceptions[key] }
      : { ...PRISTINE_CELL, entity: 'Grass' }
    assert.deepEqual(cell, want, `unexpected cell ${key}`)
  }))
}

test('walking east around the whole board wraps back to the start', async () => {
  const run = await runner.run(script(
    'for _ in range(31):',
    '    move(East)',
    'move(East)',
    'print(get_tick_count(), get_pos_x(), get_pos_y())',
  ))
  const state = completed(run)
  // 1 for range, 31 loop moves, one closing move, then the two position getters.
  assert.equal(state.ticks, 6403, dump(run))
  assert.deepEqual([state.posX, state.posY], [0, 0], dump(run))
  assert.deepEqual(state.inventory, {}, dump(run))
  // get_tick_count reads the total before the two getters charge their ticks.
  assert.equal(run.output, '6401 0 0\n')
  // Thousands of ticks on untouched grassland: every cell regrew.
  assertGrassboard(state.board)
})

test('moving south and west from the corner wraps to the far edge', async () => {
  const run = await runner.run(script(
    'move(South)',
    'move(West)',
    'x = get_pos_x()',
    'y = get_pos_y()',
    'print(x, y)',
  ))
  const state = completed(run)
  assert.equal(state.ticks, 402, dump(run))
  assert.deepEqual([state.posX, state.posY], [31, 31], dump(run))
  assert.equal(run.output, '31 31\n')
})

test('failed actions cost a single tick', async () => {
  const run = await runner.run(script(
    'move("North")',
    'can_move(North)',
    'use_item(Items.Hay)',
    'harvest()',
    'print(get_tick_count())',
  ))
  const state = completed(run)
  // A bad direction, can_move, spending an item that is not there and an empty
  // harvest: one tick each.
  assert.equal(state.ticks, 4, dump(run))
  assert.deepEqual([state.posX, state.posY], [0, 0], dump(run))
  // A failed use_item never leaves a zero entry behind.
  assert.deepEqual(state.inventory, {}, dump(run))
  assert.equal(run.output, '4\n')
  assertUntouched(state.board, [])
})

test('till toggles the ground under the drone and nothing else', async () => {
  const run = await runner.run(script(
    'till()',
    'till()',
    'till()',
    'print(get_ground_type())',
  ))
  const state = completed(run)
  assert.equal(state.ticks, 601, dump(run))
  assert.equal(state.board[0][0].ground, 'Soil')
  assert.equal(run.output, 'Soil\n')
  // Soil under the drone never grows; everything else regrew.
  assertGrassboard(state.board, { '0,0': { ground: 'Soil' } })
})

test('tiling and planting carrots yields one Carrot', async () => {
  const run = await runner.run(script(
    'till()',
    'plant(Entities.Carrot)',
    'can_harvest()',
    'harvest()',
    'print(num_items(Items.Carrot))',
  ))
  const state = completed(run)
  // till + plant + can_harvest(1) + harvest + num_items(1)
  assert.equal(state.ticks, 602, dump(run))
  assert.deepEqual(state.inventory, { Carrot: 1 }, dump(run))
  assert.deepEqual(state.board[0][0], { ...PRISTINE_CELL, ground: 'Soil' })
  assert.equal(run.output, '1\n')
  assertGrassboard(state.board, { '0,0': { ground: 'Soil' } })
})

test('harvesting grass yields hay once and the second harvest fails', async () => {
  const run = await runner.run(script(
    'plant(Entities.Grass)',
    'harvest()',
    'harvest()',
    'print(num_items(Items.Hay))',
  ))
  const state = completed(run)
  // plant 200, harvest 200, failed harvest 1, num_items 1.
  assert.equal(state.ticks, 402, dump(run))
  assert.deepEqual(state.inventory, { Hay: 1 }, dump(run))
  assert.equal(state.board[0][0].entity, null)
  assert.equal(run.output, '1\n')
  // The harvested cell regrows at tick 410, after the script ends; every
  // other grassland cell regrew long ago.
  assertGrassboard(state.board, { '0,0': {} })
})

test('prefilled items are spent by use_item and stay free', async () => {
  const run = await runner.run(script(
    '# {"wood": 5, "hay": 3}',
    'use_item(Items.Wood)',
    'use_item(Items.Hay, 3)',
    'print(num_items(Items.Wood), num_items(Items.Hay))',
  ))
  const state = completed(run)
  assert.equal(run.status, 'ok', dump(run))
  assert.deepEqual(run.prefill.items, { wood: 5, hay: 3 })
  // Two use_item calls, then two num_items calls; the prefill itself is free.
  assert.equal(state.ticks, 402, dump(run))
  // Spending the whole stack keeps the key at zero.
  assert.deepEqual(state.inventory, { Wood: 4, Hay: 0 }, dump(run))
  assert.equal(run.output, '4 0\n')
})

test('asking for more items than held, or none at all, changes nothing', async () => {
  const run = await runner.run(script(
    '# {"bone": 2}',
    'use_item(Items.Bone, 3)',
    'use_item(Items.Bone, 0)',
    'print(num_items(Items.Bone))',
  ))
  const state = completed(run)
  assert.equal(state.ticks, 3, dump(run))
  assert.deepEqual(state.inventory, { Bone: 2 }, dump(run))
  assert.equal(run.output, '2\n')
})

test('prefill names are matched case-insensitively and merge', async () => {
  const run = await runner.run(script(
    '# {"WOOD": 2, "wood": 3}',
    'print(num_items(Items.Wood))',
  ))
  const state = completed(run)
  assert.equal(state.ticks, 1, dump(run))
  assert.deepEqual(state.inventory, { Wood: 5 }, dump(run))
  assert.equal(run.output, '5\n')
})

test('printing, flipping and get_time are free and keep their output', async () => {
  const run = await runner.run(script(
    'print("hello", 42, True)',
    'quick_print("q")',
    'get_time()',
    'do_a_flip()',
    'print(get_tick_count())',
  ))
  const state = completed(run)
  assert.equal(state.ticks, 0, dump(run))
  assert.equal(run.output, 'hello 42 True\nq\n0\n')
  assert.deepEqual(state.animations, ['print', 'flip', 'print'])
})

test('wrapped builtins charge their own ticks', async () => {
  const run = await runner.run(script(
    'n = len(range(4))',
    'a = abs(-5)',
    'm = min(3, 7)',
    'M = max(3, 7)',
    'print(n, a, m, M, get_tick_count())',
  ))
  const state = completed(run)
  // range 1 + len 1 + abs 1 + min 2 + max 2
  assert.equal(state.ticks, 7, dump(run))
  assert.equal(run.output, '4 5 3 7 7\n')
})

test('clear wipes the field and sends the drone home', async () => {
  const run = await runner.run(script(
    'till()',
    'plant(Entities.Tree)',
    'clear()',
    'print(get_board_size(), get_ground_type(), get_entity_type(), get_tick_count())',
  ))
  const state = completed(run)
  assert.equal(state.ticks, 602, dump(run))
  assert.deepEqual([state.posX, state.posY], [0, 0], dump(run))
  assert.deepEqual(state.board[0][0], PRISTINE_CELL)
  assert.equal(run.output, '32 Grassland None 602\n')
  assertUntouched(state.board, [])
})

test('set_world_size changes the logical world but not the board', async () => {
  const run = await runner.run(script(
    'set_world_size(64)',
    'print(get_world_size(), get_board_size(), get_tick_count())',
  ))
  const state = completed(run)
  assert.equal(state.ticks, 201, dump(run))
  assert.equal(state.boardSize, 32)
  assert.equal(state.board.length, 32)
  assert.equal(run.output, '64 32 201\n')
})

test('a planting loop journals one record per statement', async () => {
  const run = await runner.runStepped(script(
    'for i in range(3):',
    '    plant(Entities.Pumpkin)',
    '    move(East)',
    'harvest()',
  ))
  assert.equal(run.status, 'ok', dump(run))
  assert.ok(run.state, `no state: ${dump(run)}`)
  const state = run.state
  // range 1 plus three times (plant 200 + move 200); the harvest then reaps
  // the Grass that regrew on the empty grassland at (3,0), not a failure.
  assert.equal(state.ticks, 1401, dump(run))
  assert.deepEqual([state.posX, state.posY], [3, 0], dump(run))
  assert.deepEqual(state.inventory, { Hay: 1 }, dump(run))
  assert.deepEqual(
    [0, 1, 2].map(x => state.board[0][x].entity),
    ['Pumpkin', 'Pumpkin', 'Pumpkin'],
  )
  // Reaped just now; its next blade is scheduled for 1411.
  assert.equal(state.board[0][3].entity, null)
  assertGrassboard(state.board, {
    '0,0': { entity: 'Pumpkin' },
    '1,0': { entity: 'Pumpkin' },
    '2,0': { entity: 'Pumpkin' },
    '3,0': {},
  })

  assert.equal(run.steps.length, 2, dump(run))
  assert.deepEqual(run.steps[0], {
    index: 0,
    code: 'for i in range(3):\n    plant(Entities.Pumpkin)\n    move(East)',
    ticks: 1201,
    x: 3,
    y: 0,
    cell: { ...PRISTINE_CELL, entity: 'Grass' },
    inventory: {},
    error: null,
  })
  assert.deepEqual([run.steps[1].index, run.steps[1].code, run.steps[1].ticks], [1, 'harvest()', 1401])
})

test('an error mid-script keeps the state reached so far', async () => {
  const run = await runner.runStepped(script(
    'move(North)',
    'plant(Entities.Carrot)',
    'not_a_function()',
    'move(East)',
  ))
  assert.equal(run.status, 'error', dump(run))
  assert.equal(run.error?.type, 'NameError', dump(run))
  assert.ok(run.state, `no state: ${dump(run)}`)
  const state = run.state
  assert.equal(state.ticks, 400, dump(run))
  assert.deepEqual([state.posX, state.posY], [0, 1], dump(run))
  assert.equal(state.board[1][0].entity, 'Carrots')
  assertGrassboard(state.board, { '0,1': { entity: 'Carrots' } })

  assert.equal(run.steps.length, 3, dump(run))
  assert.deepEqual(run.steps.map(step => step.ticks), [200, 400, 400])
  assert.equal(run.steps[2].code, 'not_a_function()')
  assert.ok(run.steps[2].error, 'the failing step should carry the traceback')
  // The statement after the error never ran.
  assert.deepEqual(run.steps.map(step => step.x), [0, 0, 0])
})

test('empty grassland grows Grass after ten ticks', async () => {
  // can_harvest costs a single tick and forces growth to settle, so looping
  // on it is the cheapest way to spend exactly ten ticks while watching.
  const run = await runner.run(script(
    'for _ in range(10):',
    '    can_harvest()',
    'print(get_entity_type())',
  ))
  const state = completed(run)
  // range 1, ten can_harvest, get_entity_type 1.
  assert.equal(state.ticks, 12, dump(run))
  assert.equal(run.output, 'Grass\n')
  assert.equal(state.board[0][0].entity, 'Grass')
})

test('harvested grass regrows ten ticks later', async () => {
  const run = await runner.run(script(
    'plant(Entities.Grass)',
    'harvest()',
    'print(can_harvest())',
    'for _ in range(10):',
    '    can_harvest()',
    'print(can_harvest())',
  ))
  const state = completed(run)
  // plant 200, harvest 200, can_harvest 1, range 1, ten can_harvest,
  // can_harvest 1. The first probe lands at tick 401, the regrow is due at
  // 410, so the last one reaps it.
  assert.equal(state.ticks, 413, dump(run))
  assert.deepEqual(state.inventory, { Hay: 1 }, dump(run))
  assert.equal(run.output, 'False\nTrue\n')
})

test('Soil never grows grass', async () => {
  const run = await runner.run(script(
    'till()',
    'for _ in range(20):',
    '    can_harvest()',
    'print(get_entity_type(), get_ground_type())',
  ))
  const state = completed(run)
  // till 200, range 1, twenty can_harvest, get_entity_type 1,
  // get_ground_type 1.
  assert.equal(state.ticks, 223, dump(run))
  assert.equal(run.output, 'None Soil\n')
  // The tilled cell stays empty; everything around it turned to Grass.
  assertGrassboard(state.board, { '0,0': { ground: 'Soil' } })
})

test('tilling back to grassland restarts the regrow timer', async () => {
  const run = await runner.run(script(
    'till()',
    'till()',
    'for _ in range(9):',
    '    can_harvest()',
    'print(can_harvest())',
  ))
  const state = completed(run)
  // Two tills cost 400 ticks; grassland is back at tick 400, so the regrow
  // is due at 410, not at the original tick 10. The nine probes land at
  // 401..409 and all miss.
  assert.equal(state.ticks, 411, dump(run))
  assert.equal(run.output, 'True\n')
  assertGrassboard(state.board, { '0,0': { entity: 'Grass' } })
})
