<script>
    import { onMount } from "svelte";
    import { NewModel } from './../../../common/model.js'
    import { ApiFetch, ApiPost } from './../../../common/global.js'  
    import page from 'page.js' 
    import { fade } from 'svelte/transition';

	const apiEP = 'agents';
    export let routeParams = {};
    let readonly = routeParams.readonly;
    let wip = true;
    let footMsg = '';
    let footMsgClass = '';
    let id = 0; //0=nouveau
    let data = NewModel(routeParams.page.entity);
    let evaldata = NewModel(routeParams.page.entity);

    if ( routeParams.params.id > 0 ) {
        id = routeParams.params.id;
    }

    //fetch info
    onMount(async function() {
        updateData();
    });

    // get fiche
    async function updateData() {
        wip = true;
        if (id > 0) {
            //recup fiche
            ApiFetch(apiEP+'/'+id)
            .then((js) => {
                footMsg = '';
                footMsgClass = '';
                data = js;
                wip = false;
            }) 
            .catch(err => {
                footMsgClass = 'error';
                footMsg = err;
                wip = false;
            });
        } else {
            wip = false;
        }
    }

    //evaluate
    function handleEvaluate(event) {
        wip = true;

        ApiPost(apiEP+'/eval', 0, data)
            .then((resp) => {
                evaldata = resp;

                wip = false;
            }) 
            .catch(err => {
                footMsgClass = 'error';
                footMsg = err;
                wip = false;
                setTimeout(
                    () => {
                        footMsg = '';
                        footMsgClass = '';
                    }, 2000
                );
            });
    }

    //save
    function handleSubmit(event) {
        wip = true;

        ApiPost(apiEP, data.id, data)
            .then((resp) => {
                data = resp;
                if ( id <= 0 ) {
                    id = resp.id
                    page.show('/'+routeParams.page.path+'/'+id, undefined, false, true);
                }
                wip = false;
                footMsg = 'ok';
                footMsgClass = 'success';
                setTimeout(
                    () => {
                        footMsg = '';
                        footMsgClass = '';
                    }, 2000
                );
            }) 
            .catch(err => {
                footMsgClass = 'error';
                footMsg = err;
                wip = false;
            });
    }

</script>

<main>
    <div class="header-small">
        <div class="items">
            <h1 class="subhead">
                {#if id<=0}
                <h3>{routeParams.page.name} : New</h3>
                {:else}
                <h3>{routeParams.page.name} n° {data.id}</h3>
                {/if}  
            </h1>

            <form on:submit|preventDefault="{handleSubmit}" class="pure-form pure-form-aligned {wip ? 'disabled' : ''}">
                <fieldset>
                    <div class="pure-control-group">
                        <label for="host">Host</label>
                        <input type="text" id="host" readonly={readonly} bind:value="{data.host}" placeholder="host" autocomplete="off" />
                        <button type="button" class="pure-button {wip ? 'disabled' : ''}" on:click="{handleEvaluate}">Evaluate</button>    
                    </div>
                    {#if (evaldata.evalresultinfo!="")}
                    <div class="pure-controls">
                        <label for="evalok1">Ping</label>
                        <input type="checkbox" id="evalok1" disabled="disabled" bind:checked="{evaldata.evalresultaccess}" />
                        <label for="evalok2">Authentication</label>
                        <input type="checkbox" id="evalok2" disabled="disabled" bind:checked="{evaldata.evalresultauth}" />
                        <label for="evalok3">Certificate</label>
                        <input type="checkbox" id="evalok3" disabled="disabled" bind:checked="{evaldata.evalresultcert}" />                   
                    </div>
                    <div class="pure-controls">
                        Eval response: <span class="pure-form-message">{evaldata.evalresultinfo}</span> 
                    </div>                
                    <div class="pure-controls">
                        Cert sign: <span class="pure-form-message">{evaldata.certsigneval}</span> 
                    </div>                
                    {/if}
                    <div class="pure-control-group">
                        <label for="apikey">Api key</label>
                        <input type="text" id="apikey" readonly={readonly} bind:value="{data.apikey}" placeholder="api key" autocomplete="off" class="pure-control-group-long" />
                    </div>

                    <div class="pure-control-group">
                        <label for="certsign">Approved certsign</label>
                        <input type="text" id="certsign" readonly={readonly} bind:value="{data.certsign}" placeholder="approved cert sign" autocomplete="off" class="pure-control-group-long" />
                    </div>
                    <div class="pure-control-group">
                        <label for="activ">Disabled</label>
                        <input type="checkbox" id="activ" readonly={readonly} bind:checked="{data.deleted}" />
                    </div>
                    <div class="pure-controls">
                        <span class="pure-form-message">{data.info}</span> 
                    </div> 
                    <div class="pure-controls">
                        <a href={'/'+routeParams.page.path} class="pure-button">Liste</a>
                        {#if !readonly}
                        <button type="submit" class="pure-button pure-button-primary">Save</button>
                        {/if}       
                    </div>
                </fieldset>
            </form>

            <div class="pure-message message-{footMsgClass}">
                <p>{footMsg}</p>
            </div>
        </div>
    </div>
</main>

<style>

</style>