<script setup lang="ts">
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { ref, onMounted, onUnmounted } from "vue";

const pressed = ref<string[]>([]);

const allowedModifiers = new Set(["Shift", "Ctrl", "Alt", "Control"]);
const isAllowedKey = (key: string) => {
  if (/^[A-Za-z0-9]$/.test(key)) return true;
  if (allowedModifiers.has(key)) return true;
  return false;
};

const normalizeKey = (key: string) => {
  if (key === "Control") return "Ctrl";
  return key;
};

function onKeyDown(e: KeyboardEvent) {
  const key = normalizeKey(e.key);
  if (!isAllowedKey(key)) return;
  if (!pressed.value.includes(key)) {
    pressed.value = [...pressed.value, key];
  }
}

function onKeyUp(e: KeyboardEvent) {
  const key = normalizeKey(e.key);
  pressed.value = pressed.value.filter(k => k !== key);
}

onMounted(() => {
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
});
onUnmounted(() => {
  window.removeEventListener("keydown", onKeyDown);
  window.removeEventListener("keyup", onKeyUp);
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center gap-2">
      <span class="text-sm text-muted-foreground">Currently pressed:</span>
      <KbdGroup v-if="pressed.length">
        <Kbd v-for="(key, i) in pressed" :key="key + i">
          {{ key }}
        </Kbd>
      </KbdGroup>
      <KbdGroup v-else>
        <Kbd>None</Kbd>
      </KbdGroup>
    </div>

    <div class="flex items-center gap-2 text-sm">
      <span>Example:</span>
      <Kbd>Ctrl</Kbd>
      <span>+</span>
      <Kbd>C</Kbd>
      <span>to copy</span>
    </div>
  </div>
</template>
