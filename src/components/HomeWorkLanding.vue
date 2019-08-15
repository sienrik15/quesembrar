<template>
    <div>
        <div style="border-bottom: solid 1px #d2d2d2; padding: 4px;width: 100%; display: inline-flex">
                <div style="text-align: left; width: 50%;display: inline-flex;">
                    <div style="max-width: 55px !important;padding: 4px;max-height: 55px !important;">
                        <img src="@/assets/images/logo-mente.png" alt="Vue-logo">
                    </div>
                    <span style="padding-top: 16px;padding-bottom: 9px;">Mente Creativa</span>
                </div>
                <div style="text-align: right;width: 50%;display: inline-block;position: relative;">
                    <a :href="msgWhatsappinfo" class="button is-primary is-rounded" style="background-color: #00d1b2!important;top: 21%;">Consultar</a>
                </div>
        </div>
        <div class="section-banner">
            <div class="title-main">
                Resolvemos tus tareas y trabajos.
            </div>
        </div>


        <div style="padding: 8px">

            <div style="font-size: 20px;padding: 20px 8px; padding-bottom: 5px; padding-top: 10px"> <strong> Te enseñamos a resolver tus tareas</strong> </div>
            <div class="columns is-mobile" style="margin: 0px">
                <div class="column" style="text-align: center;">
                    <div style="font-size: 18px; text-align: center"> <span style="color: #20d0c2;">Química</span> </div>
                    <img style="width: 80px"  src="@/assets/images/quimica.png" alt="quimica">
                </div>
                <div class="column" style="text-align: center;">
                    <div style="font-size: 18px; text-align: center"> <span style="color: #c01891;">Matemática</span> </div>
                    <img style="width: 80px" src="@/assets/images/matematicas.png" alt="mate">
                </div>
                <div class="column" style="text-align: center;">
                    <div style="font-size: 18px; text-align: center"> <span style="color: #14b4e5;">Física</span> </div>
                    <img style="width: 80px"  src="@/assets/images/fisica.png" alt="fisica">
                </div>
            </div>

            <div style="font-size: 20px;padding: 15px 8px; padding-top: 10px">
                <strong>¿ Como funciona ?</strong>
            </div>
            <div style="text-align: center">
                <div style="margin:10px 0px; width: 100%">
                    <div class="number">1</div>
                    <span style="margin-top: 14px;margin-left: 8px;">
                        Nos envias una foto de tu tarea
                    </span>
                </div>

                <div style="margin:10px 0px;width: 100%">
                    <span style="margin-top: 14px;margin-right: 8px;">
                        En cuestión de minutos lo resolvemos
                    </span>
                    <div class="number">2</div>
                </div>

                <div style="margin:10px 0px;width: 100%">
                    <div class="number">3</div>
                    <span style="margin-top: 14px;margin-left: 8px;">
                        Te enviamos un video explicativo
                    </span>
                </div>
            </div>


            <div style="font-size: 20px;padding: 20px 8px;padding-bottom: 4px"><strong>Elige tu plan más accesible</strong></div>

            <div style="padding-bottom: 18px; padding-left: 8px; display: inline-flex; width: 100%">
                <div style="padding-top: 4px;"><img style="width: 25px"  src="@/assets/images/whatsapp-log.png" alt="whatsapp"></div>
                <div style="font-size: 14px;margin: 6px"> <span>Todos las tareas las realizamos vía whatsapp </span></div>
            </div>
            <div class="scrolling-wrapper">
                <div class="examples-card" style="background: #FFEB3B;">
                    <div style="text-align: center">
                        <img style="width: 39px;" src="https://img.icons8.com/officel/80/000000/curriculum.png">
                    </div>
                    <div style="text-align: center;font-size: 18px">
                        <strong>Tarea Urgente</strong>
                    </div>
                    <div style="text-align: center;font-size: 18px">
                        <strong>S/. 8.00</strong>
                    </div>
                    <div style="padding-top: 15px">
                        <ul>
                            <li><strong style="font-size: 20px; font-weight: 900"> <f-icon icon="check" style="color: #fff"/> 3 Tareas</strong></li>
                            <li><strong> <f-icon icon="check" style="color: #fff"/> Video explicativo</strong></li>
                            <li><strong> <f-icon icon="check" style="color: #fff"/> Tareas de Física</strong></li>
                            <li><strong> <f-icon icon="check" style="color: #fff"/> Tareas de Matemática</strong> </li>
                            <li><strong> <f-icon icon="check" style="color: #fff"/> Tareas de Química</strong></li>
                        </ul>
                    </div>
                    <div style="text-align: center;padding: 10px; padding-top: 15px">
                        <a :href="msgWhatsapp1" class="button btn-plan is-warning is-rounded btn-price">Comprar</a>
                    </div>
                </div>
                <div class="examples-card" style="background: #7ae97c;">
                    <div style="text-align: center">
                        <img style="width: 39px;" src="https://img.icons8.com/dusk/64/000000/rocket.png">
                    </div>
                    <div style="text-align: center;font-size: 18px">
                        <strong>Plan Completo</strong>
                    </div>
                    <div style="text-align: center;font-size: 18px">
                        <strong>S/. 18.00</strong>
                    </div>
                    <div style="padding-top: 15px">
                        <ul>
                            <li><strong style="font-size: 20px; font-weight: 900"> <f-icon icon="check" style="color: #fff"/> 10 Tareas</strong></li>
                            <li><strong> <f-icon icon="check" style="color: #fff"/> Video explicativo</strong></li>
                            <li><strong> <f-icon icon="check" style="color: #fff"/> Tareas de Fisica</strong></li>
                            <li><strong> <f-icon icon="check" style="color: #fff"/> Tareas de Matematica</strong> </li>
                            <li><strong> <f-icon icon="check" style="color: #fff"/> Tareas de Quimica</strong></li>
                        </ul>
                    </div>
                    <div style="text-align: center; padding: 10px; padding-top: 15px">
                        <a :href="msgWhatsapp2" class="button btn-plan is-warning is-rounded btn-price">Comprar</a>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    export default {
        name: "HomeWorkLanding",
        data(){
            return{
                msgWhatsapp1 : 'https://api.whatsapp.com/send?phone=988531455&text=Hola menteCreativa, necesito ayuda para resolver mis tareas, quiero el plan de S/8.00',
                msgWhatsapp2 : 'https://api.whatsapp.com/send?phone=988531455&text=Hola menteCreativa, necesito ayuda para resolver mis tareas, quiero el plan de S/18.00',
                msgWhatsappinfo : 'https://api.whatsapp.com/send?phone=988531455',
            }
        }
    }
</script>

<style lang="stylus">

    .section-banner
        height: 214px;
        background: url('~@/assets/images/banner.png')
        background-repeat: no-repeat
        background-position: center top;
        background-size: 100% auto;
        .title-main
            padding: 27px;
            font-size: 32px;
            text-align: center;
            color: #fff;
            font-weight: 900;
        .btn-price
            background: rgb(252, 252, 252);
            font-size: 17px;
            font-weight: 500;
            margin-top: 30px;

    .scrolling-wrapper
        overflow-x: scroll;
        overflow-y: hidden;
        white-space: nowrap;
        margin-bottom 20px
        .examples-card
            display: inline-table;
            margin: 5px;
            margin-top: 3px;
        &::-webkit-scrollbar
            display: none;

    .examples-card
        width: 240px;
        //margin 3px
        height: 135px;
    .examples-card
        .text-example
            padding 0px

    .examples-card
        //width: 240px;
        margin 3px
        //height: 135px;
        position relative;
        padding: 6px;
        //border solid 1px #d5d5d5 //2FD565
        border-radius 10px;
        background #fff;
        box-shadow: 0 8px 20px rgba(139, 139, 139, 0.1);

    .btn-plan
        background #fff !important
        &:hover
            background #fff !important

    .number
        font-weight: 600;
        border: solid 3px #4fb1fe;
        border-radius: 30px;
        font-size: 22px;
        background: #fff;
        color: #4fb1fe;
        padding: 24px 8px;
        margin 0px



</style>