<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import Progress from '@/components/ui/progress/Progress.vue'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'

type Variant = 'standardowa' | 'dodatkowa' | 'stara' | 'próbna'
const variants: Variant[] = ['standardowa', 'dodatkowa', 'stara', 'próbna']

type VariantState = { main: boolean; tasks: boolean[] }
type YearData = Record<Variant, VariantState>
type State = Record<number, YearData>

const currentYear = new Date().getFullYear()
const years = Array.from({ length: 11 }, (_, i) => (currentYear + 1) - i) // current year +1 to current year -9

const storageKey = 'matura_checklist_state_v3'

const makeYearData = (): YearData => {
  return Object.fromEntries(
    variants.map(v => [v, { main: false, tasks: Array(10).fill(false) }])
  ) as YearData
}

const state = ref<State>(
  years.reduce((acc, y) => {
    acc[y] = makeYearData()
    return acc
  }, {} as Record<number, YearData>)
)

const openItems = ref<string[]>([])

const isDragging = ref(false)

onMounted(() => {
  const raw = localStorage.getItem(storageKey)
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as Record<string, any>
      years.forEach(y => {
        const rawYear = parsed[String(y)]
        if (rawYear) {
          const yd: YearData = makeYearData()
          variants.forEach(v => {
            const val = rawYear[v]
            if (val && typeof val === 'object' && Array.isArray(val.tasks)) {
              yd[v].main = !!val.main
              yd[v].tasks = val.tasks.slice(0, 10).map(Boolean)
            } else if (Array.isArray(val)) {
              yd[v].tasks = val.slice(0, 10).map(Boolean)
            } else if (typeof val === 'boolean') {
              yd[v].main = val
            }
          })
          state.value[y] = yd
        }
      })
    } catch {
      // ignore
    }
  }
  // open only if not 100% completed
  const initialOpen = years.filter(y => progress(y) !== 100).map(String)
  openItems.value = initialOpen
})

watch(state, () => {
  localStorage.setItem(storageKey, JSON.stringify(state.value))
  // auto-close when a year reaches 100%, reopen if unchecked
  years.forEach(y => {
    const str = String(y)
    if (progress(y) === 100 && openItems.value.includes(str)) {
      openItems.value = openItems.value.filter(v => v !== str)
    } else if (progress(y) < 100 && !openItems.value.includes(str)) {
      openItems.value = [...openItems.value, str]
    }
  })
}, { deep: true })

const startDrag = () => {
  isDragging.value = true
}
const endDrag = () => {
  isDragging.value = false
}
const handleHover = (year: number, variant: Variant, idx: number | null) => {
  if (!isDragging.value) return
  if (idx === null) {
    state.value[year][variant].main = !state.value[year][variant].main
  } else {
    state.value[year][variant].tasks[idx] = !state.value[year][variant].tasks[idx]
  }
}

const progress = (year: number) => {
  const yd = state.value[year]
  let checked = 0
  let total = 0
  variants.forEach(v => {
    const vs = yd[v]
    checked += vs.main ? 1 : 0
    total += 1
    checked += vs.tasks.filter(Boolean).length
    total += 10
  })
  return total ? Math.round((checked / total) * 100) : 0
}
</script>

<template>
  <div class="mx-auto max-w-5xl px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">Matura checklista</h1>
    <Card class="w-full py-0">
      <Accordion type="multiple" v-model="openItems" class="space-y-0">
        <div v-for="year in years" :key="year">
          <AccordionItem :value="String(year)" :class="year === years[years.length - 1] ? 'border-b-0' : '!border-b'">
            <AccordionTrigger class="flex items-center justify-between w-full px-4 py-3">
              <span class="text-xl font-semibold">Matura {{ year }}</span>
              <div class="flex items-center gap-3">
                <span class="text-sm font-medium w-12 text-right">{{ progress(year) }}%</span>
                <Progress :modelValue="progress(year)" class="w-48 h-2" />
              </div>
            </AccordionTrigger>
            <AccordionContent class="px-4 pt-2 pb-4">
              <div class="grid grid-cols-4 gap-6" @pointerdown="startDrag" @pointerup="endDrag" @pointerleave="endDrag">
                <div v-for="variant in variants" :key="variant" class="space-y-2">
                  <Label
                    class="font-semibold capitalize cursor-pointer select-none"
                    @pointerenter="handleHover(year, variant, null)"
                  >
                    <Checkbox v-model="state[year][variant].main" class="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600 data-[state=checked]:text-white" />
                    <span class="ml-2 font-bold">{{ variant }}</span>
                  </Label>
                  <div class="space-y-1 pl-6">
                    <Label
                      v-for="i in Array.from({ length: 10 }, (_, idx) => idx)"
                      :key="i"
                      class="text-sm cursor-pointer select-none"
                      @pointerenter="handleHover(year, variant, i)"
                    >
                      <Checkbox v-model="state[year][variant].tasks[i]" class="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600 data-[state=checked]:text-white" />
                      <span class="ml-2">Zad. {{ i + 1 }}</span>
                    </Label>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </div>
      </Accordion>
    </Card>
  </div>
</template>

<style scoped>
:deep([data-slot="progress"]) {
  background-color: rgba(34, 197, 94, 0.2) !important;
}
:deep([data-slot="progress-indicator"]) {
  background-color: rgb(34, 197, 94) !important;
}
:deep(.space-y-0 > div:last-child [data-slot="accordion-content"]) {
  padding-bottom: 0 !important;
}
</style>
