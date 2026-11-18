import assert from 'node:assert/strict'
import { test } from 'node:test'
import type { TfwrRun } from '../app/utils/tfwr-runner.ts'
import { createTestRunner } from './helpers/pyodide.ts'

const runner = createTestRunner()

/** Keeps failures readable: dump the run when an assertion below misses. */
function describe(run: TfwrRun): string {
  return JSON.stringify({
    status: run.status,
    error: run.error?.summary ?? null,
    output: run.output,
    ticks: run.state?.ticks ?? null,
    pos: run.state ? [run.state.posX, run.state.posY] : null,
    inventory: run.state?.inventory ?? null,
  })
}

test('invalid prefill comment stops the run before Python is touched', async () => {
  const result = await runner.run('# {"wood": -3}')
  assert.equal(result.status, 'prefill-error', describe(result))
  assert.match(result.prefill.message ?? '', /non-negative/)
  assert.equal(result.state, null)
  assert.equal(result.output, '')
})

test('plain run reports ticks, position, inventory and board', async () => {
  const result = await runner.run('move(East)\nx = get_pos_x()\nprint(x)\n')
  assert.equal(result.status, 'ok', describe(result))
  assert.equal(result.error, null)
  assert.equal(result.output, '1\n')
  assert.ok(result.state, 'state missing')
  assert.equal(result.state.ticks, 201, describe(result))
  assert.deepEqual([result.state.posX, result.state.posY], [1, 0])
  assert.deepEqual(result.state.inventory, {})
  assert.equal(result.state.board.length, 32)
  assert.equal(result.state.board[0][1].ground, 'Grassland')
})

test('stepped run journals every top-level statement with its tick cost', async () => {
  const source = 'move(East)\n'
    + 'for _ in range(2):\n'
    + '    move(East)\n'
    + 'print(get_tick_count())\n'
  const result = await runner.runStepped(source)
  assert.equal(result.status, 'ok', describe(result))
  assert.equal(result.error, null)
  // 200 for the first move, then range() costs 1 and each loop move costs 200.
  assert.deepEqual(result.steps.map(step => [step.index, step.code, step.ticks]), [
    [0, 'move(East)', 200],
    [1, 'for _ in range(2):\n    move(East)', 601],
    [2, 'print(get_tick_count())', 601],
  ], JSON.stringify(result.steps, null, 2))
  assert.deepEqual(result.steps.map(step => step.x), [1, 3, 3])
  assert.deepEqual(result.steps.map(step => step.y), [0, 0, 0])
  assert.equal(result.output, '601\n')
})

test('stepped and plain runs end in the same state', async () => {
  const source = 'move(North)\ntill()\nplant(Entities.Carrot)\n'
    + '# {"wood": 4}\nuse_item(Items.Wood)\n'
  const plain = await runner.run(source)
  const stepped = await runner.runStepped(source)
  assert.equal(plain.status, 'ok', describe(plain))
  assert.equal(stepped.status, 'ok', describe(stepped))
  assert.deepEqual(stepped.state, plain.state)
  assert.deepEqual(stepped.prefill, plain.prefill)
})

test('stepped run keeps the state reached before an error', async () => {
  const result = await runner.runStepped('move(East)\nmove(North)\nmove(West)\nnot_a_function()\nmove(East)\n')
  assert.equal(result.status, 'error', describe(result))
  assert.equal(result.error?.type, 'NameError')
  assert.match(result.error?.summary ?? '', /^NameError: name 'not_a_function' is not defined$/)
  assert.equal(result.state?.ticks, 600, describe(result))
  assert.deepEqual([result.state?.posX, result.state?.posY], [0, 1])
  assert.equal(result.steps.length, 4, describe(result))
  assert.equal(result.steps[3].code, 'not_a_function()')
  assert.equal(result.steps[3].ticks, 600)
  assert.equal(result.steps[3].error?.trim(), result.error?.detail)
  assert.equal(result.steps.filter(step => step.code === 'move(East)').length, 1)
  assert.deepEqual(result.steps.slice(0, 3).map(step => step.ticks), [200, 400, 600])
})

test('failed actions still cost a tick', async () => {
  const result = await runner.run('move("North")\nuse_item(Items.Bone)\n')
  assert.equal(result.status, 'ok', describe(result))
  assert.equal(result.state?.ticks, 2, describe(result))
})

test('printing costs no ticks', async () => {
  const result = await runner.run('print("a")\nquick_print("b")\n')
  assert.equal(result.status, 'ok', describe(result))
  assert.equal(result.state?.ticks, 0, describe(result))
  assert.equal(result.output, 'a\nb\n')
})

test('prefill seeds the inventory without costing ticks', async () => {
  const result = await runner.run('# { "wood": 5 }\nuse_item(Items.Wood)\nprint(num_items(Items.Wood))\n')
  assert.equal(result.status, 'ok', describe(result))
  assert.deepEqual(result.prefill.items, { wood: 5 })
  assert.deepEqual(result.state?.inventory, { Wood: 4 }, describe(result))
  // 200 for use_item plus 1 for num_items; the five Wood from the comment are free.
  assert.equal(result.state?.ticks, 201, describe(result))
  assert.equal(result.output, '4\n')
})

test('a second comment in the script is not read as prefill', async () => {
  const result = await runner.run('# {"wood": 2}\nprint(\'# {"hay": 9}\')\n')
  assert.equal(result.status, 'ok', describe(result))
  assert.deepEqual(result.prefill.items, { wood: 2 })
  assert.equal(result.output, '# {"hay": 9}\n')
  assert.deepEqual(result.state?.inventory, { Wood: 2 }, describe(result))
})

test('variables from one run do not leak into the next', async () => {
  await runner.run('leaky = 1\n')
  const result = await runner.run('print(leaky)\n')
  assert.equal(result.status, 'error', describe(result))
  assert.equal(result.error?.type, 'NameError')
})

test('the same script run twice produces the same state', async () => {
  const source = '# {"wood": 3}\nmove(North)\nuse_item(Items.Wood)\ntill()\n'
  const first = await runner.run(source)
  const second = await runner.run(source)
  assert.equal(first.status, 'ok', describe(first))
  assert.equal(second.status, 'ok', describe(second))
  assert.deepEqual(second.state, first.state)
  assert.equal(second.output, first.output)
})
