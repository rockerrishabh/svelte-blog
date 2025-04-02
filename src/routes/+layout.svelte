<script lang="ts">
	import '../app.css';
	import Header from '../components/Header.svelte';
	import type { LayoutProps } from './$types';

	let { children, data }: LayoutProps = $props();
</script>

<Header user={data.user} />

{@render children()}
