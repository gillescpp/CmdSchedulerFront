<script>
    import { onMount } from "svelte";
    import { ApiFetch } from './../../../common/global.js'   

	export const routeParams = {} //nu
    let readonly = true;
    let page = 1;
    let data = {};
    let dataLst = [];

    //fetch info
    onMount(async function() {
        setPage(1)
    });

    //changement de page
    function setPage(p) {
        page = p;
        let paging = '';
        if (page > 1) {
            paging = '?page='+page;
        }
        ApiFetch('queues'+paging, "GET")
        .then((json) => {
            data = json
            dataLst = data.data //(pas directement vu comme un tableau par svelte)
        }) 
        .catch(err => {
            dataLst = [];
            alert(err)
        });
    }
    
</script>

<main>
    <!-- Mode liste -->
    <table class="pure-table">
    <caption></caption>
    <thead>
        <tr>
            <th>#</th>
            <th>Name</th>
            <th>Size</th>
            <th>Timeout</th>
        </tr>
    </thead>
    <tbody>
        {#each dataLst as item}
        <tr>
            <td><a href={'queue/'+item.id}>{item.id}</a></td>
            <td>{item.lib}</td>
            <td>{item.size}</td>
            <td>{item.timeout}</td>         
        </tr>      
        {/each} 
    </tbody>
    <tfoot>
        <td colspan=4>
            Total : {data.totalRecord}, pages :
            <!-- pagination -->
            <div class="pagination">
                {#each Array(data.totalPage) as _, p}
                <a href={'#'} on:click|preventDefault={() => setPage(p+1)}>{p+1}</a>
                {/each}
            </div>   
        </td>
    </tfoot>
    </table>



    <!-- new -->
    <a href="queue/new" class="pure-button pure-button-primary">New</a>
</main>

<style>
.pagination {
  display: inline-block;
}

</style>