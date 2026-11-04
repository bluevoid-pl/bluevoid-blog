<script setup lang="ts">
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const arr = Array.from({ length: 5 });
</script>

<template>
  
  <div class="flex flex-col gap-2">
<Carousel class="w-full max-w-xl mx-auto" :opts="{ align: 'center', loop: false }">
    <CarouselContent>
      <CarouselItem v-for="(_, index) in arr" :key="index" class="basis-1/3">
        <div class="p-1">
          <Card>
            <CardContent class="flex flex-row items-center justify-center p-6 gap-4">
              <span class="font-semibold text-4xl">{{ index + 1 }}</span>
            </CardContent>
          </Card>
        </div>
      </CarouselItem>
    </CarouselContent>
    <CarouselPrevious />
    <CarouselNext />
  </Carousel>
  </div>
</template>
