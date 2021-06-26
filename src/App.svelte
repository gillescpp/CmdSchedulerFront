<script>
	//lib routage
	import page from 'page.js'
	import { mainPages } from './common/page-menu.js'
	import { IsAuth } from './common/global'
	import Nav from './Nav.svelte'
	import NotFound from './components/NotFound.svelte'

	//props
	//export let appTitle = '';

	//routage
	let currentPage = 0;
	let currentCompo = {};
	let currentRouteParams = {};

	for (const item of mainPages) {
		for (const rt of item.routes) {
			if ( rt.component ) {
				page(item.path+rt.path, (ctx) => {
					if ( !item.public && !IsAuth() ) {
						page.redirect("/auth")
					} else {
						currentPage = item.id;
						currentCompo = rt.component;
						currentRouteParams = ctx.params;
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

<Nav activePage={currentPage} />

<main>
	{#if currentPage === 0}
	Not Found.
	{:else }
	<svelte:component this={currentCompo} routeParams={currentRouteParams}/>
	{/if}
	<!--
	{#if currentPage === 'About'}
	<About/>
	{:else if currentPage === 'XXX'}
	<About/>
	{:else}
	<Home/>
	{/if}
	-->

</main>

<style>

</style>