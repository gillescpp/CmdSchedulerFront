<script>
import { onMount } from "svelte";
import { mainPages } from "./common/page-menu"


	export let activeTab = '';
	$: isActive = (str) => str == activeTab ? 'selected' : '';

	onMount(()=>{
		//
	})

</script>

<p>
	{activeTab}
</p>
<nav>
	<ul>
		{#each mainPages as page }
			<li><a class="{ isActive(page.name) }" href="{page.menuUrl}">{page.name}</a></li>
		{/each}
	</ul>
</nav>

<style>
	nav {
		border-bottom: 1px solid rgba(170,30,30,0.1);
		font-weight: 300;
		padding: 0 1em;
	}
	ul {
		margin: 0;
		padding: 0;
	}
	/* clearfix */
	ul::after {
		content: '';
		display: block;
		clear: both;
	}
	li {
		display: block;
		float: left;
	}
	.selected {
		position: relative;
		display: inline-block;
	}
	.selected::after {
		position: absolute;
		content: '';
		width: calc(100% - 1em);
		height: 2px;
		background-color: rgb(170,30,30);
		display: block;
		bottom: -1px;
	}
	a {
		text-decoration: none;
		padding: 1em 0.5em;
		display: block;
	}
</style>