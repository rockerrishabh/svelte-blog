<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/twMerge';

	const { children, class: className }: { children: Snippet<[]>; class?: string } = $props();
</script>

<div
	class={cn(
		'relative z-20 h-full w-full overflow-hidden rounded-2xl border border-transparent bg-black p-4 group-hover:border-slate-700 dark:border-white/[0.2]',
		className
	)}
>
	<div class="relative z-50">
		<div class="p-4">{@render children()}</div>
	</div>
</div>
