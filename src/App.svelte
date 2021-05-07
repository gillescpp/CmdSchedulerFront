<script>
	//lib routage
	import page from 'page.js'
	import { mainPages } from './common/page-menu.js'
	//compo navigation
	import Nav from './Nav.svelte'
	//import { activeTab } from './common/global.js'
	//compos pages
	import Home from './components/Home.svelte'
	import NotFound from './components/NotFound.svelte'
	//import Users from './components/users/Users.svelte'  

	//routage
	let currentPage = '';
	let currentCompo = {};
	let currentRouteParams = {};
	page('/', (ctx) => {
		currentPage = 'Home';
		currentCompo = Home;
		currentRouteParams = ctx.params;
	});	
	page('/advanced', (ctx) => {
		currentPage = 'Advanced';
		currentCompo = Advanced;
		currentRouteParams = ctx.params;
	});	
	page('/user/:id', (ctx) => {
		currentPage = 'User';
		currentCompo = User;
		currentRouteParams = ctx.params;
	});	
	page('*', (ctx) => {
		currentPage = '';
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

<Nav activeTab={currentPage} />

<main>
	{#if currentPage === ''}
	Not Found.
	{:else }
	Compo {currentPage}
	<svelte:component this={currentCompo}/>
		
	<!-- <svelte:component this={currentCompo} routeParams={currentRouteParams} /> -->
	{/if}
	<!-- <svelte:component this={currentPage} /> -->
	<!--
	<svelte:component this={pages.get(currentPage).component} routeParams={currentRouteParams} /> 
	-->
	
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