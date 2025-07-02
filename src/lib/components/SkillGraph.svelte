<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import type { Data, Level } from '$lib/types';

	const DEFAULT_RADIUS = 25;

	function getScaleFactor(level?: Level): number {
		switch (level) {
			case 'beginner':
				return 1.0;
			case 'intermediate':
				return 1.2;
			case 'advanced':
				return 1.4;
			case 'expert':
				return 1.6;
			default:
				return 1.5; // Default scale factor if no level is provided
		}
	}

	function getFontSizePixels(level?: Level): number {
		return getScaleFactor(level) * (DEFAULT_RADIUS/2) * 0.8;
	}

	function getSkillNodeRadius(level?: Level): number {
		return getScaleFactor(level) * DEFAULT_RADIUS;
	}

	function getAvatarNodeRadius(): number {
		return DEFAULT_RADIUS * 3;
	}

	interface Props {
		skills: Data
	}

	let { skills } : Props = $props();

	var data: Data = skills;

	let el: any;

	const drag = (simulation: d3.Simulation<d3.HierarchyNode<Data>, undefined>) => {
		function dragstarted(event, d) {
			if (!event.active) simulation.alphaTarget(0.3).restart();
			d.fx = d.x;
			d.fy = d.y;
		}

		function dragged(event, d) {
			d.fx = event.x;
			d.fy = event.y;
		}

		function dragended(event, d) {
			if (!event.active) simulation.alphaTarget(0);
			d.fx = null;
			d.fy = null;
		}

		return d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended);
	};

	// Specify the chart’s dimensions.
	let width = $state(1000);
	let height = $state(500);

	onMount(() => {
		width = window.innerWidth * 1.5;
		height = window.innerHeight * 1.5;

		// Compute the graph and start the force simulation.
		const root = d3.hierarchy(data, (d) => d.children);
		const links = root.links();
		const nodes = root.descendants();

		const simulation = d3
			.forceSimulation(nodes)
			.force(
				'link',
				d3
					.forceLink(links)
					.id((d) => `${d.index}`)
					.distance(200)
					.strength(2.2)
			)
			.force('charge', d3.forceManyBody().strength(-4000))
			.force('x', d3.forceX())
			.force('y', d3.forceY())

		// Create the container SVG.
		const svg = d3.select(el).selectAll('svg').data([data]).enter();
		// Append links.
		const link = svg
			.append('g')
			.attr('stroke', '#999')
			.attr('stroke-opacity', 3)
			.selectAll('line')
			.data(links)
			.join('line');

		// Append nodes.
		const node = svg.append('g').selectAll('g').data(nodes).join('g').call(drag(simulation));

		const avatarNode = node
			.append('circle')
			.attr('stroke-width', 5)
			.attr('fill', (d) => (d.data.children === undefined ? 'var(--color-primary-700)' : 'var(--color-surface-500)'))
			.attr('stroke', (d) => (d.data.children === undefined ? 'var(--color-primary-400)' : 'var(--color-surface-400)'))
			.attr('r', (d) => getSkillNodeRadius(d.data.level))
			.filter((d) => d.data.name === 'me')
			.attr('r', getAvatarNodeRadius())
			.attr('fill', 'url(#imgPattern)');

		const text = node
			.filter((d) => d.data.name !== 'me')
			.append('text')
			.attr('fill', '#fff')
			//.attr('clip-path', d => `circle(${getSkillNodeRadius(d.data.level)})`)
			.attr('text-anchor', 'middle')
			.attr('font-size', (d) => `${getFontSizePixels(d.data.level)}px`);

		const text2 = node.append('g')
			.filter((d) => d.data.name === 'me')
			.append('text')
			.attr('fill', 'var(--color-surface-100)')
			.append('textPath')
			.attr('side', 'right')
			.attr('href', '#circlePath')
			.attr('text-anchor', 'start')
			.attr('class', 'font-bold uppercase')
			.attr('textLength', '500')
			.text('Dominic Sudy • building software with passion •');

		text.selectAll().data(d => d.data.name.split(' ').map(word => { return {word: word, level: d.data.level} }))
			.join('tspan')
			.attr('alignment-baseline', 'middle')
			.attr('x', 0)
			.attr('y', (d, i, nodes) => `${(i - (nodes.length - 1) / 2) * getFontSizePixels(d.level)}px`)
			.text(d => d.word);

		simulation.on('tick', () => {
			link
				.attr('x1', (d) => d.source.x || 0)
				.attr('y1', (d) => d.source.y || 0)
				.attr('x2', (d) => d.target.x || 0)
				.attr('y2', (d) => d.target.y || 0);

			node.attr('transform', (d) => `translate(${d.x || 0}, ${d.y || 0})`);
		});

		//invalidation.then(() => simulation.stop());
	});
</script>

<div class="chart w-full">
	<svg
		bind:this={el}
		class="h-full w-full"
		text-anchor="middle"
		viewBox={`${-width / 2} ${-height / 2+100} ${width} ${height}`}
	>
		<defs>
			<pattern id="imgPattern" patternUnits="userSpaceOnUse" width="{getAvatarNodeRadius()*2}" height="{getAvatarNodeRadius()*2}" x="{-getAvatarNodeRadius()}" y="{-getAvatarNodeRadius()}">
				<image href="./images/me.jpg" x="0" y="0" width="{getAvatarNodeRadius()*2}" height="{getAvatarNodeRadius()*2}" />
			</pattern>
			<path id="circlePath" d="M 0 -{getAvatarNodeRadius()+5} A {getAvatarNodeRadius()+5} {getAvatarNodeRadius()+5} 90 1 1 -0.005 -{getAvatarNodeRadius()+5} Z" />
		</defs>
	</svg>
</div>

<style>
	.chart :global(div) {
		font: 14px sans-serif;
		background-color: steelblue;
		text-align: right;
		padding: 3px;
		margin: 1px;
		color: white;
	}
</style>
