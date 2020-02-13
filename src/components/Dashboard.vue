<template>

    <!-- :color-back="colors.colorBack"
                 :color-grid="colors.colorGrid"
                 :color-text="colors.colorText" -->
    <trading-vue :data="chart" :width="this.width" :height="this.height">
    </trading-vue>
    <!-- <div class="container is-fullhd">
        <div class="notification">
            <section class="section">
                    <div class="container">
                        <div class="title">
                           Que puedo sembrar
                        </div>
                        <h1 class="subtitle">
                            Analisis y Monitoreo de precios en cultivos para planificar que sembrar
                        </h1>
                    </div>
            </section>
            <section class="section">
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
            </section>
            <section class="section">
                <div class="container">

                </div>
            </section>
        </div>
    </div> -->

</template>

<script>
    import Chart from 'chart.js';
    import TradingVue from 'trading-vue-js'
    import Data from '../data/data.json'


    export default {
        name: "Dashboard",
        components:{
            TradingVue
        },
        methods: {
            onResize(event) {
                this.width = window.innerWidth;
                this.height = window.innerHeight
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
                }
            };
        },
        mounted(){
            window.addEventListener('resize', this.onResize)
            var ctx = document.getElementById("myChart");
            /* eslint-disable */
            var myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
                    datasets: [{
                        label: '# of Votes',
                        data: [12, 19, 3, 5, 2, 3],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255,99,132,1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero:true
                            }
                        }]
                    }
                }
            });
        },
        beforeDestroy() {
            window.removeEventListener('resize', this.onResize)
        },
    }
</script>

<style lang="stylus" src="@/assets/styles/home.styl"></style>
