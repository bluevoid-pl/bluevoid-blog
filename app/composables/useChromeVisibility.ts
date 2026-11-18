import { useLocalStorage } from "@vueuse/core";

/** Attribute on <html> that the stylesheet uses to hide the site header and footer. */
export const CHROME_HIDDEN_ATTRIBUTE = "data-chrome-hidden";

/**
 * Reflects the hidden state into the document so CSS can drop the header and footer.
 * Keeping this in one place means the attribute never drifts from the stored state.
 */
export function applyChromeVisibility(hidden: boolean) {
	if (!import.meta.client) return;

	document.documentElement.toggleAttribute(CHROME_HIDDEN_ATTRIBUTE, hidden);
}

export function useChromeVisibility() {
	const hideChrome = useLocalStorage<boolean>("hide-chrome", false);

	function toggleChrome() {
		hideChrome.value = !hideChrome.value;
	}

	return {
		hideChrome,
		toggleChrome,
	};
}
