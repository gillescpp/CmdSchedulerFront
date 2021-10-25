<script>
    import { onMount } from "svelte";
    import { NewModel } from './../../../common/model.js'
    import { ApiFetch, ApiPost, ApiFetchFull } from './../../../common/global.js'  
    import page from 'page.js' 
    
	const apiEP = 'tasks';
    export let routeParams = {};
    let readonly = routeParams.readonly;
    let wip = true;
    let footMsg = '';
    let footMsgClass = '';
    let id = 0; //0=nouveau
    let data = NewModel(routeParams.page.entity);
    let agents = [];
    let selectedAgent = 0; //1 seul agent géré

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
        selectedAgent = 0;
        //init liste des agents
        agents = [];
        await ApiFetchFull('agents')
            .then((js) => {
                agents.push(...js);
                agents = agents;
            }) 
            .catch(err => {
                footMsgClass = 'error';
                footMsg = err;
                return;
            });

        if (id > 0) {
            //recup fiche
            ApiFetch(apiEP+'/'+id)
            .then((js) => {
                footMsg = '';
                footMsgClass = '';
                data = js;
                if ( data.exec_on.length > 0 ) {
                    selectedAgent = data.exec_on[0]
                }
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
        data.exec_on[0] = selectedAgent;

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

    //helper tableau arg
    function appendArg() {
        data.args.push('');
        data.args = data.args; //(pour forcer la reactivité svelte)
    }
    function removeArg() {
        data.args.pop();
        data.args = data.args; //(pour forcer la reactivité svelte)
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
                        <input type="text" id="lib" readonly={readonly} bind:value="{data.lib}" placeholder="name" autocomplete="off" class="pure-control-group-long"/>
                    </div>

                    <div class="pure-control-group">
                        <label for="atype" class="pure-radio">Type</label>
                        <span id="atype">
                            <input type="radio" id="ttype1" name="ttype" checked={data.type=='CmdTask'} on:click="{()=>{data.type='CmdTask';}}" />
                            <label for="ttype1" class="pure-radio">Shell command</label>
                        </span>
                    </div>
                    <div class="pure-control-group">
                        <label for="btype" class="pure-radio"></label>
                        <span id="btype">
                            <input type="radio" id="ttype2" name="ttype" checked={data.type=='URLCheckTask'} on:click="{()=>{data.type='URLCheckTask';}}" />
                            <label for="ttype2" class="pure-radio">Http GET</label>
                        </span>
                    </div>

                    <div class="pure-control-group">
                        <label for="timeout">Timeout (ms)</label>
                        <input type="number" id="timeout" readonly={readonly} bind:value="{data.timeout}" placeholder="timeout" autocomplete="off" />
                    </div>
                    
                    <div class="pure-control-group">
                        <label for="logstore">LogStore</label>
                        <input type="text" id="logstore" readonly={readonly} bind:value="{data.log_store}" placeholder="LogStore" autocomplete="off" />
                    </div>
                    
                    {#if data.type=='CmdTask'}
                    <div class="pure-control-group">
                        <label for="Cmd">Cmd</label>
                        <input type="text" id="Cmd" readonly={readonly} bind:value="{data.cmd}" placeholder="command path" autocomplete="off" class="pure-control-group-long"/>
                    </div>                       

                    {#if data.args.length == 0}
                    <div class="pure-control-group">
                        <label for="Args">Arguments</label>
                        <a href="#+" on:click="{() => appendArg()}">+</a>
                    </div>  
                    {/if}
                    {#each data.args as arg, idx}
                    <div class="pure-control-group">
                        <label for="Args{idx}">{#if idx == 0}Arguments{/if} </label>
                        <input type="text" id="Arg{idx}" readonly={readonly} bind:value="{arg}" placeholder="argument" autocomplete="off" />    
                        
                        {#if idx >= (data.args.length-1) }
                        <a href="#+" on:click="{() => appendArg()}">+</a> /
                        <a href="#-" on:click="{() => removeArg()}">-</a>
                        {/if}
                    </div>  
                    {/each}

                    <div class="pure-control-group">
                        <label for="StartIn">StartIn</label>
                        <input type="text" id="StartIn" readonly={readonly} bind:value="{data.start_in}" placeholder="start in folder" autocomplete="off" class="pure-control-group-long"/>
                    </div>     
                    {/if}

                    {#if data.type=='URLCheckTask'}
                    <div class="pure-control-group">
                        <label for="Cmd">Url</label>
                        <input type="text" id="Cmd" readonly={readonly} bind:value="{data.cmd}" placeholder="httpx://..." autocomplete="off" class="pure-control-group-long"/>
                    </div>                       
                    {/if}
                    
                    <div class="pure-control-group">
                        <label for="ExecOn">ExecOn</label>

                        <select bind:value="{selectedAgent}" class="pure-control-group-long" disabled={readonly}>
                            {#each agents as a}
                                <option value={a.id}>
                                    {a.host}
                                </option>
                            {/each}
                        </select>
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