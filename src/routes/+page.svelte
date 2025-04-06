<script lang="ts">
	import Post from '../components/PostCard.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	// Sanitize the post content
</script>

<svelte:head>
	<title>Blog App</title>
</svelte:head>

<main class="mx-auto max-w-7xl">
	<Post posts={data.posts} />
</main>
