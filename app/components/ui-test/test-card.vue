<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
</script>

<template>
  
  <div class="flex flex-col gap-2">
<Card class="flex gap-4 p-4">
    <Card class="w-96">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <img src="/placeholder.png" alt="test" class="bg-blue-200" />
      </CardContent>
      <CardFooter class="justify-end">
        <Button>Test</Button>
      </CardFooter>
    </Card>
    <Card class="w-96">
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div class="grid w-full items-center gap-4">
            <div class="flex flex-col space-y-1.5 gap-2">
              <Label for="name1">Name</Label>
              <Input id="name1" placeholder="Name of your project" />
              <Input id="name2" placeholder="Name of your project" />
              <Input id="name3" placeholder="Name of your project" />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter class="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter>
    </Card>
  </Card>
  </div>
</template>
