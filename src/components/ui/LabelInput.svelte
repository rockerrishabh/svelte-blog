<script lang="ts">
	import { cn } from '$lib/utils/twMerge';
	import type { Snippet } from 'svelte';

	const { children, class: className }: { children: Snippet<[]>; class?: string } = $props();
</script>

<div class={cn('flex w-full flex-col space-y-2', className)}>
	{@render children()}
</div>
