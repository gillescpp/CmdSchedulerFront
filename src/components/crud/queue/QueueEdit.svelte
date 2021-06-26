<script>
    import { onMount } from "svelte";
    import { NewQueue } from './../../../common/model.js'
    import { ApiFetch, ApiPost } from './../../../common/global.js'  
    import page from 'page.js' 

	export let routeParams = {}
    let id = 0; //0=nouveau
    let readonly = false;
    let data = NewQueue();

    if ( routeParams.id > 0 ) {
        id = routeParams.id
    }

    //fetch info
    onMount(async function() {
        if (id > 0) {
            //recup fiche
            ApiFetch('queues/'+id, "GET")
            .then((js) => {
                data = js
            }) 
            .catch(err => {
                alert(err)
            });
        }
    });

    //hanfle submit
    function handleSubmit(event) {
        let url = 'queues'

        ApiPost("queues", data.id, data)
            .then(() => {
                 page.redirect('/queue');
            }) 
            .catch(err => {
                alert(err)
            });
    }

</script>

<main>
    <div class="page">
        {#if id<=0}
        <h3>Nouvelle Queue</h3>
        {:else}
        <h3>Queue {data.id}</h3>
        {/if}       

        <form on:submit|preventDefault="{handleSubmit}" class="pure-form pure-form-aligned">
            <fieldset>
                <div class="pure-control-group">
                    <label for="lib">Name</label>
                    <input type="text" id="lib" readonly={readonly} bind:value="{data.lib}" placeholder="name" autocomplete="off" />
                    <span class="pure-form-message-inline">required & unique.</span>
                </div>
                <div class="pure-control-group">
                    <label for="size">Max Size</label>
                    <input type="number" id="size" readonly={readonly} bind:value="{data.size}" autocomplete="off" />
                </div>
                <div class="pure-control-group">
                    <label for="timeout">Timeout (s)</label>
                    <input type="number" id="timeout" readonly={readonly} bind:value="{data.timeout}" autocomplete="off" />
                </div>
                <div class="pure-control-group">
                    <label for="disabled">Disabled</label>
                    <input type="checkbox" id="disabled" readonly={readonly} bind:value="{data.deleted}" />
                </div>
                {#if !readonly}
                <div class="pure-controls">
                    <button type="submit" class="pure-button pure-button-primary">Save</button>
                </div>
                {/if}       
            </fieldset>
        </form>
    </div>
</main>

<style>

</style>