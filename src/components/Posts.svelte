<script lang="ts">
	import type { Post } from '$lib/server/db/schemas/posts';
	let { posts }: { posts: Post[] } = $props();
</script>

<main class="mx-auto max-w-3xl p-6">
	<h1 class="mb-6 text-4xl font-bold">Welcome to SvelteKit</h1>
	{#each posts as post}
		<div class="mb-8 rounded-xl bg-slate-100 p-4 shadow-lg dark:bg-slate-800">
			<h2 class="mb-2 text-2xl font-semibold">{post.title}</h2>
			<div class="prose dark:prose-invert">{@html post.content}</div>
		</div>
	{/each}
</main>
