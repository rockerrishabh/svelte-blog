<script lang="ts">
	import Posts from '../components/Posts.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	// Sanitize the post content
</script>

<svelte:head>
	<title>Blog App</title>
</svelte:head>

<Posts posts={data.posts} />
