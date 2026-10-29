<script setup lang="ts">
import {
	IconCircle,
	IconMoon,
	IconSettingsAutomation,
	IconSun,
} from "@tabler/icons-vue";
import { computed } from "vue";
import { Button } from "./ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
	colorSchemes,
	useColorScheme,
	type ColorScheme,
} from "~/composables/useColorScheme";

const colorMode = useColorMode();
const { colorScheme, setColorScheme } = useColorScheme();

const schemeColors: Record<ColorScheme, string> = {
	default: "fill-blue-700",
	stone: "fill-stone-700",
	red: "fill-red-700",
	pink: "fill-pink-700",
	orange: "fill-orange-700",
	green: "fill-green-700",
	blue: "fill-blue-700",
	yellow: "fill-yellow-700",
	violet: "fill-violet-700",
};

const currentColorScheme = computed(() => colorScheme.value);
</script>

<template>
	<DropdownMenu>
		<DropdownMenuTrigger as-child>
			<Button variant="outline" size="icon">
				<IconSun
					class="size-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
				/>
				<IconMoon
					class="absolute size-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
				/>
				<span class="sr-only">Toggle theme</span>
			</Button>
		</DropdownMenuTrigger>

		<DropdownMenuContent align="end">
			<DropdownMenuItem
				v-for="scheme in colorSchemes"
				:key="scheme"
				@click="setColorScheme(scheme)"
			>
				<IconCircle
					:class="
						currentColorScheme === scheme
							? schemeColors[scheme]
							: 'text-transparent'
					"
				/>
				{{ scheme }}
			</DropdownMenuItem>

			<DropdownMenuSeparator />

			<DropdownMenuItem @click="colorMode.preference = 'light'">
				<IconSun v-if="colorMode.preference === 'light'" />
				<IconCircle v-else class="text-transparent" />
				Light
			</DropdownMenuItem>

			<DropdownMenuItem @click="colorMode.preference = 'dark'">
				<IconMoon v-if="colorMode.preference === 'dark'" />
				<IconCircle v-else class="text-transparent" />
				Dark
			</DropdownMenuItem>

			<DropdownMenuItem @click="colorMode.preference = 'system'">
				<IconSettingsAutomation v-if="colorMode.preference === 'system'" />
				<IconCircle v-else class="text-transparent" />
				System
			</DropdownMenuItem>
		</DropdownMenuContent>
	</DropdownMenu>
</template>
