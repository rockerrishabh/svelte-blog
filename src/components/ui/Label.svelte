<script lang="ts">
	import { cn } from '$lib/utils/twMerge';
	import type { Snippet } from 'svelte';

	const {
		children,
		class: className,
		htmlFor
	}: { children: Snippet<[]>; class?: string; htmlFor: string } = $props();
</script>

<label
	for={htmlFor}
	class={cn(
		'text-sm leading-none font-medium text-black peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-white',
		className
	)}
>
	{@render children()}
</label>
