<template>
	<div class="app-layout relatve">
		<div class="gradient-bg">
			<div class="base" />
			<div class="treatment" />
			<div class="glow" />
			<div class="vignette" />
			<div class="noise" />
		</div>

		<Header />
		<main class="app-main p-14" id="main-content">
			<slot />
		</main>
	</div>
</template>

<script setup lang="ts">
import Header from "~/components/Header.vue";
</script>
