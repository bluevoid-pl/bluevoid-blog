<script setup lang="ts">
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
</script>

<template>
  
  <div class="flex flex-col gap-2">
<div class="grid gap-6">
    <div class="grid gap-4">
      <Label>Select your preferred contact method</Label>
      <RadioGroup default-value="email" class="grid grid-cols-1 gap-4">
        <div class="flex items-center space-x-2 gap-2">
          <RadioGroupItem value="email" id="email" />
          <Label for="email">Email</Label>
        </div>
        <div class="flex items-center space-x-2 gap-2">
          <RadioGroupItem value="phone" id="phone" />
          <Label for="phone">Phone</Label>
        </div>
        <div class="flex items-center space-x-2 gap-2">
          <RadioGroupItem value="sms" id="sms" />
          <Label for="sms">SMS</Label>
        </div>
      </RadioGroup>
    </div>

    <div class="grid gap-4">
      <Label>Choose a plan</Label>
      <RadioGroup default-value="pro" class="grid grid-cols-3 gap-4">
        <div class="flex items-center space-x-2 gap-2">
          <RadioGroupItem value="free" id="free" />
          <Label for="free">Free</Label>
        </div>
        <div class="flex items-center space-x-2 gap-2">
          <RadioGroupItem value="pro" id="pro" />
          <Label for="pro">Pro</Label>
        </div>
        <div class="flex items-center space-x-2 gap-2">
          <RadioGroupItem value="enterprise" id="enterprise" />
          <Label for="enterprise">Enterprise</Label>
        </div>
      </RadioGroup>
    </div>
  </div>
  </div>
</template>
