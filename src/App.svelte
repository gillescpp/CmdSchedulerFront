<script>
	//lib routage
	import page from 'page.js'
	import { mainPages } from './common/page-menu.js'
	import { IsAuth } from './common/global'
	import { Right } from './common/global.js'   
	import Nav from './Nav.svelte'
	import NotFound from './components/NotFound.svelte'

	//routage
	let currentPage = 0;
	let currentCompo = {};
	let currentRouteParams = {};

	for (const item of mainPages) {
		for (const rt of item.routes) {
			if ( rt.component ) {
				let p = ('/'+item.path);
				if ( rt.path != '') {
					p+= ('/'+rt.path);
				}
				page(p, (ctx) => {
					currentRouteParams.Message = '';
					currentRouteParams.readonly = true;
					currentRouteParams.params = {};
					currentRouteParams.page = item;
					currentPage = 0;
					if ( (item.path != 'auth') && !IsAuth() ) {
						page.redirect('/auth')
					} else {
						currentPage = item.id;
						currentCompo = rt.component;
						currentRouteParams.params = ctx.params;
						currentRouteParams.readonly = Right(item.right).read_only
					}
				});	
			}
		}
	}
	page('*', (ctx) => {
		currentPage = 0;
		currentCompo = NotFound;
	});	
	page.start()

	//avec param :
	/*
	let params;
	router('/article/:id', (ctx, next) => {
  	params = ctx.params
	  next()},  () => page = Article)
	  
	  et dans le script du compo Article :
    import { onMount } from "svelte";

    export let params;

    const init = async () => {
        //use params.id ....
    };
    onMount(init());
	*/

</script>


<main>

	<div id="layout" class="pure-g">
		<div class="sidebar pure-u-1-5">
			<Nav activePage={currentPage} />
		</div>
	
		<div class="content pure-u-4-5">
			{#if currentPage === 0}
			Not Found.
			{:else }
			<svelte:component this={currentCompo} routeParams={currentRouteParams}/>
			{/if}
		</div>
	</div>

</main>

<style>

</style>