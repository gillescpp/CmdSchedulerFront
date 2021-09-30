<script>
	import { mainPages } from "./common/page-menu"
	import { Right } from './common/global'

	//elements du menu
	let mnuView = [];
	export let activePage = 0; //page active fourni par App

	$: if ( activePage > 0 ) {
		updateMnu();
	}

	//prepa seuls elements visible du menu : 
	function updateMnu() {
		mnuView = [];
		for (const mnu of mainPages) {
			if ( mnu.visibleMnu && Right(mnu.right).allowed ) {
				for (const el of mnu.routes) {
					if ( el.component != null ) {
						let cssC = mnu.id === activePage ? "selected" : "";
						mnuView.push({
							cssClass: cssC,
							href: '/'+mnu.path,
							name: mnu.name,
						});
						break;
					}
				}
			}
		}
	}
	
</script>

<nav>
	<ul>
		{#each mnuView as item}
		<li><a class="{item.cssClass}" href="{item.href}">{item.name}</a></li>
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