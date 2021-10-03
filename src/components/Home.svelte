<script>
	import { onMount, onDestroy } from "svelte";
    import { ApiFetch, ApiPost, IsAuth } from './../common/global.js'  

	const apiEP = 'queue/state';
    export const routeParams = {};
	let interval;
	let next_tasks = [];
	let queues = [];
	let tfManu = [];
	let tfManuRefreshing = false;

    //fetch info
    onMount(async function() {
		updateData()
		refreshTF()

		interval = setInterval(() => {
			updateData();
		}, 1500);
    });

    //clear timer sur unmount
    onDestroy(async function() {
		clearInterval(interval);
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
		if ( tfManuRefreshing ) {
			return;
		}
		//todo grisé si pas droits lancement ?
        let params = new Map()
        params.set("manuallaunch", "eq:"+true);

        ApiFetch('taskflows', params)
        .then((json) => {
            tfManu = json.data;
			tfManuRefreshing = false;
        }) 
        .catch(err => {
            console.log(err)
			tfManuRefreshing = false;
        });
	}	

</script>

<main>

   
	<div class="header-small">

		<div class="items">
			<h1 class="subhead">Dashboard</h1>
		</div>

		<!-- info queues -->
		<div class="column-block-container">
			{#each queues as q}
			<div class="column-block">
				<div class="column-block-header {q.paused ? '' : 'column-success'} "> 
					<h2>{q.lib} {@html q.paused ? '&#x23F8;' : '&#x23F5;'} </h2>
					<span class="column-block-info">  
						<div class="{q.processing > 0 ? 'lds-facebook' : ''}">-<div></div><div></div><div></div></div>  
						<span>{q.processing} / {@html q.size <= 0 ? '&#x221E;' : q.size}</span>
					</span>
				</div>
				<ul class="column-block-list">
					<li>Processing <span class="buble-secondary button-small pull-right">{q.processing}</span></li>
					<li>Waiting <span class="buble-warning button-small pull-right">{q.waiting}</span></li>
				</ul>
			</div>			
			{/each} 
		</div>

		<!-- lancement manuel  {droits ? 'disabled' : ''} -->
		<div  class="full-width-list">
			<table class="pure-table pure-table-horizontal">
				<thead>
				<tr>
					<th>Manual Launch
						<span class="buble-secondary button-small pull-right">
							<a href="#refreshTF" class="clear-link" on:click="{refreshTF}">
								{@html tfManuRefreshing ? '&#x22f3;' : '&#x21bb;'}
							</a>
						</span>
					</th>  
				</tr>
				</thead>

				<tbody>
				{#each tfManu as tf}
				<tr>
					<td>
						{tf.lib}
						<span class="buble-secondary button-small pull-right">
							<a href="#launchTF" class="clear-link" on:click="{() => launchTF(tf.id)}">&#x23F5;</a>
						</span>
					</td>  <!-- waiting : 23F3 -->
				</tr>
				{/each} 
				</tbody>
			</table>
		</div>	

		<!-- taches a venir -->
		<div class="full-width-list">
			<table class="pure-table pure-table-horizontal tasklistgrd">
				<thead>
				<tr>
					<th>Upcoming scheduled tasks</th>
				</tr>
				</thead>

				<tbody>
					{#each next_tasks as t}
					<tr>
						<td>{t}</td>
					</tr>
					{/each} 
				</tbody>
			</table>
		</div>
		

		<div class="footer">
			<div class="pure-menu pure-menu-horizontal">
				<ul>
					<!-- <li class="pure-menu-item"><a href="http://purecss.io/" class="pure-menu-link">PURE CSS</a></li> -->
				</ul>
			</div>
		</div>
	</div>
</main>

<style>
.clear-link {
  color: white;
  text-decoration: none;
}



.lds-facebook {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 60px;
  color: rgba(0, 0, 0, 0); /*cache le texte quand appliqué*/
}
.lds-facebook div {
  display: inline-block;
  position: absolute;
  left: 8px;
  width: 16px;
  background: white;
  animation: lds-facebook 0.6s cubic-bezier(0, 0.5, 0.5, 1) infinite;
}
.lds-facebook div:nth-child(1) {
  left: 8px;
  animation-delay: -0.2s;
}
.lds-facebook div:nth-child(2) {
  left: 32px;
  animation-delay: -0.1s;
}
.lds-facebook div:nth-child(3) {
  left: 56px;
  animation-delay: 0;
}
@keyframes lds-facebook {
  0% {
    top: 8px;
    height: 64px;
  }
  50%, 100% {
    top: 24px;
    height: 32px;
  }
}

</style>