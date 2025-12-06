<script lang="ts">
//	import '@skeletonlabs/skeleton/themes/theme-crimson.css';
//	import '@skeletonlabs/skeleton/styles/all.css';
	import '../app.postcss';
	import type { LayoutData } from './$types';
	import { AppShell, AppBar } from '@skeletonlabs/skeleton';

	export let data: LayoutData;
</script>

<!-- App Shell -->
<AppShell>
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<AppBar>
			<svelte:fragment slot="lead">
				<strong class="text-xl uppercase">TV Notifier</strong>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<img class="w-12 h-12 rounded-full" src={data?.user?.pictureURL ?? ''} alt="user" />
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<!-- Page Route Content -->
	<slot />
</AppShell>
