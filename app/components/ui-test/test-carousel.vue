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
  <Carousel class="w-full max-w-xs">
    <CarouselContent>
      <CarouselItem v-for="(_, index) in arr" :key="index">
        <div class="p-1">
          <Card>
            <CardContent class="flex aspect-square items-center justify-center p-6">
              <span class="font-semibold text-4xl">{{ index + 1 }}</span>
            </CardContent>
          </Card>
        </div>
      </CarouselItem>
    </CarouselContent>
    <CarouselPrevious />
    <CarouselNext />
  </Carousel>
</template>
