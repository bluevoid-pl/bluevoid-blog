<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from "@/components/ui/button-group";
import { Card } from "@/components/ui/card";
</script>

<template>
  
  <div class="flex flex-col gap-2">
<Card class="w-full p-2">
    <div class="flex flex-col gap-4">
      <ButtonGroup>
        <Button variant="outline">Left</Button>
        <Button variant="outline">Center</Button>
        <Button variant="outline">Right</Button>
      </ButtonGroup>
      <ButtonGroup orientation="vertical">
        <Button variant="outline">Top</Button>
        <ButtonGroupSeparator />
        <Button variant="outline">Bottom</Button>
      </ButtonGroup>
      <ButtonGroup>
        <ButtonGroupText>Prefix</ButtonGroupText>
        <Button variant="outline">Action</Button>
        <ButtonGroupText>Suffix</ButtonGroupText>
      </ButtonGroup>
    </div>
  </Card>
  </div>
</template>
