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
            footMsgClass = 'success';            
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
    <div class="header-medium">

        <div class="items">
            <h1 class="subhead">Login</h1>

            <aside class="pure-message message-{footMsgClass}">
                <p>{footMsg}</p>
            </aside>
            <form on:submit|preventDefault="{handleSubmit}" class="pure-form pure-form-stacked" id="authform">
                <fieldset>

                    <label for="login">Login</label>
                    <input id="login" type="text" bind:value="{user}" placeholder="Login" class="pure-input-1">

                    <label for="password">Password</label>
                    <input id="password" type="password" bind:value="{password}" placeholder="Password" class="pure-input-1">

                    <!--
                    <label for="remember" class="pure-checkbox">
                        <input id="remember" type="checkbox" value="1"> Remember me
                    </label>
                    -->

                    <button id="authbt" type="submit" class="pure-button button-success">Sign in</button>
                </fieldset>
            </form>
        </div>

        <div class="footer">
            <div class="pure-menu pure-menu-horizontal">
                <ul>
                    <!-- <li class="pure-menu-item"><a href="http://purecss.io/" class="pure-menu-link">PURE CSS</a></li> -->
                </ul>
            </div>
        </div>
    </div>    
</main>

<style>
</style>