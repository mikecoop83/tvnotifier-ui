<script lang="ts">
	import { CaretDown, CaretUp, Plus, TelevisionSimple, Trash } from 'phosphor-svelte';
	import type { PageData } from './$types';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import type { APIShow } from '$lib/types';

	export let data: PageData;

	dayjs.extend(relativeTime);

	$: ({ shows, searchResults } = data);
	let searchTerm = '';
	$: searchTerm = $page.url.searchParams.get('query') ?? '';
	let pendingDelete: { id: number; name: string } | null = null;
	let expandedShowId: number | null = null;

	function relativeDate(date?: string) {
		if (!date) {
			return '';
		}
		return `next episode ${dayjs(date).fromNow()}`;
	}

	function scheduleText(show: APIShow) {
		const days = show.scheduleDays?.length ? show.scheduleDays.join(', ') : null;
		const time = show.scheduleTime;
		if (!days && !time) {
			return 'Schedule not available';
		}
		return `${days ?? 'Any day'}${time ? ` at ${time}` : ''}`;
	}

	const handleAddShow = ({ update }: { update: () => Promise<void> }) =>
		async ({ result }: { result: { type: string; location?: string } }) => {
			if (result.type === 'redirect' && result.location) {
				searchTerm = '';
				await goto(result.location);
				return;
			}
			if (result.type === 'success') {
				searchTerm = '';
				await update();
			}
		};
</script>

<div class="flex-col gap-4 container h-full mx-auto flex justify-center items-center p-4">
	<form action="/" class="flex flex-row gap-2" method="get">
		<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
			<a href="/" class="btn variant-filled-secondary btn-base">Clear</a>
			<input class="pl-3" type="text" name="query" placeholder="Name..." bind:value={searchTerm} required />
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
							<a href="https://www.tvmaze.com/shows/{show.id}" aria-label={show.name}>
								{#if show.image}
									<img class="w-12" src={show.image} alt={show.name} />
								{:else}
									<TelevisionSimple size="48" />
								{/if}
							</a>
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
							<form method="post" action="?/addShow" use:enhance={handleAddShow}>
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
						<a href="https://www.tvmaze.com/shows/{show.id}" aria-label={show.name}>
							<img class="w-12" src={show.image} alt={show.name} />
						</a>
					</td>
					<td>
						<div class="min-w-[12rem] space-y-1">
							<a class="font-semibold text-sky-300" href="https://www.tvmaze.com/shows/{show.id}">
								{show.name}
							</a>
							{#if show.status?.toLowerCase() === 'ended'}
								<span class="inline-flex items-center gap-1 rounded-full border border-rose-500/60 bg-rose-500/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-rose-200 ml-2">
									Ended
								</span>
							{/if}
							<div class="flex flex-col gap-1 text-sm text-slate-300">
								<span class="whitespace-nowrap">{relativeDate(show.nextEpisodeTime)}</span>
								<button
									class="inline-flex w-max items-center gap-1 rounded-md border border-slate-700 px-2 py-1 text-xs text-slate-200 hover:border-slate-500"
									type="button"
									on:click={() => {
										expandedShowId = expandedShowId === show.id ? null : show.id;
									}}
								>
									{#if expandedShowId === show.id}
										<CaretUp size="16" />
										Hide details
									{:else}
										<CaretDown size="16" />
										Show details
									{/if}
								</button>
							</div>
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
				{#if expandedShowId === show.id}
					<tr class="bg-slate-900/50">
						<td colspan="4" class="p-4">
							<div class="flex flex-col gap-2">
								<div class="flex flex-wrap gap-4 text-sm text-slate-300">
									<span class="rounded-full border border-slate-700 px-3 py-1">
										{show.status ?? 'Status unknown'}
									</span>
									{#if show.network}
										<span class="rounded-full border border-slate-700 px-3 py-1">
											{show.network}
										</span>
									{/if}
									<span class="rounded-full border border-slate-700 px-3 py-1">
										{scheduleText(show)}
									</span>
									{#if show.genres?.length}
										<span class="rounded-full border border-slate-700 px-3 py-1">
											{show.genres.join(', ')}
										</span>
									{/if}
								</div>
								{#if show.summary}
									<div class="prose prose-invert max-w-none text-sm leading-relaxed">
										{@html show.summary}
									</div>
								{:else}
									<p class="text-sm text-slate-400">No summary available.</p>
								{/if}
								{#if show.nextEpisodeName || show.nextEpisodeSummary}
									<div class="rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-sm text-slate-200">
										<p class="font-semibold text-slate-100">Next episode</p>
										{#if show.nextEpisodeName}
											<p class="mt-1">{show.nextEpisodeName}</p>
										{/if}
										{#if show.nextEpisodeSummary}
											<div class="prose prose-invert mt-2 max-w-none text-xs leading-relaxed">
												{@html show.nextEpisodeSummary}
											</div>
										{/if}
									</div>
								{/if}
							</div>
						</td>
					</tr>
				{/if}
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
