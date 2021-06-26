//compos pages
import Home from '../components/Home.svelte'
import QueueList from '../components/crud/queue/QueueList.svelte'  
import QueueEdit from '../components/crud/queue/QueueEdit.svelte'  
import Auth from '../components/Auth.svelte'
//import Advanced from '../components/Advanced.svelte'
//import Users from '../components/users/Users.svelte'  
import NotFound from '../components/NotFound.svelte'  

//def des pages
export const mainPages = [
    { 
        id: 1, name: 'Dashboard', 
        path: '/',
        routes: [
            {
                path: '',
                component: Home
            }
        ],
        visibleMnu: true,
        public: false 
    },
    { 
        id: 2, 
        name: 'Scheduler', 
        path: '/scheduler', 
        routes: [
            {
                path: '',
                component: null
            }
        ],
        visibleMnu: true,
        public: false
    },
    { 
        id: 3, 
        name: 'TaskFlows', 
        path: '/taskflow', 
        routes: [
            {
                path: '',
                component: null
            }
        ],
        visibleMnu: true,
        public: false
    },
    { 
        id: 4, 
        name: 'Tasks', 
        path: '/task', 
        routes: [
            {
                path: '',
                component: null
            }
        ],
        visibleMnu: true,
        public: false 
    },
    { 
        id: 5, 
        name: 'Users', 
        path: '/user', 
        routes: [
            {
                path: '',
                component: null
            }
        ],
        visibleMnu: true,
        public: false
    },
    { 
        id: 6, 
        name: 'Tags', 
        path: '/tag', 
        routes: [
            {
                path: '',
                component: null
            }
        ],
        visibleMnu: true,
        public: false
    },
    { 
        id: 7, 
        name: 'Queues', 
        path: '/queue', 
        routes: [
            {
                path: '',
                component: QueueList
            },
            {
                path: '/:id',
                component: QueueEdit
            }
        ],
        visibleMnu: true,
        public: false
    },
    { 
        id: 8, 
        name: 'Agents', 
        path: '/agent', 
        routes: [
            {
                path: '',
                component: null
            }
        ],
        visibleMnu: true,
        public: false
    },
    { 
        id: 9, 
        name: 'Setting', 
        path: '/setting', 
        routes: [
            {
                path: '',
                component: null
            }
        ],
        visibleMnu: true,
        public: false
    },
    { 
        id: 10, name: 'Authentification', 
        path: '/auth',
        routes: [
            {
                path: '',
                component: Auth
            }
        ],
        visibleMnu: false,
        public: true
    },
]

