<script setup lang="ts">
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { lorem } from "./lorem";
</script>

<template>
  
  <div class="flex flex-col gap-2">
<Card class="w-full p-2">
    <Accordion type="multiple" class="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>Test</AccordionTrigger>
        <AccordionContent>{{ lorem }}</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Test2</AccordionTrigger>
        <AccordionContent>{{ lorem }}</AccordionContent>
      </AccordionItem>
    </Accordion>
  </Card>
  </div>
</template>
