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

                        <v-select class="v-select-custom" label="name" :filterable="false" :options="optionCrops" @input="onOptionSelected" v-model="valueOption" @search="onSearch">
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
                <div class="container" >
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
                        vm.optionCrops = colectionOptions;
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
                pricesDB = pricesDB.where("date",">=",moment("2019-12-01").toDate());
                pricesDB = pricesDB.where("date","<=",moment().toDate());
                pricesDB = pricesDB.orderBy('date');//.limit(365);
                pricesDB.get().then(snap => {
                    const prices_data = [];
                    const date_list = [];
                    snap.forEach(doc => {
                        prices_data.push(doc.data().price);
                        date_list.push(doc.data().date.toDate());
                    });
                    this.value_list = prices_data;
                    this.date_list = date_list;
                    console.log(date_list);
                    console.log(prices_data);
                    this.updateChartConf();
                }).catch(err=>{
                    console.log(err)
                });

            },
            initConfigChart(){
                this.start_date = moment(this.date_list[0]).format(this.timeFormat);
                this.end_date = moment(this.date_list[this.date_list.length-1]).format(this.timeFormat);
                console.log("end-date");
                console.log(this.end_date);
                //console.log(moment().clone().add(1, 'd').toDate());
                this.range_min = moment(this.date_list[0],this.timeFormat);
                this.range_min = moment(this.range_min.toDate()-10).format(this.timeFormat);
                this.range_max =  moment(this.date_list[this.date_list.length-1],this.timeFormat);
                this.range_max = moment(this.range_max.toDate()+10).format(this.timeFormat);
            },
            updateChartConf(){
                this.timeFormat = "MM/DD/YYYY HH:mm";
                this.date_list = this.date_list.map(vl=>{
                    vl = moment(vl).format(this.timeFormat);
                   return vl
                });
                this.initConfigChart();
                let dragOptions = {
                    animationDuration: 1000
                };


                this.startChart.data = {
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
                };
                this.startChart.options = {
                    responsive: true,
                    title: {
                        display: true,
                        text: "Precios de productos"
                    },
                    scales:{
                        yAxes: [{
                            type: 'linear',
                            ticks: {
                                beginAtZero: true,
                            },
                            scaleLabel: {
                                display: true,
                                labelString: "Precio"
                            }
                        },
                        ],
                        xAxes: [{
                            distribution: 'linear',
                            type: "time",
                            time: {
                                parser: this.timeFormat,
                                //round: 'll',
                                tooltipFormat: "ll",//"ll HH:mm",
                                min: this.start_date,
                                max: this.end_date,
                                minUnit:'day',
                                displayFormats: {
                                    'day': 'MMMM-Do YY' //'ll'
                                },
                                //unit:'day',
                                //stepSize: "1",
                            },
                            scaleLabel: {
                                display: true,
                                labelString: "Date"
                            },
                            ticks: {
                                maxRotation: 0,
                                beginAtZero: true,
                            }
                        }],
                    },
                    pan: {
                        enabled: true,
                        mode: "xy",
                        speed: 10,
                        threshold: 10
                    },
                    zoom: {
                        enabled: true,
                        drag: false,
                        mode: "xy",
                        limits: {
                            max: 10,
                            min: 0.5
                        }
                    }
                    /*pan: {
                        enabled: true,
                        mode: 'x',
                        rangeMin: {
                            x: this.range_min,
                        },
                        rangeMax: {
                            x: this.range_max,
                        },
                        speed: 10,
                        threshold: 10
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
                        speed: 10,
                        sensitivity:0.001,
                        drag: false
                    },*/
                }

                /*this.startChart.data = {
                    labels: [this.newDate(0), this.newDate(1), this.newDate(2), this.newDate(3), this.newDate(4), this.newDate(5), this.newDate(6)], // Date Objects
                    datasets: [{
                        label: 'My First dataset',
                        data: [this.randomScalingFactor(), this.randomScalingFactor(), this.randomScalingFactor(), this.randomScalingFactor(), this.randomScalingFactor(), this.randomScalingFactor(), this.randomScalingFactor()],
                        fill: false,
                        borderDash: [5, 5],
                    }, {
                        label: 'My Second dataset',
                        data: [this.randomScalingFactor(), this.randomScalingFactor(), this.randomScalingFactor(), this.randomScalingFactor(), this.randomScalingFactor(), this.randomScalingFactor(), this.randomScalingFactor()],
                    }, {
                        label: 'Dataset with point data',
                        data: [{
                            x: this.newDateString(0),
                            y: this.randomScalingFactor()
                        }, {
                            x: this.newDateString(5),
                            y: this.randomScalingFactor()
                        }, {
                            x: this.newDateString(7),
                            y: this.randomScalingFactor()
                        }, {
                            x: this.newDateString(15),
                            y: this.randomScalingFactor()
                        }],
                        fill: false
                    }]
                };*/
                /*this.startChart.options = {
                    responsive: true,
                    title: {
                        display: true,
                        text: "Chart.js Time Scale"
                    },
                    scales: {
                        xAxes: [
                            {
                                distribution: 'linear',
                                type: "time",
                                time: {
                                    format: this.timeFormat,
                                    // round: 'day'
                                    tooltipFormat: "ll HH:mm",
                                    min: this.newDate(0),
                                    max: this.newDate(6)
                                },
                                scaleLabel: {
                                    display: true,
                                    labelString: "Date"
                                },
                                ticks: {
                                    maxRotation: 0
                                }
                            }
                        ],
                        yAxes: [
                            {
                                scaleLabel: {
                                    display: true,
                                    labelString: "value"
                                }
                            }
                        ]
                    },
                    pan: {
                        enabled: true,
                        mode: "xy",
                        speed: 10,
                        threshold: 10
                    },
                    zoom: {
                        enabled: true,
                        drag: false,
                        mode: "xy",
                        limits: {
                            max: 10,
                            min: 0.5
                        }
                    }

                };*/

                /*this.startChart.data.datasets.forEach((dataset)=> {
                    dataset.borderColor = this.randomColor(0.4);
                    dataset.backgroundColor = this.randomColor(0.5);
                    dataset.pointBorderColor = this.randomColor(0.7);
                    dataset.pointBackgroundColor = this.randomColor(0.5);
                    dataset.pointBorderWidth = 1;
                });*/

                this.startChart.update();
            },
            randomScalingFactor() {
                return Math.round(Math.random() * 100 * (Math.random() > 0.5 ? -1 : 1));
            },

            randomColorFactor() {
                return Math.round(Math.random() * 255);
            },

            randomColor(opacity) {
                return 'rgba(' + this.randomColorFactor() + ',' + this.randomColorFactor() + ',' + this.randomColorFactor() + ',' + (opacity || '.3') + ')';
            },

            newDate(days) {
                return moment().add(days, 'd').toDate();
            },

            newDateString(days) {
                return moment().add(days, 'd').format(this.timeFormat);
            }
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
                optionCrops:[],
                valueOption:"",
                date_list:["2019-08-09","2019-08-10","2019-08-11","2019-08-12","2019-08-13","2019-08-14"],
                value_list:[1000,2000,3000,2500,3000,5000],
                start_date : "",
                end_date : "",
                range_min : "",
                range_max : "",
                startChart:null,
                timeFormat:"",
            }
        },
        mounted(){
            window.addEventListener('resize', this.onResize);
            //let ctx = document.getElementById("myChart");
            let ctx = document.getElementById('myChart').getContext('2d');
            /* eslint-disable */
            this.startChart = new Chart(ctx, {
                type: "line",
                data: {},
                options: {}
            });
            this.updateChartConf();
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

    canvas
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;


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
