<script lang="ts">
	import type { PageData } from './$types';
	import moment from 'moment';

	export let data: PageData;

	$: ({ shows } = data);

	function relativeDate(date?: string) {
		if (!date) {
			return '';
		}
		return moment(date).fromNow();
	}
</script>

<div class="container h-full mx-auto flex justify-center items-center p-4">
	<table class="table table-hover">
		<thead>
			<tr>
				<!-- <th>ID</th> -->
				<th />
				<th>Name</th>
				<th>Next</th>
			</tr>
		</thead>
		<tbody>
			{#each shows as show}
				<tr>
					<td><img src={show.image} alt={show.name} /></td>
					<td>{show.name}</td>
					<td>{relativeDate(show.nextEpisodeTime)}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
