<svelte:head>
	<title>Access denied</title>
</svelte:head>

<div class="min-h-[60vh] flex items-center justify-center">
	<div class="space-y-4 text-center">
		<h1 class="text-3xl font-semibold text-slate-50">Access denied</h1>
		<p class="text-slate-300">
			This Google account is not authorized for TV Notifier. Please sign in with an approved
			account or contact an admin.
		</p>
		<form method="get" action="/login">
			<button class="btn variant-filled-primary" type="submit">Back to login</button>
		</form>
	</div>
</div>
