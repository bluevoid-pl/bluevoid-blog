<script setup lang="ts">
import {  useWindowSize } from '@vueuse/core';

const props = defineProps<{
  size?: number
}>()
const { size = 16 } = props
const { width } = useWindowSize({initialWidth:1024})
const square_size = computed(() => {
  const w = Math.min(width.value,1280)
  return Math.max(Math.min(w/(size*2.5),24),6)


})
console.log(square_size)
let blockData: number[][] = []
for (let x_i = 0; x_i < size; x_i++) {
  const row:number[] = []
  for (let y_i = 0; y_i < size; y_i++) {
    row.push(0)
  }
  blockData.push(row)
}



</script>

<template>
    <div class="tfwr_scene">
        <div class="tfwr_row" v-for="(row, index) in blockData" :key="`row_${index}`" :style="`top:${0}px;`">
            <div v-for="(block, index2) in row" :key="`row_${index}_col${index2}`" :style="`top:${0}px;left: ${(Math.floor(size/2)-1-index2)*square_size}px;transform: translateY(160px) translateZ(${index*square_size}px);--size: ${square_size}px;`" class="tfwr_block">

            </div>
        </div>
    </div>
</template>

<style>

/* the parent sets the viewpoint for everything inside it */
.tfwr_scene {
    position: relative;
    width: 0;
    height: 0;
    margin: 0 auto;
}

.tfwr_row {
    perspective:800px;
    perspective-origin: 50% 50%;
    position: absolute;
}

.tfwr_block {
  position: absolute;
  width: var(--size);
  height: var(--size);
  transform-style: preserve-3d; /* keeps the faces in 3D */
}

 .tfwr_block::after, .tfwr_block::before {
  content:'';
  position: absolute;
  inset: 0;
  border: 1px solid #6366f1;
  background: #000;
}

.tfwr_block::after  { transform: translateZ(calc(var(--size)/2)); }
.tfwr_block::before    {  transform: rotateX(90deg) translateZ(calc(var(--size)/2)); }




</style>
