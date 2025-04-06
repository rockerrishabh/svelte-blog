<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import LabelInput from '../../components/LabelInput.svelte';
	import Label from '../../components/Label.svelte';
	import type { PageProps } from './$types';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { page } from '$app/state';
	import Input from '../../components/Input.svelte';
	import { SignInSchema } from './schema';
	import BottomGradient from '../../components/Card/BottomGradient.svelte';

	let { data }: PageProps = $props();

	const { form, errors, message, constraints, enhance, delayed, submitting, allErrors } = superForm(
		data.form,
		{
			validators: zodClient(SignInSchema),
			validationMethod: 'oninput',
			id: 'sign-in'
		}
	);
</script>

<svelte:head>
	<title>Sign In</title>
</svelte:head>

<!-- Outer container with light/dark background -->
<div
	class="shadow-input mx-auto mt-5 w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black"
>
	<h2 class="text-xl font-bold text-neutral-800 dark:text-neutral-200">Welcome to Blog App</h2>
	<p class="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
		Sign in to your account to start sharing your thoughts and connecting with others.
	</p>

	<form method="POST" use:enhance class="my-6" aria-label="Sign up form">
		<!-- Email Field -->
		<LabelInput class="mb-4">
			<Label htmlFor="email">Email Address</Label>
			<Input
				id="email"
				name="email"
				type="email"
				bind:value={$form.email}
				error={$errors.email}
				{...$constraints.email}
				placeholder="Your Email Address"
			/>
		</LabelInput>

		<!-- Password Field -->
		<LabelInput class="mb-4">
			<Label htmlFor="password">Password</Label>
			<Input
				id="password"
				name="password"
				type="password"
				placeholder="Your Password"
				bind:value={$form.password}
				error={$errors.password}
				{...$constraints.password}
			/>
		</LabelInput>
		<div class="mb-4 flex justify-end">
			<button
				class="cursor-pointer text-sm font-medium text-sky-700 hover:underline focus:ring-2 focus:ring-sky-500 focus:outline-none dark:text-sky-300"
			>
				Forget Password?
			</button>
		</div>

		{#if $message}
			<div
				class="mb-4 w-full items-center rounded-lg border p-4 text-sm"
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

		<button
			disabled={$delayed || $allErrors.length > 0 || $submitting}
			type="submit"
			aria-label="Sign In"
			class="group/btn relative block h-10 w-full cursor-pointer rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
		>
			{#if $submitting}
				<span class="flex items-center justify-center">
					<svg
						class="mr-2 h-5 w-5 animate-spin text-white"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
					>
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
						></circle>
						<path
							class="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						></path>
					</svg>
					Signing In
				</span>
			{:else}
				Sign In &rarr;
			{/if}
			<BottomGradient />
		</button>

		<div
			class="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700"
		></div>

		<div class="flex flex-col space-y-4">
			<a
				href={'https://accounts.google.com/o/oauth2/auth?client_id=' +
					import.meta.env.VITE_GOOGLE_ID +
					`&redirect_uri=${import.meta.env.VITE_APP_ENDPOINT}/auth/callback/google&response_type=code&scope=openid email profile`}
				type="button"
				class="group/btn shadow-input relative flex h-10 w-full items-center justify-center space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626]"
			>
				<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" class="size-6">
					<path
						d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
						fill="#4285F4"
					/>
					<path
						d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
						fill="#34A853"
					/>
					<path
						d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
						fill="#FBBC05"
					/>
					<path
						d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
						fill="#EA4335"
					/>
					<path d="M1 1h22v22H1z" fill="none" />
				</svg>
				<span class="text-sm text-neutral-700 dark:text-neutral-300">Sign In with Google</span>
				<BottomGradient />
			</a>
		</div>
	</form>
	<p class="mt-4 text-sm">
		Don't have an account?{' '}
		<a
			href="/sign-up"
			class="font-medium text-sky-700 hover:underline focus:ring-2 focus:ring-sky-500 focus:outline-none dark:text-sky-300"
			aria-label="Sign Up"
		>
			Sign Up
		</a>
	</p>
</div>
