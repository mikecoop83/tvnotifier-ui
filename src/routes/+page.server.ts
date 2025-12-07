import { logFetch } from '$lib/server/http';
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

interface NextEpisode {
	name?: string;
	summary?: string;
	airstamp?: string;
}

const USER_AGENT = 'tv-notifier/1.0 (+https://tv.mikecoop.dev)';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchWithBackoff(
	url: string,
	init: RequestInit = {},
	maxRetries = 4
) {
	let attempt = 0;
	const headers = new Headers(init.headers ?? {});
	if (!headers.has('User-Agent')) {
		headers.set('User-Agent', USER_AGENT);
	}
	headers.set('Accept', 'application/json');

	while (true) {
		const response = await logFetch(url, { ...init, headers });
		if (response.status !== 429 || attempt >= maxRetries) {
			return response;
		}
		const retryAfterHeader = response.headers.get('retry-after');
		const retryAfterSeconds = retryAfterHeader ? Number.parseInt(retryAfterHeader, 10) : undefined;
		const delay =
			typeof retryAfterSeconds === 'number' && Number.isFinite(retryAfterSeconds)
				? retryAfterSeconds * 1000
				: 500 * 2 ** attempt;
		await sleep(delay);
		attempt += 1;
	}
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
		const data = await fetchWithBackoff(
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
		searchResults
	};
}) satisfies PageServerLoad;

async function getShow(show: Shows): Promise<APIShow> {
	const data = await fetchWithBackoff(
		`https://api.tvmaze.com/shows/${show.id}?embed=nextepisode`,
		{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);
	const body = await data.json();
	return {
		id: show.id,
		name: body.name,
		image: body.image.medium,
	nextEpisodeTime: body._embedded?.nextepisode?.airstamp,
	nextEpisodeName: (body._embedded?.nextepisode as NextEpisode | undefined)?.name,
	nextEpisodeSummary: (body._embedded?.nextepisode as NextEpisode | undefined)?.summary,
	summary: body.summary,
		status: body.status,
		network: body.network?.name ?? body.webChannel?.name,
		genres: body.genres,
		scheduleDays: body.schedule?.days,
		scheduleTime: body.schedule?.time
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
