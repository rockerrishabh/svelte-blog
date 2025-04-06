<script lang="ts">
	import { cn } from '$lib/utils/twMerge';
	import type { Snippet } from 'svelte';

	const { children, class: className }: { children: Snippet<[]>; class?: string } = $props();
</script>

<p class={cn('mt-8 text-sm leading-relaxed tracking-wide text-zinc-400', className)}>
	{@render children()}
</p>
