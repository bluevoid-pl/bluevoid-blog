import type { ComputedRef, MaybeRefOrGetter } from '#imports'
import { computed, toValue } from '#imports'
import type { TfwrStep } from '~/utils/tfwr-runner'

export const REPLAY_CELL_SIZE = 20
export const REPLAY_WINDOW_SIZE_OPTIONS = [1, 2, 3, 4, 5, 6, 7] as const
export const REPLAY_WINDOW_SIZE_DEFAULT = 3

type ReplayStep = Pick<TfwrStep, 'action' | 'drone' | 'dronePathFrames'>

export interface ReplayPoint {
  x: number
  y: number
  opacity: number
}

export interface ReplayDirectionChanges {
  changes: number
  points: number[]
}

export interface ReplayAction {
  key: string
  action: string
  type: string
  x: number
  y: number
  opacity: number
}

export interface ReplayWindowOptions {
  steps: MaybeRefOrGetter<ReplayStep[]>
  index: MaybeRefOrGetter<number>
  size: MaybeRefOrGetter<number>
  boardSize: MaybeRefOrGetter<number>
}

export interface TfwrReplayWindow {
  replayWindowSize: ComputedRef<number>
  replayWindowStart: ComputedRef<number>
  replayWindowFrames: ComputedRef<number[]>
  replayPath: ComputedRef<ReplayStep[]>
  replayPoints: ComputedRef<ReplayPoint[]>
  replayPathDirectionChanges: ComputedRef<ReplayDirectionChanges>
  replayActions: ComputedRef<ReplayAction[]>
  replayActionMarkers: ComputedRef<ReplayAction[]>
  replaySvgPath: ComputedRef<string>
}

export function clampReplayWindowSize(size: number, options: readonly number[] = REPLAY_WINDOW_SIZE_OPTIONS): number {
  if (options.includes(size))
    return size

  if (size <= options[0]!)
    return options[0]!

  return options.at(-1)!
}

function pointKey(point: { x: number, y: number }): string {
  return `${point.x},${point.y}`
}

function svgPath(points: ReplayPoint[], boardSize: number, cellSize: number): string {
  return points
    .map((point, index) => {
      const x = point.x * cellSize + cellSize / 2
      const y = (boardSize - 1 - point.y) * cellSize + cellSize / 2

      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
    })
    .join(' ')
}

export function useTfwrReplayWindow(options: ReplayWindowOptions): TfwrReplayWindow {
  const steps = computed(() => toValue(options.steps))
  const boardSize = computed(() => toValue(options.boardSize))

  const replayWindowSize = computed(() => clampReplayWindowSize(toValue(options.size)))

  const replayWindowStart = computed(() => {
    const clampedIndex = Math.max(0, Math.min(toValue(options.index), steps.value.length - 1))

    return Math.max(0, clampedIndex - (replayWindowSize.value - 1))
  })

  const replayWindowFrames = computed(() => {
    const clampedIndex = Math.max(0, Math.min(toValue(options.index), steps.value.length - 1))
    const lastFrame = Math.min(clampedIndex, steps.value.length - 1)
    const frames: number[] = []

    for (let frame = replayWindowStart.value; frame <= lastFrame; frame += 1)
      frames.push(frame)

    return frames
  })

  const replayPath = computed(() => steps.value.slice(replayWindowStart.value, replayWindowFrames.value.at(-1)! + 1))

  const replayPoints = computed<ReplayPoint[]>(() => {
    const points: ReplayPoint[] = []

    for (const [index, step] of replayPath.value.entries()) {
      for (const frame of step.dronePathFrames ?? [step.drone]) {
        const key = pointKey(frame)
        const opacity = index === replayPath.value.length - 1 ? 1 : Math.max(0.08, 1 - (replayPath.value.length - index - 1) * 0.22)

        if (points.length && points.at(-1)!.x === frame.x && points.at(-1)!.y === frame.y && points.at(-1)!.opacity < opacity) {
          points.at(-1)!.opacity = opacity
          continue
        }

        if (points.length && points.at(-1)!.x === frame.x && points.at(-1)!.y === frame.y)
          continue

        points.push({ ...frame, opacity })
        points.lastIndexOfKey = key
      }
    }

    return points
  })

  const replayPathDirectionChanges = computed<ReplayDirectionChanges>(() => {
    const changes: number[] = []
    let total = 0

    replayPoints.value.forEach((point, index) => {
      if (index === 0)
        return

      const previous = replayPoints.value[index - 1]!
      const previousPrevious = replayPoints.value[index - 2]
      if (!previousPrevious)
        return

      const previousDirection = `${Math.sign(previous.x - previousPrevious.x)}:${Math.sign(previous.y - previousPrevious.y)}`
      const currentDirection = `${Math.sign(point.x - previous.x)}:${Math.sign(point.y - previous.y)}`

      if (currentDirection === previousDirection)
        return

      total += 1
      changes.push(index)
    })

    return { changes: total, points: changes }
  })

  const replayActions = computed<ReplayAction[]>(() => {
    const latestByType = new Map<string, number>()
    const actions = replayPath.value.flatMap((step, stepIndex) => {
      const action = step.action.trim()
      if (!action || action.startsWith('move(') || action.startsWith('look('))
        return []

      const type = action.split('(')[0]!
      latestByType.set(type, stepIndex)

      return [{
        key: `${stepIndex}-${action}`,
        action,
        type,
        x: step.drone.x,
        y: step.drone.y,
        stepIndex,
      }]
    })

    return actions.map((action, index) => ({
      key: action.key,
      action: action.action,
      type: action.type,
      x: action.x,
      y: action.y,
      opacity: latestByType.get(action.type) === action.stepIndex ? 1 : Math.max(0.16, 0.72 - index * 0.08),
    }))
  })

  const replayActionMarkers = computed(() => replayActions.value)

  const replaySvgPath = computed(() => svgPath(replayPoints.value, boardSize.value, REPLAY_CELL_SIZE))

  return {
    replayWindowSize,
    replayWindowStart,
    replayWindowFrames,
    replayPath,
    replayPoints,
    replayPathDirectionChanges,
    replayActions,
    replayActionMarkers,
    replaySvgPath,
  }
}
