import { prisma } from '$lib/server/prisma';
import type { Shows } from '@prisma/client';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
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
  return {
    shows
  };
}) satisfies PageServerLoad;

interface APIShow {
  id: number;
  name: string;
  image: string;
  nextEpisodeTime: string;
}

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
