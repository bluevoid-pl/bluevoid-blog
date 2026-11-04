<script setup lang="ts">
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
</script>

<template>
  
  <div class="flex flex-col gap-2">
<NavigationMenu>
    <NavigationMenuList>
      <NavigationMenuItem>
        <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul class="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
            <li class="row-span-3">
              <NavigationMenuLink>
                <a
                  class="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                  href="/"
                >
                  <img src="/placeholder.png" alt="Logo" class="w-6" />
                  <div class="mt-4 mb-2 font-medium text-lg">shadcn/ui</div>
                  <p class="text-muted-foreground text-sm leading-tight">
                    Beautifully designed components that you can copy and paste into your apps.
                    Accessible. Customizable. Open Source.
                  </p>
                </a>
              </NavigationMenuLink>
            </li>
            <li>
              <NavigationMenuLink>
                <a class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground" href="/docs">
                  <div class="font-medium text-sm leading-none">Introduction</div>
                  <p class="line-clamp-2 text-muted-foreground text-sm leading-snug">Re-usable components built using Radix UI and Tailwind CSS.</p>
                </a>
              </NavigationMenuLink>
            </li>
            <li>
              <NavigationMenuLink>
                <a class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground" href="/docs/installation">
                  <div class="font-medium text-sm leading-none">Installation</div>
                  <p class="line-clamp-2 text-muted-foreground text-sm leading-snug">How to install dependencies and structure your app.</p>
                </a>
              </NavigationMenuLink>
            </li>
            <li>
              <NavigationMenuLink>
                <a class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground" href="/docs/primitives/typography">
                  <div class="font-medium text-sm leading-none">Typography</div>
                  <p class="line-clamp-2 text-muted-foreground text-sm leading-snug">Styles for headings, paragraphs, lists...etc</p>
                </a>
              </NavigationMenuLink>
            </li>
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuTrigger>Components</NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul class="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
            <li v-for="component in [
              { title: 'Alert Dialog', href: '/docs/primitives/alert-dialog', description: 'A modal dialog that interrupts the user with important content and expects a response.' },
              { title: 'Hover Card', href: '/docs/primitives/hover-card', description: 'For sighted users to preview content available behind a link.' },
              { title: 'Progress', href: '/docs/primitives/progress', description: 'Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.' },
              { title: 'Scroll-area', href: '/docs/primitives/scroll-area', description: 'Visually or semantically separates content.' },
              { title: 'Tabs', href: '/docs/primitives/tabs', description: 'A set of layered sections of content—known as tab panels—that are displayed one at a time.' },
              { title: 'Tooltip', href: '/docs/primitives/tooltip', description: 'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.' }
            ]" :key="component.title">
              <NavigationMenuLink>
                <a class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground" :href="component.href">
                  <div class="font-medium text-sm leading-none">{{ component.title }}</div>
                  <p class="line-clamp-2 text-muted-foreground text-sm leading-snug">{{ component.description }}</p>
                </a>
              </NavigationMenuLink>
            </li>
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink :class="navigationMenuTriggerStyle()">
          <a href="/test/shadcn">Documentation</a>
        </NavigationMenuLink>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
  </div>
</template>
