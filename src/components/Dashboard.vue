<template>
    <div class="container is-fullhd">
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
                                    <!--<figure class="image is-4by3">
                                        <img src="https://bulma.io/images/placeholders/640x480.png">
                                    </figure>-->
                                </article>
                            </div>
                        </div>
                        <div class="tile is-parent">
                            <article class="tile is-child notification is-danger">
                                <p class="title">Grafica 4 </p>
                                <p class="subtitle">graficso y datos</p>
                                <div class="content">
                                    <!-- Content -->
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
                                    <!-- Content -->
                                </div>
                            </div>
                        </article>
                    </div>
                </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script>
    import Chart from 'chart.js';

    export default {
        name: "Dashboard",
        components:{

        },
        data:function() {
            return {
                newTodoText: '',
                visitCount: 0,
                hideCompletedTodos: false,
                todos: [],
                error: null
            };
        },
        mounted(){
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
        }
    }
</script>

<style lang="stylus" src="@/assets/styles/home.styl"></style>
