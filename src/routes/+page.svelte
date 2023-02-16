<script lang="ts">
	import { Plus, TelevisionSimple, Trash } from 'phosphor-svelte';
	import type { PageData } from './$types';
	import moment from 'moment';
	import { enhance } from '$app/forms';

	export let data: PageData;

	$: ({ shows, searchResults, deleting } = data);

	function relativeDate(date?: string) {
		if (!date) {
			return '';
		}
		return moment(date).fromNow();
	}
</script>

<div class="flex-col gap-4 container h-full mx-auto flex justify-center items-center p-4">
	<form action="/" class="flex flex-row gap-2" method="get">
		<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
			<a href="/" class="btn variant-filled-secondary btn-base">Clear</a>
			<input type="text" name="query" placeholder="Name..." required />
			<button class="btn variant-filled-primary btn-base">Search</button>
		</div>
	</form>

	{#if searchResults.length > 0}
		<table class="table table-hover">
			<thead>
				<tr>
					<th />
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
						<td>{show.name}</td>
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
				<th />
				<th>Name</th>
				<th>Next</th>
				<th />
			</tr>
		</thead>
		<tbody>
			{#each shows as show}
				<tr>
					<td><img class="w-12" src={show.image} alt={show.name} /></td>
					<td>
						<div class="w-32 text-clip overflow-hidden">
							<a href="/?delete={show.id}">
								{show.name}
							</a>
						</div>
					</td>
					<td>
						{#if deleting && deleting === show.id.toString()}
							<form method="post" action="?/deleteShow" use:enhance>
								<input type="hidden" name="showId" value={show.id} />
								<button class="btn variant-filled-secondary btn-sm">
									<Trash size="20" />
								</button>
							</form>
						{:else}
							{relativeDate(show.nextEpisodeTime)}
						{/if}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
