<script setup lang="ts">
import { type MessageScrollerProviderProps, provideMessageScroller } from "./useMessageScroller";

const props = defineProps<MessageScrollerProviderProps>();

provideMessageScroller(props);
</script>

<template>
	<slot />
</template>
