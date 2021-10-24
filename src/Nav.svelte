<script>
	import { mainPages } from "./common/page-menu"
	import { Right, ClearToken } from './common/global'
	import page from 'page.js'

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
						mnuView.push({
							selected: (mnu.id === activePage),
							href: '/'+mnu.path,
							name: mnu.name,
						});
						break;
					}
				}
			}
		}
	}

	//dedonnection
	function disconnect() {
		ClearToken();
		page.redirect('/');
	}
	
</script>

<nav>
	<div id="menu">
		<div class="pure-menu">
			<div class="sidebar-title">
				<span id="txttitle" class="pure-menu-heading">Scheduler</span>
				<span id="favicon"><img src="favicon24.png" alt="Cmd Scheduler" /></span>
			</div>

			<a href="/#disconnect" class="" on:click="{disconnect}">&crarr;</a>

			<ul class="pure-menu-list">
				{#each mnuView as item}
				<li class="{item.selected ? 'pure-menu-selected' : ''}">
					<a class="pure-menu-link" href="{item.href}">{item.name}</a>
				</li>
				{/each}	
			</ul>
		</div>
	</div>

</nav>

<style>

</style>