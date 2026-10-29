<script setup lang="ts">
import NavigationMenu from '~/components/ui/navigation-menu/NavigationMenu.vue'
import NavigationMenuList from '~/components/ui/navigation-menu/NavigationMenuList.vue'
import NavigationMenuItem from '~/components/ui/navigation-menu/NavigationMenuItem.vue'
import NavigationMenuLink from '~/components/ui/navigation-menu/NavigationMenuLink.vue'
import ThemeToggle from '~/components/themeToggle.vue'
</script>

<template>
  <a
    href="#main-content"
    tabindex="1"
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
              <a href="/about" class="px-3 py-2 text-sm font-medium hover:text-foreground/80 transition-colors">About</a>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
        </div>
      <div class="flex items-center gap-2">
        <ThemeToggle />
      </div>
    </div>
  </header>
</template>
