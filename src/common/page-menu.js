//compos pages
import Home from '../components/Home.svelte'
import Auth from '../components/Auth.svelte'
import QueueList from '../components/crud/queue/QueueList.svelte'  
import QueueEdit from '../components/crud/queue/QueueEdit.svelte'  
import AgentList from '../components/crud/agent/AgentList.svelte'  
import AgentEdit from '../components/crud/agent/AgentEdit.svelte'  
import SchedulerList from '../components/crud/scheduler/SchedulerList.svelte'  
import SchedulerEdit from '../components/crud/scheduler/SchedulerEdit.svelte'  
import SettingList from '../components/crud/setting/SettingList.svelte'  
import SettingEdit from '../components/crud/setting/SettingEdit.svelte'  
import TagList from '../components/crud/tag/TagList.svelte'  
import TagEdit from '../components/crud/tag/TagEdit.svelte'  
import TaskList from '../components/crud/task/TaskList.svelte'  
import TaskEdit from '../components/crud/task/TaskEdit.svelte'  
import TaskflowList from '../components/crud/taskflow/TaskflowList.svelte'  
import TaskflowEdit from '../components/crud/taskflow/TaskflowEdit.svelte'  
import UserList from '../components/crud/user/UserList.svelte'  
import UserEdit from '../components/crud/user/UserEdit.svelte'  

//def des pages
export const mainPages = [
    { 
        id: 1, 
        name: 'Dashboard', 
        path: '',
        right: '',
        entity: '',
        apiEP: '',
        routes: [
            {
                path: '',
                component: Home
            }
        ],
        visibleMnu: true,
    },
    { 
        id: 2, 
        name: 'Scheduler', 
        path: 'scheduler', 
        right: 'SCHED',
        entity: 'SCHED',
        apiEP: 'scheds',
        routes: [
            {
                path: '',
                component: SchedulerList
            },
            {
                path: ':id',
                component: SchedulerEdit
            }
        ],
        visibleMnu: true,
    },
    { 
        id: 3, 
        name: 'TaskFlows', 
        path: 'taskflow', 
        right: 'TASKFLOW',
        entity: 'TASKFLOW',
        apiEP: 'taskflows',
        routes: [
            {
                path: '',
                component: TaskflowList
            },
            {
                path: ':id',
                component: TaskflowEdit
            }
        ],
        visibleMnu: true,
    },
    { 
        id: 4, 
        name: 'Tasks', 
        path: 'task', 
        right: 'TASK',
        entity: 'TASK',
        apiEP: 'tasks',
        routes: [
            {
                path: '',
                component: TaskList
            },
            {
                path: ':id',
                component: TaskEdit
            }
        ],
        visibleMnu: true,
    },
    { 
        id: 5, 
        name: 'Users', 
        path: 'user', 
        right: 'USER',
        entity: 'USER',
        apiEP: 'users',
        routes: [
            {
                path: '',
                component: UserList
            },
            {
                path: ':id',
                component: UserEdit
            }
        ],
        visibleMnu: true,
    },
    { 
        id: 6, 
        name: 'Tags', 
        path: 'tag', 
        right: 'TAGS',
        entity: 'TAGS',
        apiEP: 'tags',
        routes: [
            {
                path: '',
                component: TagList
            },
            {
                path: ':id',
                component: TagEdit
            }
        ],
        visibleMnu: true,
    },
    { 
        id: 7, 
        name: 'Queues', 
        path: 'queue', 
        right: 'QUEUE',
        entity: 'QUEUE',
        apiEP: 'queues',
        routes: [
            {
                path: '',
                component: QueueList
            },
            {
                path: ':id',
                component: QueueEdit
            }
        ],
        visibleMnu: true,
    },
    { 
        id: 8, 
        name: 'Agents', 
        path: 'agent', 
        right: 'AGENT',
        entity: 'AGENT',
        apiEP: 'agents',
        routes: [
            {
                path: '',
                component: AgentList
            },
            {
                path: ':id',
                component: AgentEdit
            }
        ],
        visibleMnu: true,
    },
    { 
        id: 9, 
        name: 'Setting', 
        path: 'setting', 
        right: 'CONFIG',
        entity: 'CONFIG',
        apiEP: 'cfgs',
        routes: [
            {
                path: '',
                component: SettingList
            },
            {
                path: ':id',
                component: SettingEdit
            }
        ],
        visibleMnu: true,
    },
    { 
        id: 10, name: 'Authentification', 
        path: 'auth',
        right: '',
        entity: '',
        apiEP: 'auth',
        routes: [
            {
                path: '',
                component: Auth
            }
        ],
        visibleMnu: false,
    },
]

