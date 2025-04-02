<script lang="ts">
	import type { PageProps } from './$types';

	// Get initial data from the server load function.
	let { data }: PageProps = $props();

	// Local form values (initialized with current data)
	let newName: string = $state(data.user.name);
	let newImage: string = $state(data.user.image || '');

	// Variables for showing feedback messages.
	let errorMessage: string = $state('');
	let successMessage: string = $state('');

	async function handleSubmit(event: Event) {
		event.preventDefault();
		const formData = new FormData(event.target as HTMLFormElement);
		const response = await fetch('?/update', {
			method: 'POST',
			body: formData
		});

		if (response.ok) {
			const result = await response.json();
			successMessage = result.message || 'Profile updated successfully';
			// Optionally update the local user state with the new values.
			data.user = { ...data.user, name: newName, image: newImage };
		} else {
			errorMessage = 'Failed to update profile';
		}
	}
</script>

<main class="mx-auto max-w-2xl p-8">
	<section class="flex items-center gap-4">
		{#if data.user.image}
			<img
				src={data.user.image}
				alt={`Image of ${data.user.name}`}
				class="h-24 w-24 rounded-full object-cover"
			/>
		{:else}
			<div class="flex h-24 w-24 items-center justify-center rounded-full bg-slate-300">
				<span class="text-2xl text-white">{data.user.name.charAt(0)}</span>
			</div>
		{/if}
		<div>
			<h1 class="text-2xl font-bold">{data.user.name}</h1>
			<p class="text-slate-600">{data.user.email}</p>
			<p class="text-sm text-slate-500">Role: {data.session.role}</p>
		</div>
	</section>

	<section class="mt-8">
		<h2 class="text-xl font-semibold">Edit Profile</h2>
		{#if errorMessage}
			<p class="text-red-500">{errorMessage}</p>
		{/if}
		{#if successMessage}
			<p class="text-green-500">{successMessage}</p>
		{/if}
		<form onsubmit={handleSubmit} class="space-y-4">
			<div>
				<label for="name" class="block font-medium">Name</label>
				<input
					id="name"
					name="name"
					type="text"
					bind:value={newName}
					class="mt-1 block w-full rounded-md border border-slate-300 bg-white p-2 text-slate-900 shadow-sm focus:ring-2 focus:ring-sky-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
				/>
			</div>
			<div>
				<label for="image" class="block font-medium">Image URL</label>
				<input
					id="image"
					name="image"
					type="text"
					bind:value={newImage}
					class="mt-1 block w-full rounded-md border border-slate-300 bg-white p-2 text-slate-900 shadow-sm focus:ring-2 focus:ring-sky-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
				/>
			</div>
			<button
				type="submit"
				class="w-full cursor-pointer rounded-lg bg-sky-800 px-4 py-2 text-sm
            font-semibold text-white transition-all hover:bg-sky-900 focus:ring-2 focus:ring-sky-500
            focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-700 dark:bg-sky-600
            dark:hover:bg-sky-700"
				aria-label="Submit"
			>
				Update Profile
			</button>
		</form>
	</section>
</main>
