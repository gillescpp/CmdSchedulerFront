<script>
    import { onMount } from "svelte";
    import { NewModel } from './../../../common/model.js'
    import { ApiFetch, ApiPost } from './../../../common/global.js'  
    import page from 'page.js' 
    import { fade } from 'svelte/transition';

	const apiEP = 'tags';
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
                footMsgClass = 'info';
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
    <div class="content">
        {#if id<=0}
        <h3>{routeParams.page.name} : Création</h3>
        {:else}
        <h3>{routeParams.page.name} n° {data.id}</h3>
        {/if}       

        <form on:submit|preventDefault="{handleSubmit}" class="pure-form pure-form-aligned {wip ? 'disabled' : ''}">
            <fieldset>
                <div class="pure-control-group">
                    <label for="lib">Name</label>
                    <input type="text" id="lib" readonly={readonly} bind:value="{data.lib}" placeholder="name" autocomplete="off" />
                    <span class="pure-form-message-inline">required & unique.</span>
                </div>
                <div class="pure-control-group">
                    <label for="group">Group</label>
                    <input type="text" id="group" readonly={readonly} bind:value="{data.group}" placeholder="group" autocomplete="off" />
                    <span class="pure-form-message-inline">required.</span>
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

        {#if (footMsg!="")}
        <span class="pure-form-message {footMsgClass}" out:fade|local>{footMsg}</span>    
        {/if}
    </div>
</main>

<style>

</style>