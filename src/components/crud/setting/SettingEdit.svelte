<script>
    import { onMount } from "svelte";
    import { NewModel } from './../../../common/model.js'
    import { ApiFetch, ApiPost } from './../../../common/global.js'  
    import page from 'page.js' 
    import { fade } from 'svelte/transition';

	const apiEP = 'cfgs';
    export let routeParams = {};
    let readonly = routeParams.readonly;
    let wip = true;
    let footMsg = '';
    let footMsgClass = '';
    let id = ''; //''=nouveau
    let data = NewModel(routeParams.page.entity);

    if ( routeParams.params.id != '' && routeParams.params.id != 'new' ) {
        id = routeParams.params.id;
    }

    //fetch info
    onMount(async function() {
        updateData();
    });

    // get fiche
    async function updateData() {
        wip = true;
        if (id != '') {
            //recup fiche
            ApiFetch(apiEP+'/'+encodeURI(id))
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

        ApiPost(apiEP, data.key, data)
            .then((resp) => {
                data = resp;
                if ( id == '' ) {
                    id = resp.key
                    page.show('/'+routeParams.page.path+'/'+encodeURI(id), undefined, false, true);
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
                {#if data.key==""}
                <h3>{routeParams.page.name} : New</h3>
                {:else}
                <h3>{routeParams.page.name} {data.key}</h3>
                {/if}  
            </h1>    

            <form on:submit|preventDefault="{handleSubmit}" class="pure-form pure-form-aligned {wip ? 'disabled' : ''}">
                <fieldset>
                    <div class="pure-control-group">
                        <label for="key">Key</label>
                        <input type="text" id="key" readonly={readonly || (id!='')} bind:value="{data.key}" placeholder="key" autocomplete="off" />
                        <span class="pure-form-message-inline">required & unique.</span>
                    </div>
                    <div class="pure-control-group">
                        <label for="val">Value</label>
                        <input type="text" id="val" readonly={readonly} bind:value="{data.value}" placeholder="value" autocomplete="off" class="pure-control-group-long" />
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