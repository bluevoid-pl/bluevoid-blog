<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'

const props = defineProps<{
  size?: number
  crops?: string[][]
}>()
const { size = 32, crops = [["grass","","grass"],["","",""],["","",""]] } = props
// Add new crop renderers here; grid cells refer to these names via `crops[row][column]`.
const cropAssets: Record<string, string> = {
  grass: '/tfwr/grain.svg',
}
const blockSize = ref([24])
const square_size = computed(() => blockSize.value[0] ?? 24)
const blockData = computed(() => Array.from({ length: size }, (_, row) =>
  Array.from({ length: size }, (_, column) => ({
    crop: crops?.[row]?.[column],
    cropAsset: cropAssets[crops?.[row]?.[column] ?? ''],
  })),
))



</script>

<template>
    <main class="tfwr_page">
      <Card class="tfwr_card">
        <CardHeader>
          <CardTitle>Field renderer</CardTitle>
        </CardHeader>
        <CardContent class="space-y-5">
          <div class="space-y-2">
            <div class="flex items-center justify-between text-sm">
              <label for="block-size">Block size</label>
              <span>{{ square_size }} px</span>
            </div>
            <Slider id="block-size" v-model="blockSize" :min="8" :max="100" :step="1" :aria-label="'Block size'" />
          </div>
          <div class="tfwr_renderer border-border bg-muted/20">
            <div class="tfwr_scene">
              <div class="tfwr_row" v-for="(row, index) in blockData" :key="`row_${index}`" :style="`top:${0}px;`">
                <div v-for="(block, index2) in row" :key="`row_${index}_col${index2}`" :style="`top:${0}px;left: ${((size-1)/2-0.5-index2)*square_size}px;transform: translateY(160px) translateZ(${index*square_size}px);--size: ${square_size}px;`" class="tfwr_block">
                  <img v-if="block.cropAsset" class="tfwr_crop" :src="block.cropAsset" :alt="block.crop" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
</template>

<style>

.tfwr_page {
  width: 100%;
  padding: 1rem;
}

.tfwr_card {
  width: min(100%, 64rem);
  margin: 0 auto;
}

.tfwr_renderer {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: 0.5rem;
}

/* the parent sets the viewpoint for everything inside it */
.tfwr_scene {
    position: relative;
    width: 0;
    height: 0;
    left: 50%;
    top: 0;
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

.tfwr_crop {
  position: absolute;
  z-index: 2;
  left: 0;
  bottom: 60%;
  width: 100%;
  height: 200%;
  object-fit: contain;
  transform: translateZ(calc(var(--size) / 2 + 1px));
  pointer-events: none;
}

 .tfwr_block::after, .tfwr_block::before {
  content:'';
  position: absolute;
  inset: 0;
  z-index: 0;
  border: 1px solid #6366f1;
  background: #000;
}

.tfwr_block::after  { transform: translateZ(calc(var(--size)/2)); }
.tfwr_block::before    {  transform: rotateX(90deg) translateZ(calc(var(--size)/2)); }




</style>
