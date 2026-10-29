import { useLocalStorage } from "@vueuse/core";

export const colorSchemes = [
	"default",
	"stone",
	"red",
	"pink",
	"orange",
	"green",
	"blue",
	"yellow",
	"violet",
] as const;

export type ColorScheme = (typeof colorSchemes)[number];

export function useColorScheme(defaultValue: ColorScheme = "default") {
	const colorScheme = useLocalStorage<ColorScheme>(
		"color-scheme",
		defaultValue,
	);

	function setColorScheme(value: ColorScheme) {
		colorScheme.value = value;

		if (import.meta.client) {
			document.documentElement.setAttribute("data-color-scheme", value);
		}
	}

	return {
		colorScheme,
		setColorScheme,
	};
}
