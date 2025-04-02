<script lang="ts">
	import { page } from '$app/state';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { superForm } from 'sveltekit-superforms';
	import type { PageProps } from './$types';
	import { SignUpSchema } from './schema';

	let { data }: PageProps = $props();

	const { form, errors, message, constraints, enhance, delayed, submitting, allErrors } = superForm(
		data.form,
		{
			validators: zodClient(SignUpSchema),
			validationMethod: 'oninput',
			id: 'sign-up'
		}
	);
</script>

<svelte:head>
	<title>Sign Up</title>
</svelte:head>

<main class="mx-auto max-w-md p-8 md:max-w-lg lg:max-w-xl">
	<h1 class="mb-6 text-2xl font-bold">Create Your Account</h1>
	<form method="POST" class="space-y-4" aria-label="Sign up form" use:enhance>
		<div>
			<label for="name" class="block text-sm font-medium text-slate-700 dark:text-slate-200">
				Name
			</label>

			<input
				id="name"
				name="name"
				type="text"
				placeholder="Your Name"
				bind:value={$form.name}
				aria-invalid={$errors.name ? 'true' : undefined}
				{...$constraints.name}
				required
				class="mt-1 block w-full rounded-md border border-slate-300 bg-white p-2 text-slate-900 shadow-sm focus:ring-2 focus:ring-sky-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
			/>

			{#if $errors.name}<span class="mt-1 text-xs text-red-600">{$errors.name}</span>{/if}
		</div>

		<div>
			<label for="email" class="block text-sm font-medium text-slate-700 dark:text-slate-200">
				Email
			</label>

			<input
				id="email"
				name="email"
				type="email"
				bind:value={$form.email}
				aria-invalid={$errors.email ? 'true' : undefined}
				{...$constraints.email}
				placeholder="Your Email Address"
				required
				class="mt-1 block w-full rounded-md border border-slate-300 bg-white p-2 text-slate-900 shadow-sm focus:ring-2 focus:ring-sky-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
			/>

			{#if $errors.email}<span class="mt-1 text-xs text-red-600">{$errors.email}</span>{/if}
		</div>

		<div>
			<label for="password" class="block text-sm font-medium text-slate-700 dark:text-slate-200">
				Password
			</label>

			<input
				id="password"
				name="password"
				type="password"
				bind:value={$form.password}
				aria-invalid={$errors.password ? 'true' : undefined}
				{...$constraints.password}
				placeholder="Your New Password"
				required
				class="mt-1 block w-full rounded-md border border-slate-300 bg-white p-2 text-slate-900 shadow-sm focus:ring-2 focus:ring-sky-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
			/>

			{#if $errors.password}<span class="mt-1 text-xs text-red-600">{$errors.password}</span>{/if}
		</div>

		<div>
			<label
				for="confirmPassword"
				class="block text-sm font-medium text-slate-700 dark:text-slate-200"
			>
				Confirm Password
			</label>

			<input
				id="confirmPassword"
				name="confirmPassword"
				type="password"
				bind:value={$form.confirmPassword}
				aria-invalid={$errors.confirmPassword ? 'true' : undefined}
				{...$constraints.confirmPassword}
				placeholder="Confirm Your Password"
				required
				class="mt-1 block w-full rounded-md border border-slate-300 bg-white p-2 text-slate-900 shadow-sm focus:ring-2 focus:ring-sky-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
			/>
			{#if $errors.confirmPassword}<span class="mt-1 text-xs text-red-600"
					>{$errors.confirmPassword}</span
				>{/if}
		</div>
		<div class="flex items-center">
			<input
				id="terms"
				name="terms"
				type="checkbox"
				required
				class="cursor-pointer rounded border-slate-300 text-sky-600 focus:ring-sky-500 focus:ring-offset-1 dark:border-slate-700 dark:bg-slate-800"
				aria-describedby="terms-description"
			/>

			<pre class="mt-1 text-xs text-red-600"></pre>

			<div class="ml-3 text-sm">
				<label for="terms" class="font-medium text-slate-700 dark:text-slate-200">
					I agree to the{' '}
					<a
						href="/terms"
						class="text-sky-700 hover:underline focus:ring-2 focus:ring-sky-500 focus:outline-none dark:text-sky-300"
						aria-label="Terms and Conditions"
					>
						Terms and Conditions
					</a>
				</label>
			</div>
		</div>

		{#if $message}
			<div
				class="w-full items-center rounded-lg border p-4 px-4 py-2 text-sm"
				class:border-green-200={page.status === 200}
				class:bg-green-50={page.status === 200}
				class:text-green-600={page.status === 200}
				class:border-red-200={page.status >= 400}
				class:bg-red-50={page.status >= 400}
				class:text-red-600={page.status >= 400}
			>
				{$message}
			</div>
		{/if}

		<div class="pt-2">
			<button
				disabled={$delayed || $allErrors.length > 0 || $submitting}
				type="submit"
				class="w-full cursor-pointer rounded-lg bg-sky-800 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-sky-900 focus:ring-2 focus:ring-sky-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-700 dark:bg-sky-600 dark:hover:bg-sky-700"
				aria-label="Sign Up"
			>
				{#if $submitting}
					<span class="flex items-center justify-center"
						><svg
							class="mr-2 size-5 animate-spin text-white"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							><circle
								class="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="4"
							></circle><path
								class="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							></path></svg
						>{' '} Signing Up</span
					>
				{:else}
					Sign Up
				{/if}
			</button>
		</div>
	</form>

	<!-- Google Login Button -->
	<p class="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">or</p>
	<div class="mt-2">
		<a
			href={'https://accounts.google.com/o/oauth2/auth?client_id=' +
				import.meta.env.VITE_GOOGLE_ID +
				`&redirect_uri=${import.meta.env.VITE_APP_ENDPOINT}/auth/callback/google&response_type=code&scope=openid email profile`}
			class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-100 focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
			aria-label="Sign in with Google"
		>
			<!-- Google logo icon (adjust the path as needed) -->
			<svg
				xmlns="http://www.w3.org/2000/svg"
				height="24"
				viewBox="0 0 24 24"
				width="24"
				class="size-4"
				><path
					d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
					fill="#4285F4"
				/><path
					d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
					fill="#34A853"
				/><path
					d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
					fill="#FBBC05"
				/><path
					d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
					fill="#EA4335"
				/><path d="M1 1h22v22H1z" fill="none" /></svg
			>
			Sign Up with Google
		</a>

		<p class="mt-4 text-sm">
			Already have an account?{' '}
			<a
				href="/sign-in"
				class="font-medium text-sky-700 hover:underline focus:ring-2 focus:ring-sky-500 focus:outline-none dark:text-sky-300"
				aria-label="Sign In"
			>
				Sign In
			</a>
		</p>
	</div>
</main>
