import { prisma } from '$lib/server/prisma';
import type { APIShow } from '$lib/types';
import type { Shows } from '@prisma/client';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

interface ShowFromTVMaze {
	id: number;
	name: string;
	image: {
		medium: string;
	};
}

export const load = (async ({ url }) => {
	const dbShows = await prisma.shows.findMany();
	const shows = await Promise.all(dbShows.map(getShow));
	shows.sort((a, b) => {
		if (a.nextEpisodeTime == null) {
			return 1;
		}
		if (b.nextEpisodeTime == null) {
			return -1;
		}
		if (a.nextEpisodeTime < b.nextEpisodeTime) {
			return -1;
		}
		if (a.nextEpisodeTime > b.nextEpisodeTime) {
			return 1;
		}
		return 0;
	});

	let searchResults: APIShow[] = [];
	if (url.searchParams.get('query')) {
		const data = await fetch(
			`https://api.tvmaze.com/search/shows?q=${url.searchParams.get('query')}`
		);
		const body = await data.json();
		const results: APIShow[] = body.map(({ show }: { show: ShowFromTVMaze }) => ({
			id: show.id,
			name: show.name,
			image: show.image?.medium
		}));
		searchResults = results.slice(0, 10);
	}

	return {
		shows,
		searchResults,
		deleting: url.searchParams.get('delete')
	};
}) satisfies PageServerLoad;

async function getShow(show: Shows): Promise<APIShow> {
	const data = await fetch(`https://api.tvmaze.com/shows/${show.id}?embed=nextepisode`, {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		}
	});
	const body = await data.json();
	return {
		id: show.id,
		name: body.name,
		image: body.image.medium,
		nextEpisodeTime: body._embedded?.nextepisode?.airstamp
	};
}

export const actions = {
	addShow: async ({ request }) => {
		const formData = await request.formData();
		const showId = formData.get('showId');
		if (typeof showId !== 'string') {
			return fail(400, { message: 'Invalid showId' });
		}
		const id = parseInt(showId);
		if (isNaN(id)) {
			return fail(400, { message: 'Invalid showId' });
		}

		await prisma.shows.create({ data: { id } });

		throw redirect(302, '/');
	},

	deleteShow: async ({ request }) => {
		const formData = await request.formData();
		const showId = formData.get('showId');
		if (typeof showId !== 'string') {
			return fail(400, { message: 'Invalid showId' });
		}
		const id = parseInt(showId);
		if (isNaN(id)) {
			return fail(400, { message: 'Invalid showId' });
		}

		await prisma.shows.delete({ where: { id } });

		throw redirect(302, '/');
	}
} satisfies Actions;
