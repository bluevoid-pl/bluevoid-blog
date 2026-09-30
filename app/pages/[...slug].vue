<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

const route = useRoute()

const { data: page } = await useAsyncData('page-' + route.path, () => {
  return queryCollection('content').path(route.path).first()
})

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}
</script>

<template>
  <div class="prose prose-invert max-w-none">
    <ContentRenderer
      v-if="page"
      :value="page"
    />
  </div>
</template>
