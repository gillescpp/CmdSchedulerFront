<script>
    import { Auth, IsAuth } from '../common/global'
    import page from 'page.js'
	//export let routeParams = {}
    let user = '';
    let password = '';
    let errMsg = '';
    let errMsgClass = '';

    async function handleSubmit() {
        errMsg = '...';
        errMsgClass = '';

        var authbt = document.getElementById("authbt");
        authbt.disabled = true;
        await Auth(user, password)
            .then(() => {
                errMsg = ''
                page.redirect('/');
            }) 
            .catch(err => {
                errMsgClass = 'error';
                errMsg = err;
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
                <span class="pure-form-message {errMsgClass}">{errMsg}.</span>
            </fieldset>
        </form>
    </div>
</main>

<style>
</style>