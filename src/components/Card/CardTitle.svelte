<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/twMerge';

	const { children, class: className }: { children: Snippet<[]>; class?: string } = $props();
</script>

<h4 class={cn('mt-4 font-bold tracking-wide text-zinc-100', className)}>
	{@render children()}
</h4>
