<template>
    <div class="container is-fullhd container-home">
        <div class="notification">

            <nav class="navbar header-navigation" role="navigation" aria-label="main navigation">
                <div class="navbar-brand">
                    <a class="navbar-item" href="https://bulma.io">
                        <!--<img src="https://bulma.io/images/bulma-logo.png" width="112" height="28">-->
                        <img src="@/assets/images/iso-logo.png" >
                    </a>

                    <a role="button" class="navbar-burger burger" v-on:click="showNav = !showNav" v-bind:class="{ 'is-active' : showNav }">
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                    </a>
                </div>

                <div class="navbar-menu" v-bind:class="{ 'is-active' : showNav }">
                    <div class="navbar-start">
                        <a class="navbar-item">
                            Inicio
                        </a>

                        <a class="navbar-item">
                            Historial de precios
                        </a>

                        <!--<div class="navbar-item has-dropdown is-hoverable">
                            <a class="navbar-link">
                                More
                            </a>

                            <div class="navbar-dropdown">
                                <a class="navbar-item">
                                    About
                                </a>
                                <a class="navbar-item">
                                    Jobs
                                </a>
                                <a class="navbar-item">
                                    Contact
                                </a>
                                <hr class="navbar-divider">
                                <a class="navbar-item">
                                    Report an issue
                                </a>
                            </div>
                        </div>-->
                    </div>

                    <div class="navbar-end">
                        <div class="navbar-item">
                            <div class="buttons">
                                <a class="button is-rounded is-primary">
                                    <strong>Registrarse</strong>
                                </a>
                                <a class="button is-rounded is-light">
                                    Iniciar sesión
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <section class="hero bg-img bg-home">
                <div class="hero-body banner-body">
                    <div class="container">

                        <div class="search-container">
                            <div class="title-search">
                                <strong> Productos organicos saludables </strong>
                            </div>

                            <div>

                                <multiselect v-model="selectOption"
                                             style="height: 40px !important; position: relative"
                                             :options="optionCrops"
                                             :show-labels="false"
                                             @input="searchCrops"
                                             :option-height="60"
                                             :multiple = "false"
                                             :searchable="true"
                                             :close-on-select="true"
                                             placeholder="Escribe aquí"
                                             label="name_es"
                                             track-by="name_es">
                                    <span slot="caret" slot-scope="{ toggle }" style="position: absolute;right: 10px;padding: 10px" @mousedown.prevent.stop="toggle">
                                        <f-icon icon="search" style="color: #cecece;"/>
                                    </span>

                                    <template slot="singleLabel" slot-scope="props">
                                        <img style="width: 38px; padding-right: 2px" class="option__image" :src="props.option.icon_url ? props.option.icon_url:getImgUrl('generic-icon.png')">
                                        <span class="option__title">{{ props.option.name_es }}</span>
                                    </template>


                                    <template slot="option" slot-scope="props" style="display: inline-flex;align-items: center;">
                                        <img style="width: 38px;padding-right: 2px" class="option__image" :src="props.option.icon_url ? props.option.icon_url:getImgUrl('generic-icon.png')">
                                        <span class="option__title">{{ props.option.name_es }}</span>
                                    </template>


                                </multiselect>


                                <!--<div class="button is-rounded btn-search is-primary">
                                    <strong>Buscar</strong>
                                </div>-->
                            </div>

                            <div class="sub-title">
                                <div> Verduras y Frutas </div>
                            </div>

                        </div>

                        <!--<h1 class="title">
                            Primary title
                        </h1>
                        <h2 class="subtitle">
                            Primary subtitle
                        </h2>-->
                    </div>
                </div>
            </section>

            <div style="display: flex; justify-content: center;background: #fff;padding: 10px;"><!--style="display: inline-flex;"-->

                <div v-for="item in topSearches" style="text-align: center; position: relative; width: 82px;height: 74px;" :key="item.id" @click="onClickProduct(item)">
                    <div class="img-circle">
                        <img :src="item.icon_url" alt="#">
                    </div>
                    <div style="font-size: 10px; width: 100%; bottom: -5px; position: absolute;">
                        <div>{{item.name_es}}</div>
                        <strong :style="{color: item.isUp?'#3dcb43':'#ff4c4c'}" >S/ {{item.price}}</strong>
                        <f-icon v-if="item.isUp" icon="long-arrow-alt-up" style="color: #3dcb43;"/>
                        <f-icon v-else icon="long-arrow-alt-down" style="color: #ff4c4c;"/>
                    </div>
                </div>


            </div>

            <!--<section class="section section-style">
                <div class="container">

                    <div class="columns is-mobile is-multiline is-centered colums-container">
                        <div class="column is-half-mobile is-two-fifths-desktop" style="padding: 0px !important;">
                            CATEGORIAS
                        </div>
                        <div class="column is-half-mobile is-two-fifths-desktop" style="padding: 0px !important;font-size: 12px; text-align: right">
                            Ver más ->
                        </div>
                    </div>

                    <div class="columns is-mobile is-multiline is-centered" style="margin: 0px;padding: 1px 8px 1px 8px;">

                            <div v-for="type in category_card" class="column is-narrow is-half-mobile pd-5" :key="type.color">
                                <div class="card-category" :style="{'border-color':type.color}">
                                    <div class="img-card">
                                        <img :src="getImgUrl(type.img)" alt="#">
                                    </div>
                                    <div class="title-card">
                                        {{type.name}}
                                    </div>
                                </div>
                            </div>

                    </div>

                </div>
            </section>-->

            <div class="section section-style">

                <div class="container">

                    <div class="columns is-mobile is-desktop is-multiline is-centered colums-container">
                        <div class="column is-half-mobile is-two-fifths-desktop" style="padding: 0px !important;">
                            PRECIOS
                        </div>
                        <div class="column is-half-mobile is-two-fifths-desktop" style="padding: 0px !important;font-size: 12px; text-align: right">
                            Ver más ->
                        </div>
                    </div>
                    <div class="columns is-mobile is-desktop is-multiline is-centered colums-container">
                        <div v-for="item in productList" class="column pdtb-1 is-narrow is-one-third-mobile is-one-fifth-desktop" :key="item.id" @click="onClickProduct(item)">
                            <div class="card card-border">
                                <div class="card-image">
                                    <figure class="image is-4by3">
                                        <img class="img-border" :src="item.image_url?item.image_url:getImgUrl('generic-icon.png')" alt="Placeholder image">
                                    </figure>
                                </div>
                                <div class="card-content pd-1">
                                    <div class="content">
                                        <div class="title-card">
                                            <strong>{{item.name_es}}</strong>
                                        </div>
                                        <div class="subtitle-cart">
                                            <div class="date">
                                                <span>{{getDate(item.date)}}</span>
                                            </div>

                                            <div class="price-title">
                                                <div class="price" :style="{color: item.isUp?'#3dcb43':'#ff4c4c'}">
                                                      <span>
                                                          {{item.price}}
                                                          <f-icon v-if="item.isUp" icon="long-arrow-alt-up" style="color: #3dcb43;"/>
                                                          <f-icon v-else icon="long-arrow-alt-down" style="color: #ff4c4c;"/>
                                                      </span>

                                                </div>
                                                <div class="many">x 1Kg</div>
                                            </div>

                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
    import moment from 'moment';
    import Multiselect from 'vue-multiselect'

    export default {
        name: "Home",
        components:{
            Multiselect
        },
        data:()=> {
            return {
                showNav: false,
                category_card:[
                    {name:"Frutos secos", img:"frutos-secos.png", color:"#C4E99A"},
                    {name:"Ortalizas", img:"hortalizas.png",color:"#F9C569"},
                    {name:"Ortalizas", img:"hortalizas.png",color:"#F8837C"},
                    {name:"Frutos secos", img:"frutos-secos.png",color:"#FDDE34"},
                ],
                topSearches:[],
                storageIconRef:null,
                storageImgRef:null,
                productList:[],
                selectedCountries: [],
                selectOption:null,
                optionCrops: [
                    {
                        name_es:"",
                        icon_url:""
                    }
                ],
                isLoading: false
            }
        },
        methods:{
            customLabel ({ name_es}) {
                return name_es//`${name_es} – ${icon_url}`
            },
            getImgUrl(str) {
                let images = require.context('@/assets/images/', false, /\.png$/)
                return images('./' + str)
            },
            downloadIcon(img_name){
                if (!img_name || (img_name && img_name==="")){
                    return "";
                }
                return this.storageIconRef.child(img_name).getDownloadURL().then((url) => {
                    return url
                }).catch((error)=> {
                    console.log(error.code);
                    return ""
                });
            },
            downloadImg(img_name){
                if (!img_name || (img_name && img_name==="")){
                    return "";
                }
                return this.storageImgRef.child(img_name).getDownloadURL().then((url) => {
                    return url
                }).catch((error)=> {
                    console.log(error.code);
                    return ""
                });
            },
            isPricesUp(prices){
                let param = {
                  price:"",
                  isUp:false,
                  date:""
                };
                let priceList = [];
                prices.forEach(vl =>{
                    priceList.push({
                        price:vl.data().price,
                        date:vl.data().date})
                });

                param.isUp = priceList[0].price >= priceList[1].price;
                param.price = priceList[0].price;
                param.date = priceList[0].date;

                return param
            },
            getDate(date){
                return moment(date.toDate()).format("DD MMM YY")
            },
            getPricesTop(param){
                let mParam = {
                    limit:1,
                    isTop:false
                };
                mParam = param;
                let db = this.$firebase.firestore();
                let query = {};
                if (mParam.isTop){
                    query = db.collection("agricultural_crops").orderBy("searches","desc")
                } else {
                    if (mParam.id){
                        query = db.collection("agricultural_crops").where("id", "==",mParam.id)
                    } else {
                        query = db.collection("agricultural_crops").where("state", "==",1)
                    }
                }

                query.limit(mParam.limit).get().then(snap => {
                    const colectionOptions = [];
                    snap.forEach(async doc => {

                        let pricesDB = await db.collection('prices');
                        pricesDB = pricesDB.where("price_type_id","==","dsE4vwVF1JyfWVOVLgYA");
                        pricesDB = pricesDB.where("market_id","==","3BeNPYEum6Wvw1z2dFHw");
                        pricesDB = pricesDB.where("crops_id","==",doc.data().id);
                        pricesDB = pricesDB.orderBy('date','desc').limit(2);
                        await pricesDB.get().then(async docPrice => {
                            let data = {};
                            data.icon_url = await this.downloadIcon(doc.data().icon_url);
                            data.name_es = doc.data().name_es;
                            data.id = doc.data().id;
                            data.image_url = await this.downloadImg(doc.data().image_url);
                            data.searches = doc.data().searches;
                            let stateUp = this.isPricesUp(docPrice);
                            data.price = stateUp.price;
                            data.isUp = stateUp.isUp;
                            data.date = stateUp.date;
                            colectionOptions.push(data);
                        }).catch(err => {
                            console.log(err);
                        });
                    });

                    if (mParam.isTop){
                        this.topSearches = colectionOptions;
                    }else {
                        this.productList = colectionOptions;
                    }
                })
            },
            searchCrops($option){

                console.log($option);
                this.getPricesTop({limit:1,isTop:false,id:$option.id});

            },
            onClickProduct(model){
                //console.log(model);
                this.$router.push({ name: "dashboard",query: { crop:model}});
            }
        },
        mounted (){
            this.storageIconRef = this.$firebase.storage().ref().child("agricultural_icons");
            this.storageImgRef = this.$firebase.storage().ref().child("agricultural_images");
            this.getPricesTop({limit:4,isTop:true});
            this.getPricesTop({limit:6,isTop:false});

            let db = this.$firebase.firestore();
            db.collection('agricultural_crops').where("state", "==",1).orderBy('name_es').get().then(snap => {
                const colectionOptions = [];
                snap.forEach(async doc => {
                    let data = {};

                    data.icon_url = await this.downloadIcon(doc.data().icon_url);
                    data.name_es = doc.data().name_es;
                    data.id = doc.data().id;
                    colectionOptions.push(data);
                });

                //console.log(colectionOptions)
                this.optionCrops = colectionOptions;
                //loading(false);
            })

        }
    }
</script>

<style lang="stylus">
    @import '~vue-multiselect/dist/vue-multiselect.min.css';

    .container-home
        .header-navigation
            position: absolute !important;
            width: 100% !important;
            background-color: #ebf7ed00 !important;

        .bg-home
            background-color #EAF7ED
        .bg-img
            //height: 430px;
            //height: 60vh
            background-image: url('~@/assets/images/home-banner.png')
            background-repeat: no-repeat
            //background-position: center top;
            background-size: 26% auto;
            background-position: left bottom;

            //background-size:  cover;
            //background-color: #999

        .section
            padding: 3rem 8.5rem;

        .banner-body
            padding: 10% 25% 1px 25% !important;
            background: rgba(255,255,255,0.19);

        .search-container
            text-align center
            .title-search
                color #184624
                font-size 35px
                padding: 20px 10px;
            .sub-title
                color #184624
                padding 5px
                font-size 20px
                padding-top: 30px;

        .hero-body
            //background: rgba(0, 0, 0, 0.33);

        .multiselect__tags
            border-radius: 24px;
            min-height: 48px;
            padding: 0px 40px 0 8px;

        .multiselect__option
            display inline-flex
            width 100%
            align-items: center;

        /*.multiselect__content-wrapper
            width: fit-content;*/


        .multiselect__single
            display inline-flex
            align-items center
            //border-radius: 20px;
            margin-top: 4px;
            margin-bottom: 4px;
            margin-left 0px
            margin-right 0px
            padding 0px

        .multiselect__input
            margin-top: 14px;
            padding 0px !important

        .multiselect__placeholder
            margin-top 10px !important

        /*.multiselect__content-wrapper
            z-index 10 !important*/

        .pdtb-1
            padding-bottom 2px
            padding-top 0px
        .pd-1
            padding 4px !important
        .pd-5
            padding 2px !important

        .columns-custom
            margin-right: 0 !important;
            margin-top: 0 !important;
            margin-left: 0 !important
        .card-border
            border: solid 0;
            border-radius  10px
            height: 100%;
            .img-border
                border: solid 0;
                border-top-left-radius: 10px
                border-top-right-radius: 10px
        .title-card
            font-size: 16px;

        .subtitle-cart
            position: relative;

        .card-content
            .content
                .title-card
                    padding-top 8px
                    padding-bottom 5px
                    font-size 16px;
                .subtitle-cart
                    font-size: 16px;
                    text-align: right
                    .price-title
                        position: relative
                        .price
                            width: 60%;
                            display: inline-block;
                            text-align: start;
                            span
                                padding-right: 3px;
                                font-weight: 700;
                        .many
                            width: 40%;
                            display: inline-block;
                            text-align: end;

        @media only screen and (min-width: 320px) and (max-width: 750px)
            .section
                padding: 3rem 0.8rem;
            .banner-body
                padding: 70px 15px 1px 15px !important;
                background #ffffff2b

            .search-container
                text-align center
                .title-search
                    color #184624
                    font-size 18px
                    padding: 20px 10px;
                .sub-title
                    color #184624
                    padding 5px
                    padding-top: 30px;
            .section-style
                background: #FFFDF2;
                padding-top: 30px !important;

            .img-circle
                position: relative;
                display: inline-block;
                width: 48px;
                height: 48px;
                overflow: hidden;
                border-radius: 50%;
                img
                    width: 100%
                    height: auto

            .bg-img
                //height: 430px;
                //height: 30vh
                background-image: url('~@/assets/images/home-banner.png')
                background-repeat: no-repeat
                //background-position: center top;
                background-size: 48% auto;
                background-position: left bottom;
            .btn-search
                display none !important

            .card-category
                border: 1px solid;
                display: inline-flex;
                padding: 3px;
                border-radius: 10px;
                width: 100%;
                color #184624;
                .img-card
                    width: 65px;
                    height: 40px;
                    img
                        width: 80px
                .title-card
                    padding: 10px 2px 10px 2px;

            .card-content
                .content
                    .title-card
                        padding-top 5px
                        padding-bottom 1px
                        font-size 12px;
                    .subtitle-cart
                        font-size: 12px;
                        text-align: right
                        .price-title
                            position: relative
                            .price
                                width: 60%;
                                display: inline-block;
                                text-align: start;
                                span
                                    padding-right: 3px;
                                    font-weight: 700;
                            .many
                                width: 40%;
                                display: inline-block;
                                text-align: end;

            .colums-container
                margin: 0px !important;
                padding: 0px 10px 10px 10px;


</style>
