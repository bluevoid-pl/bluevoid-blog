<script setup lang="tsx">
import { ref } from 'vue'
import { IconMinus, IconPlus } from "@tabler/icons-vue";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "cn";

function ProfileForm(props: { class?: string }) {
  return (
    <form class={cn("grid items-start gap-4", props.class)}>
      <div class="grid gap-2">
        <Label for="email">Email</Label>
        <Input type="email" id="email" default-value="shadcn@example.com" />
      </div>
      <div class="grid gap-2">
        <Label for="username">Username</Label>
        <Input id="username" default-value="@shadcn" />
      </div>
      <Button type="submit">Save changes</Button>
    </form>
  )
}

const open = ref(false)
const goal = ref(350)

function onClick(adjustment: number) {
  goal.value = Math.max(200, Math.min(400, goal.value + adjustment))
}
</script>

<template>
  <Drawer>
    <DrawerTrigger as-child>
      <Button variant="outline">Open Drawer</Button>
    </DrawerTrigger>
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>Are you sure absolutely sure?</DrawerTitle>
        <DrawerDescription>This action cannot be undone.</DrawerDescription>
      </DrawerHeader>
      <DrawerFooter>
        <Button>Submit</Button>
        <DrawerClose as-child>
          <Button variant="outline">Cancel</Button>
        </DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  </Drawer>
  <Drawer>
    <DrawerTrigger as-child>
      <Button variant="outline">Open Drawer</Button>
    </DrawerTrigger>
    <DrawerContent>
      <div class="mx-auto w-full max-w-sm">
        <DrawerHeader>
          <DrawerTitle>Move Goal</DrawerTitle>
          <DrawerDescription>Set your daily activity goal.</DrawerDescription>
        </DrawerHeader>
        <div class="p-4 pb-0">
          <div class="flex items-center justify-center space-x-2">
            <Button variant="outline" size="icon" class="h-8 w-8 shrink-0 rounded-full" :disabled="goal <= 200" @click="onClick(-10)">
              <IconMinus class="h-4 w-4" />
              <span class="sr-only">Decrease</span>
            </Button>
            <div class="flex-1 text-center">
              <div class="font-bold text-7xl tracking-tighter">{{ goal }}</div>
              <div class="text-[0.70rem] text-muted-foreground uppercase">Calories/day</div>
            </div>
            <Button variant="outline" size="icon" class="h-8 w-8 shrink-0 rounded-full" :disabled="goal >= 400" @click="onClick(10)">
              <IconPlus class="h-4 w-4" />
              <span class="sr-only">Increase</span>
            </Button>
          </div>
          <div class="mt-3 h-[120px]">
            <img src="/placeholder.png" alt="test" class="h-full w-full rounded-md bg-red-200 object-cover" />
          </div>
        </div>
        <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose as-child>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </div>
    </DrawerContent>
  </Drawer>
</template>
