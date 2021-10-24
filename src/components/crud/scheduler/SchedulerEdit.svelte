<script>
    import { onMount } from "svelte";
    import { NewModel } from './../../../common/model.js'
    import { ApiFetch, ApiPost } from './../../../common/global.js'  
    import page from 'page.js' 
    
	const apiEP = 'scheds';
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

        data.is_period = false;

        data.detail.forEach( (_, i) => {
            data.detail[i].interval = parseInt(data.detail[i].interval, 10); //forcer en int
            });

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
        data.detail.push(NewModel('SCHED_D'));
        data.detail = data.detail; //(pour forcer la reactivité svelte)
    }

    //suppression element liste des taches
    function removeElm(idx) {
        data.detail.splice(idx, 1);
        data.detail = data.detail; //(pour forcer la reactivité svelte)
    }

    //suppression element liste des taches
    function changeType(idx, interval) {
        let v = document.getElementById("dtype" + idx);
        if ( v && v.value == "I" ) {
            data.detail[idx].interval = 60;
        } else {
            data.detail[idx].interval = 0;
        }
        data.detail = data.detail; //(pour forcer la reactivité svelte)
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
                <label for="lib">Name</label>
                <input type="text" id="lib" readonly={readonly} bind:value="{data.lib}" placeholder="name" autocomplete="off" class="pure-control-group-long" />


                <!-- details planif -->
                <fieldset>
                    <h4>Detail</h4>
                    {#if data.detail}
                    {#each data.detail as _, d}
                    <div class="">
                        <hr>
                        <div class="pure-control-group">
                            <label for="dtype{d}">Type</label>
                            <select id="dtype{d}" on:change={()=>changeType(d)} disabled={readonly}>
                                <option value="I" selected={(data.detail[d].interval != 0)}>Interval</option>
                                <option value="F" selected={(data.detail[d].interval == 0)}>Fixed Hours</option>
                            </select>
                        </div>

                        {#if data.detail[d].interval != 0}
                        <!-- intervalle en minute -->
                        <div class="pure-control-group">
                            <label for="interval{d}">Interval (s)</label>
                            <input type="number" id="interval{d}" bind:value="{data.detail[d].interval}" min="1" max="86400" placeholder="intervalle" autocomplete="off" />
                        </div>
                        <div class="pure-control-group">
                            <label for="intervalhours{d}">Times slot</label>
                            <input type="text" id="intervalhours{d}" readonly={readonly} bind:value="{data.detail[d].intervalhours}" placeholder="08:00:05-12:00:00,..." autocomplete="off" />
                            <span class="pure-form-message">ex: 08:00:05-10:00:00,14:00:00-18:00:00</span>    
                        </div>
                        {:else}
                        <!-- heures -->
                        <div class="pure-control-group">
                            <label for="hours{d}" title="ex: 08:00:00,10:00:00">Hours</label>
                            <input type="text" id="hours{d}" readonly={readonly} bind:value="{data.detail[d].hours}" placeholder="08:00:00,10:00:00" autocomplete="off" />
                        </div>
                        {/if}

                        <div class="pure-control-group">
                            <label for="months{d}" title="ex: * or 111111111110...">Months</label>
                            <input type="text" id="months{d}" readonly={readonly} bind:value="{data.detail[d].months}" placeholder="* or 111111111110..." autocomplete="off" />
                        </div>

                        <div class="pure-control-group">
                            <label for="weekdays{d}" title="ex: * or 1111100">Weekdays</label>
                            <input type="text" id="weekdays{d}" readonly={readonly} bind:value="{data.detail[d].weekdays}" placeholder="* or 1111100" autocomplete="off" />
                        </div>
                        
                        <div class="pure-control-group">
                            <label for="monthdays{d}" title="ex: FIRST, LAST and/or 1110110(x31)">Monthdays</label>
                            <input type="text" id="monthdays{d}" readonly={readonly} bind:value="{data.detail[d].monthdays}" placeholder="FIRST, LAST and/or 1111111(...)100011..." autocomplete="off" />
                        </div>

                        <td><a href="#" on:click="{() => removeElm(d)}">remove</a></td>
                    </div>
                    {/each} 
                    <!-- btn new -->
                    {#if !readonly}
                    <tr>
                        <td colspan=5>
                            <a href="#+" on:click="{appendElm}">+</a>
                        </td>
                    </tr>                          
                    {/if}
                    {/if}
        
                    <!-- details planif -->
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