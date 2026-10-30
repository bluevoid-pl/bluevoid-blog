<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Progress } from "@/components/ui/progress";

const progress = ref(13);

onMounted(() => {
  setTimeout(() => {
    progress.value = 66;
  }, 500);
});
</script>

<template>
  <Progress :value="progress" class="w-[60%]" @click="progress = progress - 20 > 0 ? progress - 20 : 100" />
</template>
