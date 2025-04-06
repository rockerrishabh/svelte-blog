<script lang="ts">
	import { Motion, useMotionValue, useMotionTemplate } from 'svelte-motion';
	import { cn } from '$lib/utils/twMerge';

	let {
		id,
		name,
		type = 'text',
		placeholder,
		value = $bindable(),
		error,
		class: className
	}: {
		id: string;
		name: string;
		type?: string;
		placeholder?: string;
		value?: string;
		error?: string[] | undefined;
		class?: string;
	} = $props();

	let visible = $state(false);
	const radius = 100;
	const mouseX = useMotionValue(0);
	const mouseY = useMotionValue(0);
	const radiusMotion = useMotionValue('0px');

	$effect(() => {
		radiusMotion.set(visible ? radius + 'px' : '0px');
	});

	function handleMouseMove(event: MouseEvent) {
		const { currentTarget, clientX, clientY } = event;
		const target = currentTarget as HTMLDivElement;
		const { left, top } = target?.getBoundingClientRect();
		mouseX.set(clientX - left);
		mouseY.set(clientY - top);
	}

	const radial_gradient = useMotionTemplate`
		radial-gradient(
			${radiusMotion} circle at ${mouseX}px ${mouseY}px,
			#0069a8,
			transparent 80%
		)
	`;
</script>

<Motion let:motion style={{ background: radial_gradient }}>
	<div
		role="none"
		onmouseenter={() => (visible = true)}
		onmouseleave={() => (visible = false)}
		onmousemove={handleMouseMove}
		use:motion
		class="group/input relative rounded-lg p-[2px] transition duration-300"
	>
		<input
			{id}
			{name}
			{type}
			{placeholder}
			required
			aria-invalid={error ? 'true' : undefined}
			bind:value
			class={cn(
				'shadow-input dark:placeholder-text-neutral-600 flex h-10 w-full rounded-md border-none bg-gray-50 px-3 py-2 text-sm text-black transition duration-400 group-hover/input:shadow-none file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-400 focus-visible:ring-[2px] focus-visible:ring-neutral-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-800 dark:text-white dark:shadow-[0px_0px_1px_1px_#404040] dark:focus-visible:ring-neutral-600',
				className
			)}
		/>
	</div>
</Motion>
{#if error}
	<span class="mt-1 text-xs text-red-600">{error}</span>
{/if}
