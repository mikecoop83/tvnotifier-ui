<script lang="ts">
	import '../app.css';
	import type { LayoutData } from './$types';
	import { AppBar } from '@skeletonlabs/skeleton-svelte';

	export let data: LayoutData;
</script>

<div class="min-h-screen bg-background text-foreground">
	<AppBar class="border-b">
		<AppBar.Toolbar class="container mx-auto flex items-center justify-between p-4">
			<AppBar.Lead>
				<strong class="text-xl uppercase">TV Notifier</strong>
			</AppBar.Lead>
			<AppBar.Trail>
				<img class="w-12 h-12 rounded-full" src={data?.user?.pictureURL ?? ''} alt="user" />
			</AppBar.Trail>
		</AppBar.Toolbar>
	</AppBar>
	<main class="container mx-auto p-4">
		<slot />
	</main>
</div>
