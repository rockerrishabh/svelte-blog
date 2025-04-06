<script lang="ts">
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();
</script>

<h1>hi</h1>
<p>{data.post.title}</p>
