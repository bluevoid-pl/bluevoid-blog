import { computed, ref, watch } from 'vue'

const STORAGE_KEY = 'tfwr-scripts'
const MAX_SCRIPTS = 10

export interface TfwrScript {
  name: string
  code: string
}

const defaultScript = (): TfwrScript => ({
  name: 'main',
  code: `# {"Hay":100000,"Gold":10000}

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
`,
})

/**
 * Multi-script editor state persisted to localStorage. Keeps one active
 * script; others keep their unsaved code because every change is stored.
 */
export function useScripts() {
  const scripts = ref<TfwrScript[]>([defaultScript()])
  const activeIndex = ref(0)
  const hydrated = ref(false)

  const active = computed({
    get: () => scripts.value[activeIndex.value],
    set: (value: TfwrScript) => {
      scripts.value[activeIndex.value] = value
    },
  })

  function hydrate() {
    if (hydrated.value || typeof localStorage === 'undefined') return
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as unknown
        if (Array.isArray(parsed) && parsed.length) {
          scripts.value = parsed.filter(isScript).slice(0, MAX_SCRIPTS)
          activeIndex.value = Math.min(activeIndex.value, scripts.value.length - 1)
        }
      }
    }
    catch {
      // Ignore corrupt storage and start fresh
    }
    hydrated.value = true
  }

  function persist() {
    if (typeof localStorage === 'undefined') return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(scripts.value))
    }
    catch {
      // Ignore quota errors
    }
  }

  watch(scripts, persist, { deep: true })

  function setActive(index: number) {
    if (index >= 0 && index < scripts.value.length) {
      activeIndex.value = index
    }
  }

  function addScript() {
    if (scripts.value.length >= MAX_SCRIPTS) return
    let suffix = 1
    while (scripts.value.some(s => s.name === `script${suffix}`)) suffix++
    scripts.value.push({ name: `script${suffix}`, code: '' })
    activeIndex.value = scripts.value.length - 1
  }

  function duplicateScript() {
    if (scripts.value.length >= MAX_SCRIPTS) return
    const source = scripts.value[activeIndex.value]
    let suffix = 1
    while (scripts.value.some(s => s.name === `${source.name} copy ${suffix}`)) suffix++
    scripts.value.push({ name: `${source.name} copy ${suffix}`, code: source.code })
    activeIndex.value = scripts.value.length - 1
  }

  function closeScript(index = activeIndex.value) {
    if (scripts.value.length <= 1) return
    scripts.value.splice(index, 1)
    if (activeIndex.value >= scripts.value.length) {
      activeIndex.value = scripts.value.length - 1
    }
  }

  function renameScript(index: number, name: string) {
    const trimmed = name.trim()
    if (trimmed) scripts.value[index].name = trimmed
  }

  return {
    scripts,
    activeIndex,
    active,
    hydrate,
    setActive,
    addScript,
    duplicateScript,
    closeScript,
    renameScript,
  }
}

function isScript(value: unknown): value is TfwrScript {
  return typeof value === 'object' && value !== null
    && typeof (value as TfwrScript).name === 'string'
    && typeof (value as TfwrScript).code === 'string'
}
