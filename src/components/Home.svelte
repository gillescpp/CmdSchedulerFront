<script>
	export let routeParams = {}
	let count = 0;

	function handleClick() {
		count += 1;
	}
</script>

<main>
	<h1>HOME !</h1>

	<button on:click={handleClick}>
		Clicked {count} {count === 1 ? 'time' : 'times'}
	</button>
</main>

<style>
</style>