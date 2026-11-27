<script lang="ts">
	import { onMount } from 'svelte';
	import { Moon, Sun } from 'phosphor-svelte';

	let darkMode = true;

	onMount(() => {
		darkMode = document.documentElement.classList.contains('dark');
	});

	function toggleTheme() {
		darkMode = !darkMode;
		document.documentElement.classList.toggle('dark', darkMode);
		try {
			localStorage.setItem('tvnotifier-theme', darkMode ? 'dark' : 'light');
		} catch {
			// Keep the switch working even if this browser cannot save the preference.
		}
	}
</script>

<button
	type="button"
	role="switch"
	aria-label="Dark mode"
	aria-checked={darkMode}
	title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
	on:click={toggleTheme}
	class="inline-flex min-h-11 items-center gap-2 rounded-full border border-slate-300 bg-slate-100 px-3 text-sm font-medium text-slate-700 hover:bg-slate-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus-visible:outline-sky-300"
>
	{#if darkMode}
		<Moon size="20" aria-hidden="true" />
		<span>Dark</span>
	{:else}
		<Sun size="20" aria-hidden="true" />
		<span>Light</span>
	{/if}
</button>
