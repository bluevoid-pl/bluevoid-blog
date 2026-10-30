<script setup lang="ts">
import { Card } from "@/components/ui/card";
import { ToggleGroup } from "@/components/ui/toggle-group";
import { ToggleGroupItem } from "@/components/ui/toggle-group";
</script>

<template>
  <Card class="p-4">
    <div class="flex flex-col gap-4">
      <div>
        <h4 class="mb-2 text-sm font-medium">Multiple</h4>
        <ToggleGroup variant="outline" type="multiple">
          <ToggleGroupItem value="bold" aria-label="Toggle bold">
            Bold
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Toggle italic">
            Italic
          </ToggleGroupItem>
          <ToggleGroupItem value="underline" aria-label="Toggle underline">
            Underline
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div>
        <h4 class="mb-2 text-sm font-medium">Single</h4>
        <ToggleGroup variant="outline" type="single" default-value="a">
          <ToggleGroupItem value="a" aria-label="A">A</ToggleGroupItem>
          <ToggleGroupItem value="b" aria-label="B">B</ToggleGroupItem>
          <ToggleGroupItem value="c" aria-label="C">C</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div>
        <h4 class="mb-2 text-sm font-medium">Sizes</h4>
        <div class="flex flex-col gap-2">
          <ToggleGroup type="single" size="sm" default-value="sm" variant="outline">
            <ToggleGroupItem value="sm" aria-label="Small">Small</ToggleGroupItem>
            <ToggleGroupItem value="md" aria-label="Medium">Medium</ToggleGroupItem>
          </ToggleGroup>
          <ToggleGroup type="single" default-value="lg" variant="outline">
            <ToggleGroupItem value="lg" aria-label="Large">Large</ToggleGroupItem>
            <ToggleGroupItem value="xl" aria-label="XL">XL</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
    </div>
  </Card>
</template>
