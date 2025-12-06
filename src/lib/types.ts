export interface APIShow {
	id: number;
	name: string;
	image?: string;
	nextEpisodeTime?: string;
}

export interface User {
	userId: string;
	pictureURL: string;
}
