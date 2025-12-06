<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import '../app.postcss';
  import type { LayoutData } from './$types';
  import { AppShell, AppBar } from '@skeletonlabs/skeleton';
  export let data: LayoutData;
</script>

<slot />
<div class="min-h-screen flex flex-col bg-slate-950 text-slate-50">
  <!-- Header -->
  <header class="w-full border-b border-slate-800 bg-slate-900/80 backdrop-blur">
    <div class="mx-auto max-w-5xl flex items-center justify-between px-4 py-3">
      <strong class="text-xl uppercase tracking-wide">TV Notifier</strong>
      <img
        class="w-12 h-12 rounded-full border border-slate-700 object-cover"
        src={data?.user?.pictureURL ?? ''}
        alt="user"
      />
    </div>
  </header>

  <!-- Main content -->
  <main class="flex-1 mx-auto w-full max-w-5xl px-4 py-6">
    <slot />
  </main>
</div>
