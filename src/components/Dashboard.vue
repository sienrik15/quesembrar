<template>

    <!-- :color-back="colors.colorBack"
                 :color-grid="colors.colorGrid"
                 :color-text="colors.colorText" -->
    <!--<trading-vue :data="chart" :width="this.width" :height="this.height">
    </trading-vue>-->

     <div class="container is-fullhd">
        <div class="notification">
            <section class="section box-search">
                    <div class="container">
                        <div class="title">
                           Que puedo sembrar
                        </div>
                        <h1 class="subtitle">
                            Analisis y Monitoreo de precios en cultivos para planificar que sembrar
                        </h1>
                    </div>
                    <div>
                        <div class="buttons">
                            <button class="button is-primary is-light">Primary</button>
                            <button class="button is-link is-light">Link</button>
                        </div>
                        <v-select class="v-select-custom" label="name" :filterable="false" :options="options" @change="onSelectOption" @search="onSearch" >
                            <template slot="no-options">
                                Escribe el nombre cultivo o producto
                            </template>
                            <template slot="option" slot-scope="option">
                                <div class="d-center">
                                    <img :src='option.image_url'/>
                                    {{ option.name_es }}
                                </div>
                            </template>
                            <template slot="selected-option" slot-scope="option">
                                <div class="selected d-center">
                                    <img :src='option.image_url'/>
                                    {{ option.name_es }}
                                </div>
                            </template>
                        </v-select>

                    </div>


            </section>
            <!--<section class="section">
                <div class="container">
                    <div class="tile is-ancestor">
                    <div class="tile is-vertical is-8">
                        <div class="tile">
                            <div class="tile is-parent is-vertical">
                                <article class="tile is-child notification is-primary">
                                    <p class="title">Grafica 1</p>
                                    <p class="subtitle">graficos</p>
                                </article>
                                <article class="tile is-child notification is-warning">
                                    <p class="title">Grafica 2</p>
                                    <p class="subtitle">datos</p>
                                </article>
                            </div>
                            <div class="tile is-parent">
                                <article class="tile is-child notification is-info grafico-003">
                                    <p class="title">Grafica 3 </p>
                                    <p class="subtitle">graficos</p>
                                    <canvas id="myChart" width="400" height="400"></canvas>

                                </article>
                            </div>
                        </div>
                        <div class="tile is-parent">
                            <article class="tile is-child notification is-danger">
                                <p class="title">Grafica 4 </p>
                                <p class="subtitle">graficso y datos</p>
                                <div class="content">


                                </div>
                            </article>
                        </div>
                    </div>
                    <div class="tile is-parent">
                        <article class="tile is-child notification is-success">
                            <div class="content">
                                <p class="title">Tall tile</p>
                                <p class="subtitle">With even more content</p>
                                <div class="content">


                                </div>
                            </div>
                        </article>
                    </div>
                </div>
                </div>
            </section>  -->
            <section class="section">
                <div class="container">
                    <canvas id="myChart"></canvas>
                </div>
            </section>
        </div>
    </div>


</template>

<script>
    import Chart from 'chart.js';
    import TradingVue from 'trading-vue-js'
    import Data from '../data/data.json'
    import _ from 'lodash'

    export default {
        name: "Dashboard",
        components:{
            TradingVue
        },
        methods: {
            onResize(event) {
                this.width = window.innerWidth;
                this.height = window.innerHeight
            },
            onSearch(search, loading) {
                loading(true);
                this.search(loading, search, this);
            },
            search: _.debounce((loading, search, vm) => {
                if (search.length <= 0){ return loading(false); }
                let db = vm.$firebase.firestore();
                db.collection('agricultural_crops').orderBy('name_es')
                    .startAt(search).endAt(search+'\uf8ff').get().then(snap => {
                    const pdCollection = [];
                    snap.forEach(doc => {
                        console.log(doc.data());
                        pdCollection.push(doc.data());
                    });
                    vm.options = pdCollection;
                    console.log(vm.options);
                    loading(false);

                }).catch(err=>{
                    console.log(err)
                });

            }, 350),
            onSelectOption($event){
                console.log("response-------")
                console.log($event)
            }
        },
        data:function() {
            return {
                newTodoText: '',
                visitCount: 0,
                hideCompletedTodos: false,
                todos: [],
                error: null,
                chart: Data,
                width: window.innerWidth,
                height: window.innerHeight,
                colors: {
                    colorBack: '#fff',
                    colorGrid: '#eee',
                    colorText: '#333',
                },
                options:[],
                valueSelect:''

        };
        },
        mounted(){
            window.addEventListener('resize', this.onResize);
            //let ctx = document.getElementById("myChart");
            let ctx = document.getElementById('myChart').getContext('2d');
            /* eslint-disable */
            let myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['day1', 'day2', 'day3', 'day4', 'day5', 'day6', 'day7', 'day8','day1', 'day2', 'day3', 'day4', 'day5', 'day6', 'day7', 'day8','day1', 'day2', 'day3', 'day4', 'day5', 'day6', 'day7', 'day8','day1', 'day2', 'day3', 'day4', 'day5', 'day6', 'day7', 'day8'],
                    datasets: [{
                            label: 'Filled',
                            backgroundColor: ['rgba(27,255,146,0.5)'],
                            borderColor: ["#b7b54b"],
                            data: [
                                120, 12, 56, 98, 130, 80, 55
                            ],
                            fill: true,
                        }, {
                        label: 'Unfilled',
                        fill: false,
                        backgroundColor: "#12cf5f",
                        borderColor: "#24ca57",//window.chartColors.blue,
                        data: [20, 40, 20, 70, 23, 34, 90],
                    }, {
                        label: 'Dashed',
                        fill: false,
                        backgroundColor: ['rgba(71, 183,132,.5)'],
                        borderColor: ["#47b784"],
                        borderDash: [5, 5],
                        data: [20, 15, 24, 60, 45, 60, 100],
                    }]
                },
                options: {
                    responsive: true,
                    title: {
                        display: true,
                        text: 'Chart.js Line Chart'
                    },
                    tooltips: {
                        mode: 'index',
                        intersect: false,
                    },
                    hover: {
                        mode: 'nearest',
                        intersect: true
                    },
                    scales: {
                        x: {
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: 'Month'
                            }
                        },
                        y: {
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: 'Value'
                            }
                        }
                    }
                }
            });
        },
        beforeDestroy() {
            window.removeEventListener('resize', this.onResize)
        },

    }
</script>

<style lang="stylus">

    .box-search
        padding-bottom: 10px !important
        padding-top: 30px !important

    .v-select-custom
        img
            height: auto;
            max-width: 2.5rem;
            margin-right: 1rem;
        .d-center
            display: flex;
            align-items: center;


        .selected
            img
                width: auto;
                max-height: 23px;
                margin-right: 0.5rem;


        .v-select
            .dropdown
                li
                    border-bottom: 1px solid rgba(112, 128, 144, 0.1);


        .v-select
            .dropdown
                li:last-child
                    border-bottom: none;


        .v-select
            .dropdown
                li
                    a
                        padding: 10px 20px;
                        width: 100%;
                        font-size: 1.25em;
                        color: #3c3c3c;


        .v-select
            .dropdown-menu
                .active > a
                    color: #fff


</style>
