<script lang="ts">
	import { Avatar } from '@skeletonlabs/skeleton-svelte';
	import Github from '$lib/icons/Github.svelte';

	// Icons
	import { Linkedin } from '@lucide/svelte';

	const links = [
		{
			name: 'LinkedIn',
			href: 'https://www.linkedin.com/in/dominic-sudy/',
			icon: Linkedin
		},
		{
			name: 'GitHub',
			href: 'https://github.com/doosuu',
			icon: Github
		}
	];
</script>

<article class="mx-auto max-w-md place-items-center">
	<Avatar
		src="./images/me.jpg"
		size="size-32"
		name="doosuu"
		classes="border-8 border-surface-500"
	/>

	<h1 class="text-3xl font-bold">Dominic Sudy</h1>
	<h2 class="text-xl">Software Developer & Architect</h2>
	<p class="font-serif italic">building software. with passion.</p>

	<div class="m-2 flex items-center justify-center gap-2">
		{#each links as link}
			<a class="btn-icon preset-filled flex justify-center rounded-full" href={link.href}>
				<link.icon />
			</a>
		{/each}
	</div>
</article>
