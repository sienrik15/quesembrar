import Vue from 'vue'
import Router from 'vue-router'
import DefaultContainer from './components/DefaultContainer'
import Dashboard from './components/Dashboard'
import Home from './components/Home'
import HomeWorkLanding from './components/HomeWorkLanding'

Vue.use(Router);

export default new Router({
    mode:'history',
    routes: [
        {
            path:"/",
            //redirect: '/',
            name:'resultadoTest',
            component: DefaultContainer,
            children: [
                {
                    path: '/',
                    //redirect:'/sam',
                    name: 'resultado',
                    component: {
                        render (c) { return c('router-view') }
                    },
                    children:[
                        {
                            path:'/',//':id',
                            name:'home',
                            component: Home,//Dashboard
                        },
                        {
                            path:'/analisis-precios',//':id',
                            //redirect: '/mente-creativa',
                            name:'dashboard',
                            component: Dashboard,//Dashboard
                        },
                        {
                            path:'/mente-creativa',//':id',
                            name:'menteCreativa',
                            component: HomeWorkLanding,//Dashboard
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
