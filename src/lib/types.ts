export interface APIShow {
	id: number;
	name: string;
	image?: string;
	nextEpisodeTime?: string;
	nextEpisodeName?: string;
	nextEpisodeSummary?: string;
	summary?: string;
	status?: string;
	network?: string;
	genres?: string[];
	scheduleDays?: string[];
	scheduleTime?: string;
	seasonsCount?: number;
}

export interface User {
	userId: string;
	pictureURL: string;
}
