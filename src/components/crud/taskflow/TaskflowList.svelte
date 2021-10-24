<script>
    import { onMount } from "svelte";
    import { ApiFetch, ApiPost } from './../../../common/global.js'   
    
    export let routeParams = {};
    const plimit = 20;
    const apiEP = 'taskflows';
    let readonly = routeParams.readonly;
    let wip = true;
    let footMsg = ''
    let footMsgClass = ''
    let search = '';
    let data = {};
    data.data= [];

    //fetch info
    onMount(async function() {
        setPage(1);
    });

    //changement de la liste
    function setPage(p) {
        wip = true;
        let params = new Map()
        params.set("page", p);
        if (search != "") {
            params.set("lib", "like:"+search);
        }
        params.set("limit", plimit);

        ApiFetch(apiEP, params)
        .then((json) => {
            wip = false;
            data = json;
            footMsg = '';
        }) 
        .catch(err => {
            wip = false;
            footMsgClass = 'error';
            footMsg = err;
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

</script>

<main>
    <div class="header-small">

        <div class="items">
            <h1 class="subhead">Taskflow List
                {#if !readonly}
                <a class="pure-button button-small button-secondary" href={routeParams.page.path+'/new'}>Add New</a>
                {/if}
            </h1>

            <!-- liste -->
            <table class="pure-table pure-table-striped {wip ? 'disabled' : ''}">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Activ</th>
                    </tr>
                    <tr>
                        <th colspan=3>
                            <input type="text" id="tinput_search" placeholder="Search" title="Search" bind:value={search} on:input={() => setPage(1)}>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {#if data.data}
                    {#each data.data as item}
                    <tr>
                        <td><a href={routeParams.page.path+'/'+item.id}>{item.id}</a></td>
                        <td>
                            {item.lib}
                            {#if item.manuallaunch}
                            <span class="buble-secondary button-small pull-right clickable" on:click="{() => launchTF(item.id)}">
                                &#x23F5;
                            </span>                            
                            {/if}
                        </td>
                        <td>{@html item.activ ? '&#10004;' : '&#10008;'}</td>
                    </tr>      
                    {/each} 
                    {/if}
                </tbody>
                <tfoot>
                    <td colspan=3>
                        {#if data.totalRecord}
                        Total : {data.totalRecord}.
                        <!-- pagination -->
                        {#if ( data.totalPage > 0 )}
                        Pages :
                        {#each Array(data.totalPage) as _, p}
                        &nbsp; <a href={'#'} class="{data.page === (p+1) ? 'pagination active' : 'pagination'}" on:click|preventDefault={() => setPage(p+1)}>{p+1}</a>
                        {/each}
                        {/if}
                        {/if}
                    </td>
                </tfoot>
            </table>
            
            <span class="pure-form-message {footMsgClass}">{footMsg}</span>
        </div>
    </div>
</main>

<style>

</style>