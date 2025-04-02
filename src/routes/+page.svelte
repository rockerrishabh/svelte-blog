<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Blog App</title>
</svelte:head>

<main class="mx-auto max-w-3xl p-6">
	<h1 class="mb-6 text-4xl font-bold">Welcome to SvelteKit</h1>
	{#each data.posts as post}
		<div class="mb-8 rounded-xl bg-white p-4 shadow-lg">
			<h2 class="mb-2 text-2xl font-semibold">{post.title}</h2>
			<div class="text-gray-700">{@html post.content}</div>
		</div>
	{/each}
</main>
