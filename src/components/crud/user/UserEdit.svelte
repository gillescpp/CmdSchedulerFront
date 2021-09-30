<script>
    import { onMount } from "svelte";
    import { NewModel } from './../../../common/model.js'
    import { ApiFetch, ApiPost } from './../../../common/global.js'  
    import page from 'page.js' 
    import { fade } from 'svelte/transition';

	const apiEP = 'users';
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
                    <label for="name">Name</label>
                    <input type="text" id="name" readonly={readonly} bind:value="{data.name}" placeholder="Name" autocomplete="off" />
                </div>
                <div class="pure-control-group">
                    <label for="ulogin">Login</label>
                    <input type="text" id="ulogin" readonly={readonly} bind:value="{data.login}" placeholder="Login" autocomplete="new-password" />
                    <span class="pure-form-message-inline">required & unique.</span>
                </div>
                <div class="pure-control-group">
                    <label for="upassword">Password</label>
                    <input type="password" id="upassword" readonly={readonly} bind:value="{data.password}" placeholder="password" autocomplete="new-password" />
                </div>

                <div class="pure-control-group">
                    <label for="ar1" class="pure-radio">Right level</label>
                    <span id="ar1">
                        <input type="radio" id="rr1" name="rr1" checked={data.rightlevel==100} on:click="{()=>{data.rightlevel=100;}}" />
                        <label for="rr1" class="pure-radio">Admin</label>
                    </span>
                </div>
                <div class="pure-control-group">
                    <label for="ar2" class="pure-radio"></label>
                    <span id="ar2">
                        <input type="radio" id="rr2" name="rr2" checked={data.rightlevel==50} on:click="{()=>{data.rightlevel=50;}}" />
                        <label for="rr2" class="pure-radio">Task builder</label>
                    </span>
                </div>
                <div class="pure-control-group">
                    <label for="ar3" class="pure-radio"></label>
                    <span id="ar3">
                        <input type="radio" id="rr3" name="rr3" checked={data.rightlevel==10} on:click="{()=>{data.rightlevel=10;}}" />
                        <label for="rr3" class="pure-radio">Task runner</label>
                    </span>
                </div>
                <div class="pure-control-group">
                    <label for="ar4" class="pure-radio"></label>
                    <span id="ar4">
                        <input type="radio" id="rr4" name="rr4" checked={data.rightlevel==1} on:click="{()=>{data.rightlevel=1;}}" />
                        <label for="rr4" class="pure-radio">Viewer</label>
                    </span>
                </div>                


                <div class="pure-control-group">
                    <label for="activ">Disabled</label>
                    <input type="checkbox" id="activ" readonly={readonly} bind:checked="{data.deleted}" />
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