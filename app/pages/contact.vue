<script setup lang="ts">
definePageMeta({
  layout: "default",
});

import { Card } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { toast } from 'vue-sonner'

useHead(() => ({
  title: 'Contact'
}));

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: '',
});

const submitting = ref(false);

function onSubmit(e: Event) {
  e.preventDefault();
  submitting.value = true;
  // Simulate submission
  setTimeout(() => {
    submitting.value = false;
    toast('Message sent', {
      description: 'Thanks for reaching out! I will get back to you soon.',
    });
    form.value = { name: '', email: '', subject: '', message: '' };
  }, 1000);
}
</script>

<template>
  <div class="mx-auto max-w-7xl px-6 py-10">
    <div class="flex gap-8 items-start">
      <div class="flex-1">
        <div class="max-w-3xl">
          <h1 class="text-4xl font-bold tracking-tight">Contact</h1>
        </div>

        <hr class="border-t border-white/10 my-8" />

        <div class="typeset typeset-docs max-w-3xl">
          <p>
             Hi! I'm Mateusz Kifner. You can reach me via email at <a href="mailto:biznes@bluevoid.pl" class="underline">biznes@bluevoid.pl</a>
             <!-- or fill out the form below.  -->
          </p>
        </div>

        <div class="mt-12">
          <!-- <Card class="p-6">
            <form @submit="onSubmit" class="space-y-6">
              <div class="space-y-2">
                <Label for="name">Name</Label>
                <Input id="name" v-model="form.name" placeholder="Your name" required />
              </div>
              <div class="space-y-2">
                <Label for="email">Email</Label>
                <Input id="email" type="email" v-model="form.email" placeholder="you@example.com" required />
              </div>
              <div class="space-y-2">
                <Label for="subject">Subject</Label>
                <Input id="subject" v-model="form.subject" placeholder="Subject" required />
              </div>
              <div class="space-y-2">
                <Label for="message">Message</Label>
                <Textarea id="message" v-model="form.message" placeholder="Your message..." rows="5" required />
              </div>
              <Button type="submit" :disabled="submitting">
                {{ submitting ? 'Sending...' : 'Send Message' }}
              </Button>
            </form>
          </Card> -->
        </div>
      </div>
    </div>
  </div>
</template>
