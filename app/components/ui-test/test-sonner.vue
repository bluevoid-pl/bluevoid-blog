<script setup lang="ts">
import { IconAlertCircle, IconX } from "@tabler/icons-vue";
import { Button } from "@/components/ui/button";
import { toast } from "vue-sonner";

const showToast = () => {
  toast("Event has been created", {
    description: "Sunday, December 03, 2023 at 9:00 AM",
  });
};

const showToastWithOptions = () => {
  toast("Event has been created", {
    description: "Sunday, December 03, 2023 at 9:00 AM",
  });
};
</script>

<template>
  
  <div class="flex flex-col gap-2">
<Button variant="outline" @click="showToast">
    Show Toast
  </Button>
  <Button variant="outline" @click="showToastWithOptions">
    Show Toast
  </Button>
  </div>
</template>
