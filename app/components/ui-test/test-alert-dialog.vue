<script setup lang="ts">
import { IconAlertCircle } from '@tabler/icons-vue';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { buttonVariants } from '@/components/ui/button';
</script>

<template>
  <AlertDialog>
    <AlertDialogTrigger :class="buttonVariants({})">Test Alert Dialog</AlertDialogTrigger>
    <AlertDialogContent>
      <div class="flex gap-2">
        <IconAlertCircle size="28" />
        <AlertDialogHeader>
          <AlertDialogTitle>AlertDialog</AlertDialogTitle>
          <AlertDialogDescription>AlertDialog description</AlertDialogDescription>
        </AlertDialogHeader>
      </div>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction>Continue</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
  <AlertDialog>
    <AlertDialogTrigger :class="buttonVariants({ variant: 'destructive' })">
      Test Alert Dialog
    </AlertDialogTrigger>
    <AlertDialogContent>
      <div class="flex gap-2">
        <IconAlertCircle size="28" />
        <AlertDialogHeader>
          <AlertDialogTitle>AlertDialog</AlertDialogTitle>
          <AlertDialogDescription>AlertDialog description</AlertDialogDescription>
        </AlertDialogHeader>
      </div>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction :class="buttonVariants({ variant: 'destructive' })">
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
