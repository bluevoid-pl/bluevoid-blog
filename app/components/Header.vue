<script setup lang="ts">
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, NavigationMenuLink } from '~/components/ui/navigation-menu'
import ThemeToggle from '~/components/themeToggle.vue'
import { Button } from '~/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '~/components/ui/sheet'
import { IconMenu2 } from '@tabler/icons-vue'
</script>

<template>
  <a
    href="#main-content"
    data-site-chrome="header"
    class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[999] focus:bg-background focus:text-foreground focus:px-4 focus:py-2 focus:rounded-md focus:shadow-lg"
  >
    Skip to content
  </a>
  <header data-site-chrome="header" class="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 header">
    <div class="mx-auto max-w-7xl flex h-16 items-center justify-between px-4 gap-4">
      <div class="flex items-center gap-2">
        <a href="/" class="flex items-center gap-3">
          <img class="h-8 w-8" src="/logo.png" alt="" width="32" height="32" />
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
                <a href="/korki" class="px-3 py-2 text-sm font-medium hover:text-foreground/80 transition-colors">
                  <span class="inline-flex items-center gap-1">
                    <img src="/PL.svg" alt="" width="12" height="12" class="h-3 w-3 shrink-0 translate-y-0.5" /> Korki
                  </span>
                </a>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink as-child>
                <a href="/about" class="px-3 py-2 text-sm font-medium hover:text-foreground/80 transition-colors">About</a>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink as-child>
                <a href="/contact" class="px-3 py-2 text-sm font-medium hover:text-foreground/80 transition-colors">Contact</a>
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
            <div class="mt-6 flex flex-col gap-1">
              <a href="/blog" class="flex min-h-11 items-center px-3 text-sm font-medium transition-colors hover:text-foreground/80">Blog</a>
              <a href="/about" class="flex min-h-11 items-center px-3 text-sm font-medium transition-colors hover:text-foreground/80">About</a>
              <a href="/contact" class="flex min-h-11 items-center px-3 text-sm font-medium transition-colors hover:text-foreground/80">Contact</a>
              <a href="/korki" class="flex min-h-11 items-center gap-1 px-3 text-sm font-medium transition-colors hover:text-foreground/80">
                <img src="/PL.svg" alt="" width="12" height="12" class="h-3 w-3 shrink-0" /> Korki
              </a>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  </header>
</template>
