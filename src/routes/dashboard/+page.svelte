<script lang="ts">
	import type { PageProps } from './$types';
	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Dashboard</title>
</svelte:head>

<main class="mx-auto max-w-7xl">
	<h1 class="my-6 text-center text-4xl font-bold">Dashboard</h1>
	{#if data.user}
		<div class="my-6">
			<p class="text-center text-2xl font-semibold">Hello {data.user.name}</p>
		</div>
		<a
			href="/post/create"
			class="flex cursor-pointer items-center justify-center rounded-lg bg-sky-800 px-4 py-2 text-sm
            font-semibold text-white transition-all hover:bg-sky-900 focus:ring-2 focus:ring-sky-500
            focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-700 dark:bg-sky-600
            dark:hover:bg-sky-700"
			aria-label="Sign In"
		>
			Create Post
		</a>
	{/if}
</main>
