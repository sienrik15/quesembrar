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

                        <v-select class="v-select-custom" label="name" :filterable="false" :options="options" @input="onOptionSelected" v-model="valueOption" @search="onSearch">
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
    import  'chartjs-plugin-zoom';
    import moment from 'moment';

    moment.locale('es-do');
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
                        const colectionOptions = [];
                        snap.forEach(doc => {
                            colectionOptions.push(doc.data());
                        });
                        vm.options = colectionOptions;
                        loading(false);
                }).catch(err=>{
                    console.log(err)
                });

            }, 350),
            onOptionSelected(){
                console.log(this.valueOption);
                if (!this.valueOption) return
                let price_type_id = "dsE4vwVF1JyfWVOVLgYA";
                let market_id = "3BeNPYEum6Wvw1z2dFHw";
                let crops_id = this.valueOption.id;
                let db = this.$firebase.firestore();
                let pricesDB = db.collection('prices');
                pricesDB = pricesDB.where("price_type_id","==",price_type_id);
                pricesDB = pricesDB.where("market_id","==",market_id);
                pricesDB = pricesDB.where("crops_id","==",crops_id);
                pricesDB = pricesDB.orderBy('date').limit(500);
                pricesDB.get().then(snap => {
                    const prices_data = [];
                    const date_list = [];
                    snap.forEach(doc => {
                        prices_data.push(doc.data().price);
                        date_list.push(moment(doc.data().date.toDate()).format("YYYY-MM-DD"));
                    });
                    this.value_list = prices_data;
                    this.date_list = date_list;
                    console.log(date_list);
                    console.log(prices_data);

                    this.updateChart();
                }).catch(err=>{
                    console.log(err)
                });

            },
            updateChart(){
                let ctx = document.getElementById('myChart').getContext('2d');
                this.start_date = new Date(this.date_list[0]);
                this.end_date = new Date(this.date_list[this.date_list.length-1]);
                this.range_min = new Date(this.date_list[0]);
                this.range_min.setDate(this.range_min.getDate()-10);
                this.range_max = new Date(this.date_list[this.date_list.length-1]);
                this.range_max.setDate(this.range_max.getDate()+10);
                /* eslint-disable */
                let myChart = new Chart(ctx, {
                    type: 'line',
                    data: {

                        labels: this.date_list,
                        datasets: [
                            {
                                label:this.valueOption?this.valueOption.name_es:"",
                                fill: false,
                                backgroundColor: ['rgba(71, 183,132,.5)'],
                                data: this.value_list,
                                borderColor: ["#47b784"],
                                borderDash: [5, 5],
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        scales:{
                            yAxes: [{
                                type: 'linear',
                                ticks: {
                                    beginAtZero: true,
                                }
                            },
                            ]
                            /*xAxes: [{
                                distribution: 'linear',
                                type: "time",
                                time: {
                                    min: this.start_date.toDateString(),
                                    max: this.end_date.toDateString(),
                                    unit:'day',
                                    stepSize: "1",
                                },

                            }]*/,
                        },
                        pan: {
                            enabled: true,
                            mode: 'x',
                            rangeMin: {
                                x: this.range_min,
                            },
                            rangeMax: {
                                x: this.range_max,
                            },
                        },
                        zoom: {
                            enabled: true,
                            mode: 'x',
                            threshold: 10,
                            rangeMin: {
                                x: this.range_min,
                            },
                            rangeMax: {
                                x: this.range_max,
                            },
                        },
                    }
                });
            },
        },
        data:()=> {
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
                valueOption:"",
                date_list:["2019-08-09","2019-08-10","2019-08-11","2019-08-12","2019-08-13","2019-08-14"],
                value_list:[1000,2000,3000,2500,3000,5000],
                start_date : "",
                end_date : "",
                range_min : "",
                range_max : "",
        }
        },
        mounted(){
            window.addEventListener('resize', this.onResize);
            //this.updateChart()
            //let ctx = document.getElementById("myChart");
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
