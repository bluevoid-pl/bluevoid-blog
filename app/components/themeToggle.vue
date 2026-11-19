<script setup lang="ts">
import { IconCircle, IconMoon, IconSettingsAutomation, IconSun } from "@tabler/icons-vue";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { colorSchemes, useColorScheme, type ColorScheme } from "~/composables/useColorScheme";

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
</script>

<template>
	<DropdownMenu>
		<DropdownMenuTrigger as-child>
			<Button variant="outline" size="icon" class="rounded-full">
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
			<DropdownMenuRadioGroup
				:model-value="colorScheme"
				@update:model-value="(v) => setColorScheme(v as ColorScheme)"
			>
				<DropdownMenuRadioItem
					v-for="scheme in colorSchemes"
					:key="scheme"
					:value="scheme"
				>
					<template #indicator-icon>
						<IconCircle :class="['size-2', schemeColors[scheme]]" />
					</template>
					{{ scheme }}
				</DropdownMenuRadioItem>
			</DropdownMenuRadioGroup>

			<DropdownMenuSeparator />

			<DropdownMenuRadioGroup
				:model-value="colorMode.preference"
				@update:model-value="(v) => (colorMode.preference = v)"
			>
				<DropdownMenuRadioItem value="light">
					<IconSun class="size-4" />
					Light
				</DropdownMenuRadioItem>

				<DropdownMenuRadioItem value="dark">
					<IconMoon class="size-4" />
					Dark
				</DropdownMenuRadioItem>

				<DropdownMenuRadioItem value="system">
					<IconSettingsAutomation class="size-4" />
					System
				</DropdownMenuRadioItem>
			</DropdownMenuRadioGroup>
		</DropdownMenuContent>
	</DropdownMenu>
</template>
