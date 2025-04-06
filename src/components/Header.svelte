<script lang="ts">
	import type { ShortUser } from '../hooks.server';
	import Sidebar from './Sidebar.svelte';
	import ToggleTheme from './ToggleTheme.svelte';
	import { onMount } from 'svelte';

	let { user }: { user?: ShortUser } = $props();
	let showMenu = $state(false);
	let menuRef = $state<HTMLDivElement | null>(null);
	let buttonRef = $state<HTMLButtonElement | null>(null);

	function toggleMenu() {
		showMenu = !showMenu;
	}

	function handleClickOutside(event: MouseEvent) {
		if (
			showMenu &&
			menuRef &&
			buttonRef &&
			!menuRef.contains(event.target as Node) &&
			!buttonRef.contains(event.target as Node)
		) {
			showMenu = false;
		}
	}

	onMount(() => {
		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});
</script>

<header
	class="sticky top-0 bg-slate-50 px-4 py-3 text-slate-950 shadow-md dark:bg-slate-950 dark:text-slate-50"
>
	<div class="mx-auto flex max-w-7xl items-center justify-between gap-4">
		<a href="/" class="rounded text-xl font-bold hover:scale-105" aria-label="Home">
			Blog <span class="text-sky-700 dark:text-sky-300">App</span>
		</a>

		<nav class="hidden items-center gap-8 md:flex" aria-label="Main Navigation">
			<ul class="flex gap-6 text-sm font-medium">
				<li>
					<a
						class="rounded transition-colors hover:text-sky-700 dark:hover:text-sky-300"
						href="/about-us"
						aria-label="About page"
					>
						About
					</a>
				</li>
				<li>
					<a
						class="rounded transition-colors hover:text-sky-700 dark:hover:text-sky-300"
						href="/contact-us"
						aria-label="Contact page"
					>
						Contact
					</a>
				</li>
			</ul>
			<section class="flex items-center gap-4" aria-label="User actions">
				<ToggleTheme />
				{#if user}
					<div class="relative">
						<button
							bind:this={buttonRef}
							aria-label="Open user menu"
							class="h-8 w-8 cursor-pointer overflow-hidden rounded-full transition duration-150 ease-in-out hover:scale-105"
							type="button"
							onclick={toggleMenu}
						>
							<img
								class="h-full w-full rounded-full object-cover"
								src={user.image}
								alt={user.name}
							/>
						</button>

						{#if showMenu}
							<div
								bind:this={menuRef}
								class="ring-opacity-5 absolute right-0 mt-2 w-48 rounded-md bg-white p-1 shadow-lg ring-1 ring-black dark:bg-slate-800"
								role="menu"
							>
								<div class="px-4 py-2 text-sm text-slate-700 dark:text-slate-200">
									<p class="font-medium">{user.name}</p>
									<p class="text-sm text-nowrap">{user.email}</p>
								</div>
								<div class="border-t border-slate-200 dark:border-slate-700"></div>
								<a
									href="/dashboard"
									class="mt-1 block rounded px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
									role="menuitem"
								>
									Dashboard
								</a>
								<a
									href="/profile"
									class="mt-1 block rounded px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
									role="menuitem"
								>
									Profile
								</a>
								<form method="POST" action="/sign-out">
									<button
										type="submit"
										class="block w-full cursor-pointer rounded px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
										role="menuitem"
									>
										Sign Out
									</button>
								</form>
							</div>
						{/if}
					</div>
				{:else}
					<a
						href="/sign-in"
						class="cursor-pointer rounded-lg bg-sky-700 px-4 py-2 text-sm font-semibold whitespace-nowrap text-white transition-all hover:bg-sky-800 focus:ring-2 focus:ring-sky-400 focus:outline-none dark:bg-sky-500 dark:text-white dark:hover:bg-sky-600 dark:focus:ring-sky-300"
						aria-label="Sign In"
					>
						Sign In
					</a>
					<a
						href="/sign-up"
						class="cursor-pointer rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold whitespace-nowrap text-slate-900 transition-all hover:bg-slate-200 focus:ring-2 focus:ring-slate-500 focus:outline-none dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700 dark:focus:ring-slate-400"
						aria-label="Sign Up"
					>
						Sign Up
					</a>
				{/if}
			</section>
		</nav>
		<Sidebar {user} />
	</div>
</header>
