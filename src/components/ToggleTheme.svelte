<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	export const ssr = false;
	let darkMode = false;
	let hydrated = false;
	let userPreference = typeof window !== 'undefined' ? localStorage.getItem('theme') : null; // null if no user preference
	let mediaQuery: MediaQueryList;

	onMount(() => {
		// If a user preference exists, use it; otherwise, use the system theme.
		if (userPreference) {
			darkMode = userPreference === 'dark';
		} else {
			mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
			darkMode = mediaQuery.matches;
			// Listen for changes in system preference if user hasn't set a theme.
			mediaQuery.addEventListener('change', systemThemeChanged);
		}
		updateTheme();
		hydrated = true;
	});

	onDestroy(() => {
		// Clean up the event listener if it was added.
		if (mediaQuery && !userPreference) {
			mediaQuery.removeEventListener('change', systemThemeChanged);
		}
	});

	function systemThemeChanged(e: MediaQueryListEvent) {
		// Only update if the user hasn't set a preference.
		if (!localStorage.getItem('theme')) {
			darkMode = e.matches;
			updateTheme();
		}
	}

	function toggleDarkMode(e: MouseEvent) {
		e.stopPropagation();
		// User is explicitly toggling the theme: store the preference.
		darkMode = !darkMode;
		localStorage.setItem('theme', darkMode ? 'dark' : 'light');
		updateTheme();
	}

	function updateTheme() {
		if (darkMode) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}
</script>

{#if hydrated}
	<button
		aria-label="Toggle dark mode"
		onclick={toggleDarkMode}
		class="block w-full cursor-pointer rounded-lg px-4 py-2"
	>
		{#if darkMode}
			<!-- Sun icon (light mode icon) displayed when in dark mode -->
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="currentColor"
				class="size-6 transform transition duration-300 ease-in-out hover:scale-105 active:rotate-45"
			>
				<path
					d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.758 17.303a.75.75 0 0 0-1.061-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.591-1.59ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.697 7.757a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 0 0-1.061 1.06l1.59 1.591Z"
				/>
			</svg>
		{:else}
			<!-- Moon icon (dark mode icon) displayed when in light mode -->
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="currentColor"
				class="size-6"
			>
				<path
					fill-rule="evenodd"
					d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z"
					clip-rule="evenodd"
				/>
			</svg>
		{/if}
	</button>
{/if}
