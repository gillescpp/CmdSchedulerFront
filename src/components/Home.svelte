<script>
	import { onMount } from "svelte";
    import { ApiFetch, ApiPost, IsAuth } from './../common/global.js'  

	const apiEP = 'queue/state';
    export let routeParams = {};
	let next_tasks = [];
	let queues = [];
	let tfManu = [];

    //fetch info
    onMount(async function() {
		updateData()
		refreshTF()

		const interval = setInterval(() => {
			updateData();
		}, 1500);
		
		//clear timer sur unmount
		return () => clearInterval(interval);
    });

    // get fiche
    async function updateData() {
		if (!IsAuth()) {
			return;
		}

		//recup info queues et taches à suivre
		ApiFetch(apiEP)
		.then((js) => {
			//map id=queuesstate => [] pour l'etat des taches
			queues = Object.values(js.queues)
			next_tasks = js.next_task;
		}) 
		.catch(err => {
			console.log(err)
		});
    }	

    // lancement tache manu
    async function launchTF(id) {
		let tf = {"id":id} ;

        ApiPost("taskflows/launch", 0, tf)
            .then((resp) => {
                console.log('tache lancé');
            }) 
            .catch(err => {
                console.log(err);
            });
	}

    // maj liste tache manu
    async function refreshTF() {
		//todo grisé si pas droits lancement ?
        let params = new Map()
        params.set("manuallaunch", "eq:"+true);

        ApiFetch('taskflows', params)
        .then((json) => {
            tfManu = json.data;
        }) 
        .catch(err => {
            console.log(err)
        });
	}	

</script>

<main>
	<div class="banner">
		<h1 class="banner-head">
			Task in progress
		</h1>
	</div>


	<div class = "boxQueue">
		<!-- info queues -->
		{#each queues as q}
		<div class="cellQueue">
			{#if q.id == 0}
			Direct<br>
			Paused : <span class="{q.paused ? 'twarn' : 'tnormal'}">{q.paused}</span><br>
			Processing : <span class="{q.processing > 0 ? 'tblue' : 'tnormal'}">{q.processing}</span>
			{:else}
			Queue {q.id} : {q.lib} <br>
			Paused : <span class="{q.paused ? 'twarn' : 'tnormal'}">{q.paused}</span><br>
			Waiting : <span class="{q.waiting > 0 ? 'tblue' : 'tnormal'}">{q.waiting}</span>			
			Processing : <span class="{q.processing > 0 ? 'tblue' : 'tnormal'}">{q.processing}</span>			
			{/if}
		</div>
		{/each} 
		
		
		<!-- info next tasks -->
		<div class="cellNextTf">
			Next tasks :<br>
			{#each next_tasks as t}
			{t} <br>
			{/each} 
		</div>
	</div>


	<!-- tache lancable en manu     {droitmanutf ? 'disabled' : ''}-->
	<table class="pure-table pure-table-striped">
		<thead>
			<tr>
				<th>#</th>
				<th>Launch manualy</th>
				<th><a href="#refreshTF" on:click="{() => refreshTF()}">&#128472;</a></th>
			</tr>
		</thead>
		<tbody>
			{#each tfManu as tf}
			<tr>
				<td><a href={'taskflow/'+tf.id}>{tf.id}</a></td>
				<td>{tf.lib}</td>
				<td><a href="#launchTF" on:click="{() => launchTF(tf.id)}">&#x23F5;</a></td>
			</tr>      
			{/each} 
		</tbody>
	</table>	

</main>

<style>
	.boxQueue {
		display: flex;
	}

	.cellQueue {
		width: 150px;
		height: 150px;

		background-color: rgb(197, 208, 214);
		margin: 4px;
		border: 2px solid;
	}
	.cellNextTf {
		height: 150px;
		overflow-y: scroll;

		background-color: rgb(197, 214, 212);
		margin: 4px;
		border: 2px solid;
	}

	.tnormal {
		font-weight: normal;
		color: rgb(10, 10, 10);
	}
	.twarn {
		font-weight: bold;
		color:darkred;
	}
	.tblue {
		font-weight: bold;
		color:darkblue;
	}
</style>