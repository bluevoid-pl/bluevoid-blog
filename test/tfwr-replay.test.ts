/**
 * Replay window behavior tests using the default TFWR script.
 *
 * The default script is the one shipped with useScripts and is the script
 * users see first in the UI. The test runs it stepped and verifies that the
 * sliding replay window logic used by Map.vue produces the expected points
 * and action slices for a given replayIndex and window size.
 */
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createTestRunner } from './helpers/pyodide.ts'
import type { TfwrStep } from '../app/utils/tfwr-runner.ts'

const runner = createTestRunner()

/** Default script from app/composables/tfwr/useScripts.ts */
function defaultScript(): string {
  return `# {"Hay":100000,"Gold":10000}

#Example: Move and harvest
# Plant grass at start
plant(Entities.Grass)
# Move east twice
move(East)
move(East)
for i in range(10):
    move(East)
for i in range(10):
    move(North)
for i in range(10):
    move(East)
for i in range(10):
    move(North)
# Check entity
if get_entity_type() == Entities.Grass:
    print('Found grass at', get_pos_x(), get_pos_y())
    harvest()
`
}

/** Replicates the replay window point calculation from Map.vue */
function replayPoints(steps: TfwrStep[], replayIndex: number, windowSize = 3) {
  if (!steps || replayIndex < 0) return []
  const startIdx = Math.max(0, replayIndex - (windowSize - 1))
  const endIdx = Math.min(replayIndex, steps.length - 1)
  const points: { x: number; y: number }[] = []
  for (let i = startIdx; i <= endIdx; i++) {
    const step = steps[i]
    if (step && typeof step.x === 'number' && typeof step.y === 'number') {
      points.push({ x: step.x, y: step.y })
    }
  }
  return points
}

/** Replicates the replay action slice from Map.vue */
function replayActions(steps: TfwrStep[], replayIndex: number, windowSize = 3) {
  if (!steps || replayIndex < 0) return []
  const startIdx = Math.max(0, replayIndex - (windowSize - 1))
  const endIdx = Math.min(replayIndex, steps.length - 1)
  const actions: { x: number; y: number; type: 'move' | 'harvest' | 'plant' | 'till'; code: string; index: number }[] = []
  for (let i = startIdx; i <= endIdx; i++) {
    const step = steps[i]
    if (!step || !step.code) continue
    const code = step.code.toLowerCase()
    let type: 'move' | 'harvest' | 'plant' | 'till' | null = null
    if (code.includes('move(')) type = 'move'
    else if (code.includes('harvest(')) type = 'harvest'
    else if (code.includes('plant(')) type = 'plant'
    else if (code.includes('till(')) type = 'till'
    if (type) {
      actions.push({ x: step.x, y: step.y, type, code: step.code, index: i })
    }
  }
  return actions
}

test('replay window slides with default script and window size 3', async () => {
  const run = await runner.runStepped(defaultScript())
  assert.equal(run.status, 'ok', `run failed: ${JSON.stringify(run.error)}`)
  assert.ok(run.state, 'state missing')
  const steps = run.steps
  assert.ok(Array.isArray(steps) && steps.length > 0, 'no steps recorded')

  // Simulate replayIndex at the end of the script
  const replayIndex = steps.length - 1
  const windowSize = 3

  const points = replayPoints(steps, replayIndex, windowSize)
  const actions = replayActions(steps, replayIndex, windowSize)

  // Window should contain at most windowSize points
  assert.ok(points.length <= windowSize, `points length ${points.length} > window ${windowSize}`)

  // startIdx logic
  const expectedStart = Math.max(0, replayIndex - (windowSize - 1))
  const expectedEnd = Math.min(replayIndex, steps.length - 1)
  assert.equal(points.length, expectedEnd - expectedStart + 1, 'points count mismatch')

  // The last point should be the final step's position
  const lastStep = steps[replayIndex]
  assert.deepEqual(points[points.length - 1], { x: lastStep.x, y: lastStep.y }, 'last point mismatch')

  // Actions should be filtered to move/plant/harvest/till and within window
  for (const a of actions) {
    assert.ok(['move', 'plant', 'harvest', 'till'].includes(a.type), `unexpected action type ${a.type}`)
    assert.ok(a.index >= expectedStart && a.index <= expectedEnd, 'action outside window')
  }

  // Verify sliding window for an intermediate index
  const midIndex = Math.floor(steps.length / 2)
  const midPoints = replayPoints(steps, midIndex, windowSize)
  const midStart = Math.max(0, midIndex - (windowSize - 1))
  const midEnd = Math.min(midIndex, steps.length - 1)
  assert.equal(midPoints.length, midEnd - midStart + 1, 'mid window size mismatch')
  assert.deepEqual(midPoints[midPoints.length - 1], { x: steps[midIndex].x, y: steps[midIndex].y }, 'mid last point mismatch')

  // Replay index -1 should produce empty results
  assert.deepEqual(replayPoints(steps, -1, windowSize), [], 'replayIndex -1 should be empty')
  assert.deepEqual(replayActions(steps, -1, windowSize), [], 'replayActions -1 should be empty')
})

test('replay window respects boundaries at start of script', async () => {
  const run = await runner.runStepped(defaultScript())
  assert.equal(run.status, 'ok')
  const steps = run.steps
  assert.ok(steps.length > 0)

  const windowSize = 3
  const replayIndex = 0
  const points = replayPoints(steps, replayIndex, windowSize)

  const expectedStart = 0
  const expectedEnd = 0
  assert.equal(points.length, 1, 'first point should be only step 0')
  assert.deepEqual(points[0], { x: steps[0].x, y: steps[0].y })
})

test('replay window size control changes visible range', async () => {
  const run = await runner.runStepped(defaultScript())
  assert.equal(run.status, 'ok')
  const steps = run.steps
  const replayIndex = 5
  const points3 = replayPoints(steps, replayIndex, 3)
  const points5 = replayPoints(steps, replayIndex, 5)

  // Larger window should include at least as many points as smaller window
  assert.ok(points5.length >= points3.length, 'larger window should not shrink points')
})
