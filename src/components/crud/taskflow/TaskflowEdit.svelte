<script>
    import { onMount } from "svelte";
    import { NewModel } from './../../../common/model.js'
    import { ApiFetch, ApiPost, ApiFetchFull } from './../../../common/global.js'  
    import page from 'page.js' 

	const apiEP = 'taskflows';
    export let routeParams = {};
    let readonly = routeParams.readonly;
    let wip = true;
    let footMsg = '';
    let footMsgClass = '';
    let id = 0; //0=nouveau
    let queues = [];
    let scheds = [];
    let tasks = [];
    let data = NewModel(routeParams.page.entity);
    let dNamedArgs = []; //intermédaire pour named_args (object kv)

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

        //init liste des queues
        queues = [{"id": 0, "lib": ""}];
        await ApiFetchFull('queues')
            .then((js) => {
                queues.push(...js);
                queues = queues;
            }) 
            .catch(err => {
                footMsgClass = 'error';
                footMsg = err;
                return;
            });

        //init liste des scheds
        scheds = [{"id": 0, "lib": ""}];
        await ApiFetchFull('scheds')
            .then((js) => {
                scheds.push(...js);
                scheds = scheds;
            }) 
            .catch(err => {
                footMsgClass = 'error';
                footMsg = err;
                return;
            });

        // init des taches
        tasks = [{"id": 0, "lib": ""}];
        await ApiFetchFull('tasks')
            .then((js) => {
                tasks.push(...js);
                tasks = tasks;
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
                dNamedArgs = Object.entries(data.named_args) //[["key": "val"], ["key2": "val2"]]
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

    //handle submit
    function handleSubmit(event) {
        wip = true;

        //retravaille des named_arg
        let mpNA = new Map();
        for (const [key, value] of dNamedArgs) {
            let k = key.trim().toUpperCase();
            let v = value.trim();
            if ( k != "") {
                mpNA.set(k,v);
            }
        }
        dNamedArgs = Array.from(mpNA, ([name, value]) => ([ name, value ])); //pour affichage [["key": "val"], ["key2": "val2"]]
        data.named_args = Object.fromEntries(mpNA); //pour ws {{"key": "val"}, {"key2": "val2"}}
        

        //pose des index sur les taches
        updIdxElm();

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

    //ajoute element liste des taches
    function appendElm() {
        data.detail.push(NewModel('TASKFLOW_D'));
        updIdxElm()
        data.detail = data.detail; //(pour forcer la reactivité svelte)
    }
    function removeElm(idx) {
        data.detail.splice(idx, 1);
        updIdxElm()
        data.detail = data.detail; //(pour forcer la reactivité svelte)
    }
    function updIdxElm() {
        //retravaille du tableau de tache : pose des index
        data.detail.forEach( (_, i) => {
            data.detail[i].idx = (i+1);
            //check que les next soit valides
            let valid_nexts_ids = [];
            getElmActions(data.detail[i].idx).forEach( (v) => {
                valid_nexts_ids.push(v.id);
            });
            if ( !valid_nexts_ids.includes(data.detail[i].nexttaskid_ok) ) {
                data.detail[i].nexttaskid_ok = 0;
            }
            if ( !valid_nexts_ids.includes(data.detail[i].nexttaskid_fail) ) {
                data.detail[i].nexttaskid_fail = -1;
            } 
        });
    }

    //retourne les actions possible pour de detail
    function getElmActions(idx) {
        let actions = [ {
            "id": 0,
            "lib": "End OK"
        }, {
            "id": -1,
            "lib": "End Error"
        }];

        data.detail.forEach( (_, i) => {
            if ( data.detail[i].idx != idx ) {
                actions.push({
                    "id": data.detail[i].idx,
                    "lib": "Goto " + data.detail[i].idx
                });
            }
        });
        return actions;
    }

    //tags
    function appendTag() {
        data.tags.push(1)
        data.tags = data.tags; //(pour forcer la reactivité svelte)
    }
    function removeTag() {
        data.tags.pop()
        data.tags = data.tags; //(pour forcer la reactivité svelte)
    }

    //named args
    function appendNArg() {
        dNamedArgs.push(["NEW", ""]);
        dNamedArgs = dNamedArgs; //(pour forcer la reactivité svelte)
    }
    function removeNArg(key) {
        for(var i = 0; i < dNamedArgs.length; i++){
            if ( dNamedArgs[i][0] == key ) {
                dNamedArgs.splice(i,1);
            }
        }
        dNamedArgs = dNamedArgs; //(pour forcer la reactivité svelte)
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
                    </div>
                    <div class="pure-control-group">
                        <label for="tags">Tags</label>          
                        {#each data.tags as t, idx}
                        <input type="number" id="tags{idx}" readonly={readonly} bind:value="{t}" placeholder="tag" autocomplete="off" />    
                        {/each}
                        <a href="#+" on:click="{() => appendTag()}">+</a> /
                        <a href="#-" on:click="{() => removeTag()}">-</a>
                    </div>

                    <div class="pure-control-group">
                        <label for="natitle">Named Args</label>             
                        <a id="natitle" href="#+" on:click="{() => appendNArg()}">+</a>
                    </div>
                    
                    
                    {#each dNamedArgs as [key, value]}
                    <div class="pure-control-group">
                        <label for="nakv{key}"></label>          
                        <input id="nakv{key}" type="text" readonly={readonly} bind:value="{key}" placeholder="name" autocomplete="off" />    
                        <input type="text" readonly={readonly} bind:value="{value}" placeholder="value" autocomplete="off" />    
                        <a href="#-" on:click="{() => removeNArg(key)}">-</a>               
                    </div>
                    {/each}
                    

                    <div class="pure-control-group">
                        <label for="errmng">Error Mng</label>
                        <input type="number" id="errmng" readonly={readonly} bind:value="{data.err_management}" placeholder="err management" autocomplete="off" />
                    </div>

                    <div class="pure-control-group">
                        <label for="queue">Queue</label>

                        <select id="queue" disabled={readonly} bind:value="{data.queueid}" class="pure-control-group-long">
                            {#each queues as d}
                                <option value={d.id}>
                                    {d.lib}
                                </option>
                            {/each}
                        </select>
                    </div>                      

                    <div class="pure-control-group">
                        <label for="sched">scheduling</label>

                        <select id="sched" disabled={readonly} bind:value="{data.scheduleid}" class="pure-control-group-long">
                            {#each scheds as d}
                                <option value={d.id}>
                                    {d.lib}
                                </option>
                            {/each}
                        </select>
                    </div>                      

                    <div class="pure-control-group">
                        <label for="allmanl">Allow manual launch</label>
                        <input type="checkbox" id="allmanl" readonly={readonly} bind:checked="{data.manuallaunch}" />
                    </div>
                    <div class="pure-control-group">
                        <label for="activ">Actif</label>
                        <input type="checkbox" id="activ" readonly={readonly} bind:checked="{data.activ}" />
                    </div>
    
                    <!-- liste taches -->
                    <h4>Detail</h4>
                    <table class="pure-table pure-table-striped">
                        <thead>
                            <tr>
                                <th>Idx</th>
                                <th>Task</th>
                                <th>If OK</th>
                                <th>If Fail</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {#if data.detail}
                            {#each data.detail as _, d}
                            <tr>
                                <td>{data.detail[d].idx}</td>
                                <!-- tache -->
                                <td><select disabled={readonly} bind:value="{data.detail[d].taskid}">
                                    {#each tasks as d}
                                        <option value={d.id}>
                                            {d.lib}
                                        </option>
                                    {/each}
                                </select></td>
                                <!-- suite SI OK -->
                                <td><select disabled={readonly} bind:value="{data.detail[d].nexttaskid_ok}">
                                    {#each getElmActions(data.detail[d].idx) as d}
                                        <option value={d.id}>
                                            {d.lib}
                                        </option>
                                    {/each}
                                </select></td>
                                <!-- suite SI KO -->
                                <td><select disabled={readonly} bind:value="{data.detail[d].nexttaskid_fail}">
                                    {#each getElmActions(data.detail[d].idx) as d}
                                        <option value={d.id}>
                                            {d.lib}
                                        </option>
                                    {/each}
                                </select></td>

                                <td><a href="#+" on:click="{() => removeElm(d)}">-</a></td>
                            </tr>      
                            {/each} 
                            {/if}
            
                            <!-- btn new -->
                            {#if !readonly}
                            <tr>
                                <td colspan=5>
                                    <a href="#-" on:click="{appendElm}">+</a>
                                </td>
                            </tr>                          
                            {/if}
                        </tbody>
                    </table>
                    <!-- fin liste des tache -->

                    <div class="pure-control-group">
                        <span class="pure-form-message">Last start : {data.last_start}, Last stop : {data.last_stop}</span>    
                    </div>
                    <div class="pure-control-group">
                        <span class="pure-form-message">Last result : {data.last_result}, {data.last_msg}</span>    
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