//compos pages
import Home from '../components/Home.svelte'
//import Advanced from '../components/Advanced.svelte'
//import Users from '../components/users/Users.svelte'  
import NotFound from '../components/NotFound.svelte'  

//def des pages
export const mainPages = [
    { name: 'Home', menuUrl: '/', urlPath: '/',   component: Home   },
    { name: 'Advanced', menuUrl: '/advanced', urlPath: '/advanced',   component: NotFound   },
    { name: 'Users', menuUrl: '/users', urlPath: '/users/:id',   component: NotFound   }
]
    
