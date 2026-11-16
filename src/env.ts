import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	JWT_KEY: {},
	GOOGLE_CLIENT_ID: {},
	GOOGLE_CLIENT_SECRET: {}
});
