<script setup lang="ts">
definePageMeta({
	layout: "default",
});

const route = useRoute();

const { data: page } = await useAsyncData("page-" + route.path, () => {
	return queryCollection("content").path(route.path).first();
});

if (!page.value) {
	throw createError({ statusCode: 404, statusMessage: "Page not found" });
}

if (page.value.enabled === false) {
	throw createError({ statusCode: 404, statusMessage: "Page not found" });
}

useHead(() => ({
  title: page.value?.title
}));
</script>

<template>
	<div class="typeset typeset-korki max-w-3xl mx-auto px-6 py-10">
		<ContentRenderer v-if="page" :value="page" />
	</div>
</template>
