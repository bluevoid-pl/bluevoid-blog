<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

useHead({
  title: 'Shadcn Test'
})

import { defineAsyncComponent } from 'vue'

const testNames = [
  'accordion','alert','alert-dialog','aspect-ratio','attachment','avatar','badge','breadcrumb','bubble','button','button-group','calendar','card','carousel','chart','checkbox','code-block','collapsible','combobox','command','context-menu','dialog','drawer','dropdown-menu','empty','field','form','hover-card','input','input-group','input-otp','item','kbd','label','marker','menubar','message','message-scroller','native-select','navigation-menu','pagination','pagination-primitive','popover','progress','questionnaire','radio-group','resizable','scroll-area','select','separator','sheet','sidebar','skeleton','slider','sonner','spinner','switch','table','tabs','textarea','toggle','toggle-group','tooltip','trace'
]

const components = {}
for (const name of testNames) {
  components[name] = defineAsyncComponent(() => import(`@/components/ui-test/test-${name}.vue`))
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-6 py-12 space-y-8">
    <h1 class="text-3xl font-bold">Shadcn Test Components</h1>
    <p>
      Showcase of all test components from <code>app/components/ui-test</code>.
      Total: {{ testNames.length }}
    </p>

    <section class="grid gap-6">
      <div
        v-for="name in testNames"
        :key="name"
        :id="name"
        class="border border-white/10 rounded-xl p-4 bg-white/5"
      >
        <h2 class="text-xl font-semibold mb-4 capitalize">{{ name }}</h2>
        <div class="component-preview">
          <component :is="components[name]" />
        </div>
      </div>
    </section>
  </div>
</template>

