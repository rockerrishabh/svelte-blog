<script>
	import { Motion } from 'svelte-motion';
</script>

<a href="/" class="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black">
	<div
		class="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white"
	></div>
	<Motion let:motion initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
		<span use:motion class="font-medium whitespace-pre text-black dark:text-white">Acet Labs</span>
	</Motion>
</a>
