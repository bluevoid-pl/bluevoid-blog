<template>
	<a
		href="#main-content"
		tabindex="1"
		class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[999] focus:bg-background focus:text-foreground focus:px-4 focus:py-2 focus:rounded-md focus:shadow-lg"
	>
		Skip to content
	</a>
	<header class="h-14 header flex items-center sticky">
		<div class="max-w-6xl mx-auto flex gap-2 justify-between items-center grow">
			<nav class="flex gap-2 items-center">
				<a href="/" class="flex gap-1 items-center font-mono">
					<img class="h-10" src="/logo.png" alt="" />
					Blue Void
				</a>
				<a href="/blog">Blog</a>
				<a href="/projects">Projects</a>
				<a href="/about">About</a>
			</nav>
			<ThemeToggle />
		</div>
	</header>
</template>
