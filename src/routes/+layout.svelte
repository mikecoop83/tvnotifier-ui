<script lang="ts">
	import '../app.css';
	import type { LayoutData } from './$types';
	import { AppBar } from '@skeletonlabs/skeleton-svelte';
	import ThemeToggle from '#lib/ThemeToggle.svelte';

	let showMenu = false;

	export let data: LayoutData;
</script>

<div class="min-h-screen bg-white text-slate-950 dark:bg-slate-950 dark:text-slate-50">
	<AppBar class="border-b border-slate-200 dark:border-slate-800">
		<AppBar.Toolbar class="container mx-auto flex items-center justify-between p-4">
			<AppBar.Lead>
				<strong class="text-xl uppercase">TV Notifier</strong>
			</AppBar.Lead>
			<AppBar.Trail class="flex items-center gap-3">
				<ThemeToggle />
				{#if data?.user?.pictureURL}
					<div class="relative">
						<button
							type="button"
							class="focus:outline-none"
							on:click|stopPropagation={() => (showMenu = !showMenu)}
							aria-label="User menu"
						>
							<img class="w-12 h-12 rounded-full" src={data.user.pictureURL} alt="user" />
						</button>
						{#if showMenu}
							<div
								class="absolute right-0 mt-2 w-36 rounded-lg border border-slate-200 bg-white text-sm shadow-lg shadow-slate-950/10 dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/40"
								role="menu"
								tabindex="-1"
								on:click={(event) => event.stopPropagation()}
								on:keydown={(event) => {
									if (event.key === 'Escape') {
										showMenu = false;
									}
								}}
							>
								<form method="post" action="/logout" class="p-2">
									<button
										class="w-full text-left rounded-md px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800"
										role="menuitem"
									>
										Log out
									</button>
								</form>
							</div>
						{/if}
					</div>
				{/if}
			</AppBar.Trail>
		</AppBar.Toolbar>
	</AppBar>
	<main class="container mx-auto p-4 text-lg md:text-base">
		<slot />
	</main>
</div>

<svelte:window on:click={() => (showMenu = false)} />
