type RequestInitWithHeaders = RequestInit & { headers?: HeadersInit };

export async function logFetch(url: string, init: RequestInitWithHeaders = {}): Promise<Response> {
	const method = init.method ?? 'GET';
	const start = Date.now();
	console.log('[http] request', { url, method });
	const response = await fetch(url, init);
	const duration = Date.now() - start;
	console.log('[http] response', { url, status: response.status, method, durationMs: duration });
	return response;
}
