<script lang="ts">
	import Editor from '../../../components/Editor/Editor.svelte';
	import type { PageProps } from './$types';
	let { form }: PageProps = $props();
</script>

<main class="mx-auto max-w-2xl p-8">
	<Editor />
	<pre>{form?.success}</pre>
</main>
