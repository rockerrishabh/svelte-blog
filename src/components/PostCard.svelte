<script lang="ts">
	import { cn } from '$lib/utils/twMerge';
	import { AnimatePresence, Motion } from 'svelte-motion';
	import type { Post } from '$lib/server/db/schemas/posts';
	import Card from './Card/Card.svelte';
	import CardTitle from './Card/CardTitle.svelte';
	import CardDescription from './Card/CardDescription.svelte';

	const { posts, class: className }: { posts: Post[]; class?: string } = $props();
	let hoveredIndex = $state<number | null>(null);
</script>

<div
	class={cn(
		'grid grid-cols-1 gap-4 py-10 md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-8',
		className
	)}
>
	{#each posts as post, idx}
		<a
			href={`/post/${post.id}`}
			class="group relative block h-full w-full p-2 transition-transform duration-200 hover:scale-[1.02]"
			onmouseenter={() => (hoveredIndex = idx)}
			onmouseleave={() => (hoveredIndex = null)}
		>
			<AnimatePresence>
				{#if hoveredIndex === idx}
					<Motion
						let:motion
						layoutId="hoverBackground"
						initial={{ opacity: 0 }}
						animate={{
							opacity: 1,
							transition: { duration: 0.15 }
						}}
						exit={{
							opacity: 0,
							transition: { duration: 0.15, delay: 0.2 }
						}}
						><span
							use:motion
							aria-label="Hover Background"
							class="absolute inset-0 block h-full w-full rounded-3xl bg-gradient-to-br from-neutral-100 to-neutral-200
                                  shadow-lg dark:from-slate-800/90 dark:to-slate-800/70"
						></span></Motion
					>
				{/if}
			</AnimatePresence>
			<Card
				class="border border-neutral-200 bg-white shadow-sm transition-shadow 
                     duration-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
			>
				<CardTitle class="text-slate-900 dark:text-slate-100">{post.title}</CardTitle>
				<CardDescription class="line-clamp-3 text-slate-600 dark:text-slate-400"
					>{@html post.content}</CardDescription
				>
			</Card>
		</a>
	{/each}
</div>
