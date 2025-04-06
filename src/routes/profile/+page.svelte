<script lang="ts">
	import type { PageProps } from './$types';

	// Get initial data from the server load function.
	let { data }: PageProps = $props();

	// Local form values (initialized with current data)
	let newName: string = $state(data.user.name);
	let newBio: string = $state(data.user.bio || '');
	let newAge: number = $state(data.user.age || 0);
	let newCountry: string = $state(data.user.country || '');
	let newImage: string = $state(data.user.image || '');

	// Variable to hold the file selected by the user.
	let imageFile: File | undefined = undefined;

	// Variables for showing feedback messages.
	let errorMessage: string = $state('');
	let successMessage: string = $state('');

	// Function to handle file upload
	async function handleImageUpload(file: File) {
		const formData = new FormData();
		formData.append('file', file);
		const response = await fetch('?/upload', {
			method: 'POST',
			body: formData
		});
		if (response.ok) {
			const result = await response.json();
			return result.imageUrl;
		}
		throw new Error('Image upload failed');
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();
		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);

		// If a new file is selected, upload it first.
		if (imageFile) {
			try {
				newImage = await handleImageUpload(imageFile);
				formData.set('image', newImage);
			} catch (error) {
				errorMessage = 'Image upload failed';
				return;
			}
		}

		const response = await fetch('?/update', {
			method: 'POST',
			body: formData
		});

		if (response.ok) {
			const result = await response.json();
			successMessage = result.message || 'Profile updated successfully';
			// Update the local user state with the new values.
			data.user = {
				...data.user,
				name: newName,
				image: newImage,
				bio: newBio,
				age: newAge,
				country: newCountry
			};
		} else {
			errorMessage = 'Failed to update profile';
		}
	}
</script>

<main class="mx-auto max-w-md p-8 md:max-w-lg lg:max-w-xl">
	<section class="flex items-center gap-4">
		<!-- Wrap the image in a label so clicking it triggers the hidden file input -->
		<label for="image-upload" class="cursor-pointer">
			{#if data.user.image}
				<img
					src={data.user.image}
					alt={`Image of ${data.user.name}`}
					class="h-24 w-24 rounded-full object-cover"
				/>
			{:else}
				<div
					class="flex h-24 w-24 items-center justify-center rounded-full bg-slate-300 dark:bg-slate-600"
				>
					<span class="text-2xl text-white">{data.user.name.charAt(0)}</span>
				</div>
			{/if}
		</label>
		<!-- Hidden file input triggered by clicking the label -->
		<input
			id="image-upload"
			name="image-upload"
			type="file"
			accept="image/*"
			onchange={(e) => (imageFile = (e.target as HTMLInputElement)?.files?.[0])}
			class="hidden"
		/>
		<div>
			<h1 class="text-2xl font-bold dark:text-slate-100">{data.user.name}</h1>
			<p class="text-slate-600 dark:text-slate-300">{data.user.email}</p>
			<p class="text-sm text-slate-500 dark:text-slate-400">Role: {data.session.role}</p>
		</div>
	</section>

	<section class="mt-8">
		<h2 class="text-xl font-semibold dark:text-slate-100">Edit Profile</h2>
		{#if errorMessage}
			<p class="text-red-500">{errorMessage}</p>
		{/if}
		{#if successMessage}
			<p class="text-green-500">{successMessage}</p>
		{/if}
		<form onsubmit={handleSubmit} class="space-y-4">
			<div>
				<label for="name" class="block font-medium dark:text-slate-100">Name</label>
				<input
					id="name"
					name="name"
					type="text"
					bind:value={newName}
					class="mt-1 block w-full rounded-md border border-slate-300 bg-white p-2 shadow-sm focus:ring-2 focus:ring-sky-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
				/>
			</div>
			<div>
				<label for="bio" class="block font-medium dark:text-slate-100">Bio</label>
				<textarea
					id="bio"
					name="bio"
					bind:value={newBio}
					class="mt-1 block w-full rounded-md border border-slate-300 bg-white p-2 shadow-sm focus:ring-2 focus:ring-sky-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
					rows="4"
				></textarea>
			</div>
			<div>
				<label for="age" class="block font-medium dark:text-slate-100">Age</label>
				<input
					id="age"
					name="age"
					type="number"
					bind:value={newAge}
					class="mt-1 block w-full rounded-md border border-slate-300 bg-white p-2 shadow-sm focus:ring-2 focus:ring-sky-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
				/>
			</div>
			<div>
				<label for="country" class="block font-medium dark:text-slate-100">Country</label>
				<input
					id="country"
					name="country"
					type="text"
					bind:value={newCountry}
					class="mt-1 block w-full rounded-md border border-slate-300 bg-white p-2 shadow-sm focus:ring-2 focus:ring-sky-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
				/>
			</div>
			<button
				type="submit"
				class="w-full rounded-lg bg-sky-800 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-sky-900 focus:ring-2 focus:ring-sky-500 dark:bg-sky-600 dark:hover:bg-sky-700"
				aria-label="Submit"
			>
				Update Profile
			</button>
		</form>
	</section>
</main>
