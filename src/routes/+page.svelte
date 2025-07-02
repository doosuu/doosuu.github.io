<script lang="ts">
	import Github from '$lib/icons/Github.svelte';
	import { Linkedin } from '@lucide/svelte';

	import SkillGraph from '$lib/components/SkillGraph.svelte';
	import { skills } from '$lib/data/skills';

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

<header class="mx-auto w-full flex justify-between items-center absolute">
	<div class="m-2 flex gap-2 place-items-end">
		{#each links as link}
			<a class="btn-icon preset-filled rounded-full" href={link.href}>
				<link.icon />
			</a>
		{/each}
	</div>
</header>

<SkillGraph skills={skills} />
