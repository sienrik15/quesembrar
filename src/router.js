import Vue from 'vue'
import Router from 'vue-router'
import DefaultContainer from './components/DefaultContainer'
import Dashboard from './components/Dashboard'

Vue.use(Router);

export default new Router({
    //mode:'history',
    routes: [
        {
            path:"/",
            redirect: '/',
            name:'resultadoTest',
            component: DefaultContainer,
            children: [
                {
                    path: '/',
                    redirect:'/',
                    name: 'resultado',
                    component: {
                        render (c) { return c('router-view') }
                    },
                    children:[
                        {
                            path:'/',//':id',
                            name:'dashboard',
                            component: Dashboard,//Dashboard
                        },
                        {
                            path:'/productos',//':id',
                            name:'productos',
                            component: Dashboard,//Dashboard
                        }
                    ]
                }
            ]

        }
        // ,
        // {
        //     path: '/home',
        //     name: 'home',
        //     component: Home
        // },
        // {
        //     path: '/about',
        //     name: 'about',
        //     component: About
        // }
    ]
})