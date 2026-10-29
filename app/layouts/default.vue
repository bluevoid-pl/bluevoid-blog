<template>
	<div class="app-layout relative min-h-screen flex flex-col">
		<div class="gradient-bg">
			<div class="base" />
			<div class="treatment" />
			<div class="glow" />
			<div class="vignette" />
			<div class="noise" />
		</div>

		<Header />
		<main class="app-main p-14 flex-1" id="main-content">
			<slot />
		</main>
		<Footer />
	</div>
</template>

<script setup lang="ts">
import Header from "~/components/Header.vue";
import Footer from "~/components/Footer.vue";
</script>
