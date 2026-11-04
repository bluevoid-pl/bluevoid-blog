<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Progress } from "@/components/ui/progress";

const progress = ref(13);

onMounted(() => {
  setTimeout(() => {
    progress.value = 66;
  }, 500);
});

const handleClick = () => {
  progress.value = progress.value - 20 > 0 ? progress.value - 20 : 100;
};
</script>

<template>
  
  <div class="flex flex-col gap-2">
<Progress :modelValue="progress" class="w-[60%]" @click="handleClick" />
  </div>
</template>
