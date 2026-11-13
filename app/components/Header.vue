<script setup lang="ts">
import NavigationMenu from '~/components/ui/navigation-menu/NavigationMenu.vue'
import NavigationMenuList from '~/components/ui/navigation-menu/NavigationMenuList.vue'
import NavigationMenuItem from '~/components/ui/navigation-menu/NavigationMenuItem.vue'
import NavigationMenuLink from '~/components/ui/navigation-menu/NavigationMenuLink.vue'
import ThemeToggle from '~/components/themeToggle.vue'
import { Button } from '~/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '~/components/ui/sheet'
import { IconMenu2 } from '@tabler/icons-vue'
</script>

<template>
  <a
    href="#main-content"
    tabindex="0"
    class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[999] focus:bg-background focus:text-foreground focus:px-4 focus:py-2 focus:rounded-md focus:shadow-lg"
  >
    Skip to content
  </a>
  <header class="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 header">
    <div class="mx-auto max-w-6xl flex h-16 items-center justify-between px-4 gap-4">
      <div class="flex items-center gap-2">
        <a href="/" class="flex items-center gap-3">
          <img class="h-8 w-8" src="/logo.png" alt="Blue Void logo" />
          <span class="text-lg font-semibold tracking-tight">Blue Void</span>
        </a>

        <NavigationMenu class="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink as-child>
                <a href="/blog" class="px-3 py-2 text-sm font-medium hover:text-foreground/80 transition-colors">Blog</a>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink as-child>
                <a href="/projects" class="px-3 py-2 text-sm font-medium hover:text-foreground/80 transition-colors">Projects</a>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink as-child>
                <a href="/korki" class="px-3 py-2 text-sm font-medium hover:text-foreground/80 transition-colors">
                  <span class="inline-flex items-center gap-1">
                    <img src="/PL.svg" alt="PL" class="h-3 w-3 flex-shrink-0  translate-y-0.5" /> Korki
                  </span>
                </a>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink as-child>
                <a href="/about" class="px-3 py-2 text-sm font-medium hover:text-foreground/80 transition-colors">About</a>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div class="flex items-center gap-2">
        <ThemeToggle />
        <!-- Mobile menu trigger -->
        <Sheet>
          <SheetTrigger as-child>
            <Button variant="ghost" size="icon" class="md:hidden">
              <IconMenu2 class="h-5 w-5" />
              <span class="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" class="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div class="flex flex-col gap-4 mt-6">
              <a href="/blog" class="px-3 py-2 text-sm font-medium hover:text-foreground/80 transition-colors">Blog</a>
              <a href="/projects" class="px-3 py-2 text-sm font-medium hover:text-foreground/80 transition-colors">Projects</a>
              <a href="/about" class="px-3 py-2 text-sm font-medium hover:text-foreground/80 transition-colors">About</a>
              <a href="/korki" class="px-3 py-2 text-sm font-medium hover:text-foreground/80 transition-colors">
                <span class="inline-flex items-center gap-1">
                  <img src="/PL.svg" alt="PL" class="h-3 w-3 flex-shrink-0" /> Korki
                </span>
              </a>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  </header>
</template>
