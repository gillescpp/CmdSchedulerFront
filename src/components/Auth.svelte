<script>
    import page from 'page.js'
    import { onMount } from "svelte";
    import { Auth, ClearToken } from '../common/global'

	export let routeParams = {}
    let user = '';
    let password = '';
    let footMsg = '';
    let footMsgClass = '';

    onMount(async function() {
        ClearToken();
        //message fourni en param
        if ( routeParams && routeParams.Message != "" ) {
            footMsg = routeParams.Message;
            footMsgClass = 'info';            
        }
    });

    async function handleSubmit() {
        footMsg = '...';
        footMsgClass = '';

        var authbt = document.getElementById("authbt");
        authbt.disabled = true;
        await Auth(user, password)
            .then(() => {
                footMsg = ''
                page.redirect('/');
            }) 
            .catch(err => {
                footMsgClass = 'error';
                footMsg = err;
            });
        authbt.disabled = false;
	}

</script>

<main>
    <div class="content">
        <form on:submit|preventDefault="{handleSubmit}" class="pure-form pure-form-aligned" id="authform">
            <legend>Identification</legend>
            <fieldset>
                <div class="pure-control-group">
                    <label for="lib">Login</label>
                    <input type="text" id="login" bind:value="{user}" placeholder="login" autocomplete="off" />
                    <span class="pure-form-message-inline"></span>
                </div>
                <div class="pure-control-group">
                    <label for="size">Password</label>
                    <input type="password" id="password" bind:value="{password}" placeholder="password" autocomplete="off" />
                </div>
                <div class="pure-controls">
                    <button type="submit" class="pure-button pure-button-primary" id="authbt">Login</button>
                </div>
                <span class="pure-form-message {footMsgClass}">{footMsg}.</span>
            </fieldset>
        </form>
    </div>
</main>

<style>
</style>