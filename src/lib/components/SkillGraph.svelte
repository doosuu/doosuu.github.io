<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';

	const DEFAULT_RADIUS = 50;

	interface Data {
		name: string;
		level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
		children?: Data[];
	}

	function getScaleFactor(level?: 'beginner' | 'intermediate' | 'advanced' | 'expert'): number {
		switch (level) {
			case 'beginner':
				return 0.5;
			case 'intermediate':
				return 0.75;
			case 'advanced':
				return 1.0;
			case 'expert':
				return 1.25;
			default:
				return 1.0; // Default scale factor if no level is provided
		}
	}

	var data: Data = {
		name: 'me',
		children: [
			{
				name: 'coding',
				children: [
					{ name: 'c++', level: 'expert' },
					{ name: 'TypeScript', level: 'advanced' },
					{ name: 'Python', level: 'expert' },
					{ name: 'Java', level: 'intermediate' },
					{ name: 'C#', level: 'intermediate' },
					{ name: 'Rust', level: 'beginner' }
				]
			},
			{
				name: 'languages',
				children: [
					{ name: 'English', level: 'advanced' },
					{ name: 'German', level: 'expert' }
				]
			},
			{
				name: 'methods',
				children: [
					{ name: 'Agile', level: 'advanced' },
					{ name: 'Scrum', level: 'advanced' },
					{ name: 'Kanban', level: 'intermediate' },
					{ name: 'Waterfall', level: 'advanced' }
				]
			},
			{
				name: 'os',
				children: [
					{ name: 'Linux', level: 'advanced' },
					{ name: 'Windows', level: 'advanced' },
					{ name: 'macOS', level: 'advanced' }
				]
			},
			{
				name: 'mindset',
				children: [
					{ name: 'problem solving', level: 'expert' },
					{ name: 'teamwork', level: 'expert' },
					{ name: 'communication', level: 'advanced' },
					{ name: 'adaptability', level: 'advanced' },
					{ name: 'creativity', level: 'intermediate' }
				]
			}
		]
	};

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
	let width = 1000;
	let height = 500;

	onMount(() => {
		width = window.innerWidth;
		height = window.innerHeight;

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
					.distance(150)
					.strength(3)
			)
			.force('charge', d3.forceManyBody().strength(-2000))
			.force('x', d3.forceX())
			.force('y', d3.forceY());

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

		const circle = node
			.append('circle')
			.attr('fill', '#fff')
			.attr('stroke', '#000')
			.attr('stroke-width', 3)
			.attr('fill', (d) => (d.data === data ? null : '#000'))
			.attr('stroke', (d) => (d.data === data ? null : '#fff'))
			.attr('r', (d) => getScaleFactor(d.data.level) * DEFAULT_RADIUS)
			.filter((d) => d.data.name === 'me')
			.attr('fill', 'url(#imgPattern)');

		//node.append('title').text((d) => d.data.name);

		const text = node
			.append('g')
			.attr('transform', 'translate(-0.5 -0.5)')
			.append('text')
			.text((d) => d.data.name)
			.attr('fill', '#fff')
			.attr('text-anchor', 'middle')
			.attr('font-size', (d) => `${21 * getScaleFactor(d.data.level)}pt`);

		simulation.on('tick', () => {
			link
				.attr('x1', (d) => d.source.x || 0)
				.attr('y1', (d) => d.source.y || 0)
				.attr('x2', (d) => d.target.x || 0)
				.attr('y2', (d) => d.target.y || 0);

			node.attr('transform', (d) => `translate(${d.x || 0}, ${d.y || 0})`);
		});

		//invalidation.then(() => simulation.stop());

		//return svg.node();
		/*
		d3.select(el)
			.selectAll('div')
			.data(data)
			.enter()
			.append('div')
			.style('width', function (d) {
				return d + 'px';
			})
			.text(function (d) {
				return d;
			});
            */
	});
</script>

<div class="chart w-full">
	<svg
		bind:this={el}
		class="h-full w-full"
		text-anchor="middle"
		viewBox={`${-width / 2} ${-height / 2} ${width} ${height}`}
	>
		<defs>
			<pattern id="imgPattern" patternUnits="userSpaceOnUse" width="300" height="300">
				<image href="./images/me.jpg" x="0" y="0" width="300" height="300" />
			</pattern>
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
