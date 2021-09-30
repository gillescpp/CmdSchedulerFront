<script>
import { len } from "page.js";

    import { onMount } from "svelte";
    import { ApiFetch } from './../../../common/global.js'   
    
    export let routeParams = {};
    const plimit = 10;
    const apiEP = 'cfgs';
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
            params.set("key", "like:"+search);
        }
        params.set("limit", plimit);

        ApiFetch(apiEP, params)
        .then((json) => {
            wip = false;
            //data = json;
            ////////////////// paging pas géré par ce EP !
            data.data = json;
            data.totalRecord = data.data.length;
            data.totalPage  = 1;
            data.page  = 1;
            /////////////////
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
    <div class="content">
        <!-- liste -->
        <table class="pure-table pure-table-striped {wip ? 'disabled' : ''}">
            <thead>
                <tr>
                    <th>Clé</th>
                    <th>Valeur</th>
                </tr>
                <tr>
                    <th colspan=2>
                        <input type="text" id="tinput_search" placeholder="Recherche..." title="Recherche" bind:value={search} on:input={() => setPage(1)}>
                    </th>
                </tr>
            </thead>
            <tbody>
                {#if data.data}
                {#each data.data as item}
                <tr>
                    <td><a href={routeParams.page.path+'/'+encodeURI(item.key)}>{item.key}</a></td>
                    <td>{item.value}</td>
                </tr>      
                {/each} 
                {/if}

                <!-- btn new -->
                {#if !readonly}
                <tr>
                    <td colspan=2>
                        <a href={routeParams.page.path+'/new'} class="">New</a>
                    </td>
                </tr>                          
                {/if}
            </tbody>
            <tfoot>
                <td colspan=2>
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
</main>

<style>

</style>