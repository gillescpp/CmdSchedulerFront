<script>
	import { mainPages } from "./common/page-menu"

	//elements du menu
	export let activePage = 0; //fourni par App

	$: isActive = (pgid) => pgid == activePage ? 'selected' : '';

	//prepa seuls elements visible du menu : visibleMnu + 1 compo de réf
	let mnuView = [];
	for (const mnu of mainPages) {
		if ( mnu.visibleMnu ) {
			for (const el of mnu.routes) {
				if ( el.component != null ) {
					mnuView.push(mnu);
					break;
				}
			}
		}
	}

</script>

<p>
	{activePage}
</p>
<nav>
	<ul>
		{#each mnuView as item}
		{#if item.visibleMnu}
		<li><a class="{ isActive(item.id) }" href="{item.path}">{item.name}</a></li>
		{/if}
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