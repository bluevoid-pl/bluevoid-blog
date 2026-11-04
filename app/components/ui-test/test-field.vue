<script setup lang="ts">
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
</script>

<template>
  
  <div class="flex flex-col gap-2">
<div class="w-full max-w-md">
    <FieldGroup>
      <FieldSet>
        <FieldLegend>Profile</FieldLegend>
        <FieldDescription>This appears on invoices and emails.</FieldDescription>
        <FieldGroup>
          <Field>
            <FieldLabel for="name">Full name</FieldLabel>
            <Input id="name" autocomplete="off" placeholder="Evil Rabbit" />
            <FieldDescription>This appears on invoices and emails.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel for="username">Username</FieldLabel>
            <Input id="username" autocomplete="off" aria-invalid />
            <FieldDescription>Choose another username.</FieldDescription>
          </Field>
          <Field orientation="horizontal">
            <Checkbox id="newsletter" />
            <FieldLabel for="newsletter">Subscribe to the newsletter</FieldLabel>
          </Field>
        </FieldGroup>
      </FieldSet>
      <FieldSeparator />
      <FieldSet>
        <FieldLegend variant="label">Preferences</FieldLegend>
        <FieldGroup>
          <Field orientation="horizontal">
            <FieldLabel for="theme">Dark mode</FieldLabel>
            <Input id="theme" type="text" placeholder="auto" />
          </Field>
        </FieldGroup>
      </FieldSet>
    </FieldGroup>
  </div>
  </div>
</template>
