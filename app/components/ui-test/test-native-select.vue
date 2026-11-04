<script setup lang="ts">
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
</script>

<template>
  
  <div class="flex flex-col gap-2">
<div class="flex flex-col gap-4">
    <NativeSelect>
      <NativeSelectOption value="apple">Apple</NativeSelectOption>
      <NativeSelectOption value="banana">Banana</NativeSelectOption>
      <NativeSelectOption value="blueberry">Blueberry</NativeSelectOption>
      <NativeSelectOption value="grapes">Grapes</NativeSelectOption>
      <NativeSelectOption value="pineapple">Pineapple</NativeSelectOption>
    </NativeSelect>

    <NativeSelect>
      <NativeSelectOption value="est">Eastern Standard Time (EST)</NativeSelectOption>
      <NativeSelectOption value="cst">Central Standard Time (CST)</NativeSelectOption>
      <NativeSelectOption value="mst">Mountain Standard Time (MST)</NativeSelectOption>
      <NativeSelectOption value="pst">Pacific Standard Time (PST)</NativeSelectOption>
    </NativeSelect>

    <NativeSelect disabled>
      <NativeSelectOption value="disabled">Disabled Select</NativeSelectOption>
    </NativeSelect>
  </div>
  </div>
</template>
