<script>
    import { onMount } from "svelte";
    import { ApiFetch } from './../../../common/global.js'   
    
    export let routeParams = {};
    const plimit = 10;
    const apiEP = 'tasks';
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
    
</script>

<main>
    <div class="header-small">

        <div class="items">
            <h1 class="subhead">Task List
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
                        <th>Type</th>
                        <th>Agent</th>
                    </tr>
                    <tr>
                        <th colspan=4>
                            <input type="text" id="tinput_search" placeholder="Search" title="Search" bind:value={search} on:input={() => setPage(1)}>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {#if data.data}
                    {#each data.data as item}
                    <tr>
                        <td><a href={routeParams.page.path+'/'+item.id}>{item.id}</a></td>
                        <td>{item.lib}</td>
                        <td>{item.type}</td>
                        <td>{item.exec_on}</td>
                    </tr>      
                    {/each} 
                    {/if}
                </tbody>
                <tfoot>
                    <td colspan=4>
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