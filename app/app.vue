<script lang="ts" setup>
  try {
    const stored = window.localStorage.getItem("theme") as string;
    const mode = stored === "light" || stored === "dark" || stored === "auto" ? stored : "auto";
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const resolved = mode === "auto" ? (prefersDark ? "dark" : "light") : mode;
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(resolved);
    if (mode === "auto") {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", mode);
    }
    root.style.colorScheme = resolved;
  } catch {}
</script>

<template>
  <NuxtRouteAnnouncer />
  <div class="gradient-bg">
    <div class="base" />
    <div class="treatment" />
    <div class="glow" />
    <div class="vignette" />
    <div class="noise" />
  </div>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
