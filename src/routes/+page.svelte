<script lang="ts">
	import { Plus, TelevisionSimple, Trash } from 'phosphor-svelte';
	import type { PageData } from './$types';
	import moment from 'moment';
	import { enhance } from '$app/forms';

	export let data: PageData;

	$: ({ shows, searchResults } = data);
	let pendingDelete: { id: number; name: string } | null = null;

	function relativeDate(date?: string) {
		if (!date) {
			return '';
		}
		return `next episode ${moment(date).fromNow()}`;
	}
</script>

<div class="flex-col gap-4 container h-full mx-auto flex justify-center items-center p-4">
	<form action="/" class="flex flex-row gap-2" method="get">
		<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
			<a href="/" class="btn variant-filled-secondary btn-base">Clear</a>
			<input class="pl-3" type="text" name="query" placeholder="Name..." required />
			<button class="btn variant-filled-primary btn-base">Search</button>
		</div>
	</form>

	{#if searchResults.length > 0}
		<table class="table table-hover">
			<thead>
				<tr>
					<th></th>
					<th>Name</th>
					<th>Add</th>
				</tr>
			</thead>
			<tbody>
				{#each searchResults as show}
					<tr>
						<td>
							{#if show.image}
								<img class="w-12" src={show.image} alt={show.name} />
							{:else}
								<TelevisionSimple size="48" />
							{/if}
						</td>
						<td>
							<div class="min-w-[12rem] space-y-1">
								<a class="font-semibold text-sky-300" href="https://www.tvmaze.com/shows/{show.id}">
									{show.name}
								</a>
								<span class="block text-sm text-slate-300 whitespace-nowrap">
									{relativeDate(show.nextEpisodeTime)}
								</span>
							</div>
						</td>
						<td>
							<form method="post" action="?/addShow" use:enhance>
								<input type="hidden" name="showId" value={show.id} />
								<button class="btn variant-filled-secondary btn-sm">
									<Plus size="20" />
								</button>
							</form>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
	<table class="table table-hover">
		<thead>
			<tr>
				<!-- <th>ID</th> -->
				<th></th>
				<th>Name</th>
				<th>Delete</th>
				<th></th>
			</tr>
		</thead>
		<tbody>
			{#each shows as show}
				<tr>
					<td>
						<img class="w-12" src={show.image} alt={show.name} />
					</td>
					<td>
						<div class="min-w-[12rem] space-y-1">
							<a class="font-semibold text-sky-300" href="https://www.tvmaze.com/shows/{show.id}">
								{show.name}
							</a>
							<span class="block text-sm text-slate-300 whitespace-nowrap">
								{relativeDate(show.nextEpisodeTime)}
							</span>
						</div>
					</td>
					<td>
						<form method="post" action="?/deleteShow" use:enhance>
							<input type="hidden" name="showId" value={show.id} />
							<button
								class="btn variant-filled-secondary btn-sm"
								type="button"
								on:click={() => {
									pendingDelete = { id: show.id, name: show.name };
								}}
							>
								<Trash size="20" />
							</button>
						</form>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>

	{#if pendingDelete}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
			<div class="w-[26rem] rounded-xl border border-slate-800 bg-slate-900 shadow-2xl shadow-slate-950/50 p-6 space-y-4">
				<header class="space-y-1">
					<h2 class="text-lg font-semibold text-slate-50">Remove show</h2>
					<p class="text-sm text-slate-300">Are you sure you want to remove “{pendingDelete.name}” from your list?</p>
				</header>
				<div class="flex justify-end gap-3">
					<button
						class="btn variant-filled-secondary"
						type="button"
						on:click={() => {
							pendingDelete = null;
						}}
					>
						Cancel
					</button>
					<form
						method="post"
						action="?/deleteShow"
						use:enhance
						on:submit={() => {
							pendingDelete = null;
						}}
					>
						<input type="hidden" name="showId" value={pendingDelete.id} />
						<button class="btn variant-filled-primary" type="submit">
							Delete
						</button>
					</form>
				</div>
			</div>
		</div>
	{/if}
</div>
