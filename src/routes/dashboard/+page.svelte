<script lang="ts">
	import type { PageProps } from './$types';
	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Dashboard</title>
</svelte:head>

<main class="mx-auto max-w-7xl">
	<div class="flex flex-1">
		<div
			class="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900"
		>
			<div class="flex gap-2">
				{#each Array(4) as _, idx}
					<div class="h-20 w-full animate-pulse rounded-lg bg-gray-100 dark:bg-neutral-800"></div>
				{/each}
				))}
			</div>
			<div class="flex flex-1 gap-2">
				{#each Array(2) as _, idx}
					<div class="h-full w-full animate-pulse rounded-lg bg-gray-100 dark:bg-neutral-800"></div>
				{/each}
				))}
			</div>
		</div>
	</div>
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
