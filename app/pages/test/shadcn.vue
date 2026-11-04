<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

useHead({
  title: 'Shadcn Test'
})

import { defineAsyncComponent } from 'vue'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const testNames = [
  'accordion','alert','alert-dialog','aspect-ratio','attachment','avatar','badge','breadcrumb','bubble','button','button-group','calendar','card','carousel','chart','checkbox','code-block','collapsible','combobox','command','context-menu','dialog','drawer','dropdown-menu','empty','field','form','hover-card','input','input-group','input-otp','item','kbd','label','marker','menubar','message','message-scroller','native-select','navigation-menu','pagination','pagination-primitive','popover','progress','questionnaire','radio-group','resizable','scroll-area','select','separator','sheet','sidebar','skeleton','slider','sonner','spinner','switch','table','tabs','textarea','toggle','toggle-group','tooltip','trace'
]

const components = {}
for (const name of testNames) {
  components[name] = defineAsyncComponent(() => import(`@/components/ui-test/test-${name}.vue`))
}

const rawModules = import.meta.glob('@/components/ui-test/test-*.vue', { as: 'raw', eager: true })
const sourceMap = Object.fromEntries(
  Object.entries(rawModules).map(([path, mod]) => {
    const match = path.match(/test-(.+)\.vue$/)
    const name = match?.[1]
    return [name, mod.default]
  })
)
</script>

<template>
  <div class="max-w-7xl mx-auto px-6 py-12 space-y-8">
    <h1 class="text-3xl font-bold">Shadcn Test Components</h1>
    <p>
      Showcase of all test components from <code>app/components/ui-test</code>.
      Total: {{ testNames.length }}
    </p>

    <div class="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 items-start">
      <!-- Index / Table of Contents -->
      <aside class="lg:sticky top-24 h-fit">
        <div class="border border-white/10 rounded-xl p-4 bg-white/5">
          <h2 class="text-lg font-semibold mb-4">Components Index</h2>
          <nav>
            <ul class="space-y-1 max-h-[70vh] overflow-auto pr-2">
              <li v-for="name in testNames" :key="name">
                <a
                  :href="`#${name}`"
                  class="block px-3 py-2 rounded-md text-sm hover:bg-white/10 transition-colors capitalize"
                >
                  {{ name }}
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      <!-- Components -->
      <section class="space-y-8">
        <div
          v-for="name in testNames"
          :key="name"
          :id="name"
          class="border border-white/10 rounded-xl p-4 bg-white/5 scroll-mt-24"
        >
          <Tabs default-value="preview" class="w-full">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-semibold capitalize">{{ name }}</h2>
              <TabsList>
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="code">Code</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="preview">
              <div class="component-preview">
                <component :is="components[name]" />
              </div>
            </TabsContent>
            <TabsContent value="code">
              <pre class="mt-4 overflow-auto text-sm bg-black/20 rounded-md p-4"><code>{{ sourceMap[name] }}</code></pre>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
html {
  scroll-behavior: smooth;
}
</style>

