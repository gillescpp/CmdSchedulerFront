<script>
    import { onMount } from "svelte";
    import { NewModel } from './../../../common/model.js'
    import { ApiFetch, ApiPost } from './../../../common/global.js'  
    import page from 'page.js' 
    import { fade } from 'svelte/transition';

	const apiEP = 'queues';
    export let routeParams = {};
    let readonly = routeParams.readonly;
    let wip = true;
    let footMsg = '';
    let footMsgClass = '';
    let id = 0; //0=nouveau
    let data = NewModel(routeParams.page.entity);

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

    //hanfle submit
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
                        <label for="lib">Name</label>
                        <input type="text" id="lib" readonly={readonly} bind:value="{data.lib}" placeholder="name" autocomplete="off" />
                        <span class="pure-form-message-inline">required & unique.</span>
                    </div>
                    <div class="pure-control-group">
                        <label for="size">Slots</label>
                        <input type="number" id="slot" readonly={readonly} bind:value="{data.slot}" autocomplete="off" />
                    </div>
                    <div class="pure-control-group">
                        <label for="size">Max Size</label>
                        <input type="number" id="size" readonly={readonly} bind:value="{data.size}" autocomplete="off" />
                    </div>

                    <div class="pure-control-group">
                        <label for="timeout">Timeout (ms)</label>
                        <input type="number" id="timeout" readonly={readonly} bind:value="{data.timeout}" autocomplete="off" />
                    </div>
                    <div class="pure-control-group">
                        <label for="paused">Paused</label>
                        <input type="checkbox" id="paused" readonly={readonly} bind:checked="{data.paused}" />
                        {#if data.paused}
                        since <span class="pure-form-message">{data.paused_from}</span>    
                        {/if}
                    </div>
                    <div class="pure-control-group">
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