/* eslint-disable promise/always-return,consistent-return */
const admin = require('firebase-admin');
const { Timestamp } = require('firebase-admin/firestore')
const functions = require('firebase-functions');
const express = require("express");
const axios = require('axios');
//const cors = require('cors');
const html2json = require('html2json').html2json;
const path = require('path');
//const history = require('connect-history-api-fallback');
//const CronJob = require('cron').CronJob;
const jsdom = require("jsdom");
//const { JSDOM } = jsdom;
const querystring = require('querystring');
const HtmlTableToJson = require('html-table-to-json');
const _ = require('lodash');
const moment = require('moment-timezone');
//import moment from "moment-timezone";
//const Jimp = require('jimp');
//const imagemin = require("imagemin");
//const imageminPngquant = require("imagemin-pngquant");
//const imageminJpegtran = require('imagemin-jpegtran');
const tinify = require("tinify");
tinify.key = "lxWWsDsbSXtXlR1wL9861HjMGWjxDqPr";
const Fs = require('fs')
const Path = require('path')

moment.locale('es-do');
moment.tz.setDefault("America/Lima");
//moment().tz("America/Lima").format();


//Prod
admin.initializeApp(functions.config().firebase);

//Local
// const serviceAccount = require(path.join(__dirname, '../agroanalytics-b2462-firebase-adminsdk-j4why-19923b79f1.json'));
// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: "https://agroanalytics-b2462.firebaseio.com"
// });

const db = admin.firestore();
db.settings({ timestampsInSnapshots: true });

deleteCollection = (db, collectionPath, batchSize) => {
    let collectionRef = db.collection(collectionPath);
    let query = collectionRef.orderBy('__name__').limit(batchSize);

    return new Promise( (resolve, reject) => {
        deleteQueryBatch(db, query, batchSize, resolve, reject);
    });
};
/* eslint-disable */
deleteQueryBatch = (db, query, batchSize, resolve, reject) => {

    query.get().then((snapshot) => {
        // When there are no documents left, we are done
        if (snapshot.size === 0) {
            return 0;
        }

        // Delete documents in a batch
        let batch = db.batch();
        snapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });

        return batch.commit().then(() => {
            return snapshot.size;
        });
    }).then((numDeleted) => {
        if (numDeleted === 0) {
            resolve();
            return;
        }

        // Recurse on the next process tick, to avoid
        // exploding the stack.
        process.nextTick(() => {
            deleteQueryBatch(db, query, batchSize, resolve, reject);
        });

        return console.log('This is the notify feature');

    }).catch(reject);
};


// Post Producto por mercado : http://sistemas.midagri.gob.pe/sisap/portal2/mayorista/generos/filtrarPorMercado  mercado: * (empty) ajax: true
// Post subproducto de producto : http://sistemas.midagri.gob.pe/sisap/portal2/mayorista/variedades/filtrarPorGenero expandir: 0231~checkBox (empty) ajax: true
makeIdProducts = async ()=>{
    let productList = [];
    console.log("inite");

    for ( let i=1; i<=13;i++){
        for (let j=1; j<=32;j++){
            let sI = (i<10)?"0":"";
            let ej = (j<10)?"0":"";

            let id = sI+i+ej+j;
            let objectPor = {};
            objectPor.id = id;
            objectPor.name = "";
            productList.push(objectPor)
        }
    }

    return productList
};

/*
updateAgroCrops = async ()=>{

    let agriculturalCrops = db.collection('agricultural_crops');

    let agroCrops = await agriculturalCrops.get().then(value => {
        let resProducts = [];
        value.forEach( (doc,index) => {
            let object = {};
            //object["id"] = doc.data().id;
            object["name_es"] = doc.data().name_es;
            object["id_ref"] = doc.data().id_ref;
            object["id"] = doc.data().id;
            resProducts.push(object);
        });
        return resProducts
    }).catch(err => {
        console.log('Error getting documents', err);
    });

    let CropsList = await _.chunk(agroCrops, 200);

    let count = 0;
    let countUp = 0;
    let countDown = 0;

    for (let agroProd of CropsList){
        for (let [i,doc] of agroProd.entries()){
            let paramPrices = {
                start:moment().subtract(1, 'day').format("DD/MM/YYYY"),
                last:moment().subtract(1, 'day').format("DD/MM/YYYY"),
                type:["precio_prom"], //,'precio_prom','precio_min'
                product:[doc.id_ref],
            };

            let response = await getPricesSisap(paramPrices);

            if (response){

                let toJSON = await HtmlTableToJson.parse(response)._results[0];

                if (toJSON && toJSON.length > 0){
                    await db.collection("agricultural_crops").doc(doc.id).update({state: 1});
                    countUp++;
                    console.log("Update  ===> 1")
                }else {
                    await db.collection("agricultural_crops").doc(doc.id).update({state: 0});
                    countDown++;
                    console.log("Update  ===> 0")
                }

            }

            count++;
            console.log("Contador-----> "+count);

            if (count >= agroCrops.length){
                console.log("Total "+agroCrops.length);
                console.log("Contador-----> "+countUp);
                console.log("Contador-----> "+countDown);
                return agroCrops.length
            }
        }
    }


    return agroCrops

};
*/

getProductCrops = async (res)=>{
    /*let resProMercado = await axios.post('http://sistemas.midagri.gob.pe/sisap/portal2/mayorista/generos/filtrarPorMercado',
        querystring.stringify({
            mercado: '*'
        }));

    let toJSON = await html2json(resProMercado.data);

    let productList = [];
    await toJSON.child[0].child.map(vl=>{
        let modelProduct = {};
        modelProduct.id = vl.child[0].child[0].attr.value;
        modelProduct.name = vl.child[2].text === 'Pi�a'?'piña':vl.child[2].text.toLowerCase();
        productList.push(modelProduct)
    });*/

    let agriculturalCrops = db.collection('agricultural_crops');
    let agroCrops = await agriculturalCrops.get().then(async value => {

        let resProducts = [];
        await value.forEach(async doc => {
            //res.push(doc.data());
            let object = {};
            //object["id"] = doc.data().id;
            object["name_es"] = doc.data().name_es;
            object["id_ref"] = doc.data().id_ref;
            resProducts.push(object);
        });

        console.log("Cantidad de productos");
        console.log(resProducts.length);
        return resProducts

    }).catch(err => {
        console.log('Error getting documents', err);
    });

    let resProMercado = await makeIdProducts();

    let subProductsList = [];

    let promises =  resProMercado.map( (vl,i)=>
        new Promise(async resolve =>

            await setTimeout(async () => {

                let resListProduc =  await axios.post('http://sistemas.midagri.gob.pe/sisap/portal2/mayorista/variedades/filtrarPorGenero',
                    querystring.stringify({
                        expandir: vl.id
                    })).catch(err=>{
                    console.log(vl.id);
                    console.log(err.message);
                });


                let subProductJson = await html2json(resListProduc.data);

                console.log(subProductJson);

                if (subProductJson.child.length === 1){
                    vl.id = subProductJson.child[0].child[0].child[0].attr.value;
                    let txt = subProductJson.child[0].child[0].child[1].text.replace(/�/g,'ñ');
                    vl.name = txt.replace(/ññ/g,'ñ').toLowerCase();
                    subProductsList.push(vl);
                    console.log(vl.id+"=====>"+i);
                    console.log(subProductsList.length);
                }else {

                    subProductJson.child.map((vlp,inx) =>{
                        let productObject = {};
                        productObject.id = vlp.child[0].child[0].attr.value;
                        let txt = vlp.child[0].child[1].text.replace(/�/g,'ñ');
                        productObject.name = txt.replace(/ññ/g,'ñ').toLowerCase();
                        subProductsList.push(productObject);
                        let index = i + inx;
                        console.log(vl.id+"=====>"+index);
                        console.log(subProductsList.length);
                    })
                }

                resolve()
            }, 100 * resProMercado.length - 100 * i)

        ));

    await Promise.all(promises).then(()=> console.log("respons"));

    subProductsList.map((vlPr,index) => {
        agroCrops.map(vlAgro => {
            if (vlAgro.id_ref === vlPr.id){
                console.log(vlAgro.id_ref);
                delete subProductsList[index];
            }
        });
    });

    let subProducts = [];
    subProductsList.map(pVl=>{
       if (pVl.id !== "070209" && pVl.id !== "120302" && pVl.id !== "120305" && pVl.id !== "120301" && pVl.id !== "120304" && pVl.id !== "120303"){
           subProducts.push(pVl)
       }
    });

    let isInsertProducts = await inserDataProduct(subProducts);

    res.send(isInsertProducts ? subProducts:'Err al insertar en firestore');

};

getPricesSisap = async (param) => {
    let today = moment().format("DD/MM/YYYY");
    let response = await axios.post('http://sistemas.midagri.gob.pe/sisap/portal2/mayorista/resumenes/filtrar',
            querystring.stringify({
                mercado: '*',
                'variables[]': param.type,
                fecha: today,//'02/02/2020',
                desde: param.start,//'01/01/1997',//1997
                hasta: param.last,//'02/02/2020',
                //'anios[]': '2020',
                //'meses[]': '11',
                //'semanas[]': '48',
                //'productos[]': '0633',
                'productos[]': param.product, //"0633"
                periodicidad: 'intervalo'
            })).catch((err) => {
                console.log("========"+param.product+"========");console.log(err.message)
            });


    return response ? response.data :false;
};

const API_PREFIX = 'api';
const app = express();

app.use((req, res, next) => {
    if (req.url.indexOf(`/${API_PREFIX}/`) === 0) {
        req.url = req.url.substring(API_PREFIX.length + 1);
    }
    next();
});

/*app.get('/delet-collection', async (req, res) => {
    //console.log("Hola quesembrar");
    //let deletCallection = await deleteCollection(db, 'prices', 450);
    //res.send(deletCallection)
});*/

/*app.get('/', async (req, res) => {
    console.log("Hola quesembrar");
    //res.send("Hola quesembrar");
    //let  priceRef = db.collection('prices');
    //priceRef = await priceRef.where('price', '>', "0");
    //priceRef = await priceRef.where("crops_id","==","08XDzSuu8cxyiZgauQcl");
    /!*priceRef = await priceRef.orderBy("date", "desc").limit(10);
    let response = await priceRef.get().then(async value => {
        let resData = [];
        await value.forEach(doc => {
            let object = {};
            object["date"] = doc.data().date.toDate();
            object["id"] = doc.data().id;
            object["price_type_id"] = doc.data().price_type_id;
            object["crops_id"] = doc.data().crops_id;
            console.log(object);
            resData.push(object);
        });
        console.log(value.size);
        res.send(resData);

        return value.size;
    });*!/

//Product list

    let agriculturalCrops = db.collection('agricultural_crops');
    await agriculturalCrops.get().then(async value => {

        let resPrice = [];
        await value.forEach(async doc => {
            //res.push(doc.data());
            let  priceRef = db.collection('prices');
            priceRef = priceRef.where("crops_id","==",doc.data().id);
            priceRef =  priceRef.orderBy("date", "desc").limit(3);
            await priceRef.get().then( async prices => {

                await prices.forEach( async docPrs => {
                    let object = {};
                    object["date"] = docPrs.data().date.toDate();
                    object["price"] = docPrs.data().price;
                    object["id"] = doc.data().id;
                    object["name_es"] = doc.data().name_es;
                    await resPrice.push(object);
                    console.log(object);

                    if (resPrice.length >= 69){
                        console.log(resPrice);
                        res.send(resPrice);
                    }

                });

            })

        });



    }).catch(err => {
        console.log('Error getting documents', err);
    });

    //await getProductCrops(res)
});*/

let Cookie = 'cfid=1af7cdc7-ab7e-46e7-8a49-799e1888778d; cftoken=0; _ga=GA1.2.1966463352.1597959184; _gid=GA1.2.200242297.1598127995; REDIRECT_URL_2657=http%3A%2F%2Fus.saltpluspepper.com%2F%3FGO%3DRECIPEDETAILS%26ContentID%3D404373%26wasinternalredirect%3Dtrue; _gat=1'

app.get('/', async (req, res) => {

    let recipeImages = [];
    let recipeList = []
    let recipes = await db.collection('kitchen_recipes');
    //let batch = db.batch();
    recipes = recipes.select('id','id_ref','image_url')
    recipes = recipes.where('id_ref','>=','404408').where('id_ref','<=','404413') //404413
    await recipes.get().then( async vl=>{
        //let ingredients = db.collection('kitchen_recipes_ingredients');
        console.log(vl.docs.length)

        vl.docs.forEach(doc=>{
            recipeList.push(doc.data())
            recipeImages.push(downloadImage(doc.data().id_ref,doc.data().image_url));
        })

        Promise.all(recipeImages).then(values => {
            console.log(values);
        });


        res.setTimeout(30000, ()=>{
            res.send(recipeList);
        })

    })

    /*for (let doc in recipeListData){
        let source = await tinify.fromUrl('http://image-previews.awap.tv/95/2320/'+doc.id_ref+'/1024/0/preview');
        await source.toFile('images/'+doc.image_url);
    }*/


    /**let recipeList = [];
    let batch = db.batch();
    for (let i=451;i<=500;i++){//480338 379 500 , step 42 /v2 404353 - 404413
        let doc = db.collection('kitchen_recipes').doc();
        let auditoryDay = moment().toDate();
        let date_auditory = admin.firestore.Timestamp.fromDate(auditoryDay);

        let recipeValue = await axios.get('http://us.saltpluspepper.com/index.cfm?GO=RECIPEDETAILS&ContentID=480'+i, //338 - 501
            { 'headers': { Cookie: Cookie } });

        let dom = new JSDOM(recipeValue.data);

        let toJSON = {
            image_url:'',
            indications:'',
            language:'en',
            name:'',
            ingredients:[],
            id_ref:'480'+i,
            id: doc.id,
            created_at:date_auditory
        };

        toJSON.image_url = dom.window.document.querySelector("h2").textContent.toLowerCase().replace(/[',]/g,'').replace(/&/g,'and').replace(/[- ]/g,'_')+'_image.png'
        toJSON.name = dom.window.document.querySelector("h2").textContent.toLowerCase().replace(/&/g,'and')
        toJSON.indications = dom.window.document.querySelector(".recipe-method").textContent
        let lengthIngedients = dom.window.document.querySelectorAll(".recipe-ingredient-quantity")

        lengthIngedients.forEach((vl,index)=>{
            let value = dom.window.document.querySelectorAll(".recipe-ingredient-value")[index].textContent
            toJSON.ingredients.push({quantity:vl.textContent,value:value});
        });

        console.log("http:"+dom.window.document.querySelector("img").src)
        //let toJSON = html2json(recipeValue.data)
        console.log(i)

        await batch.set(doc, toJSON);
        recipeList.push(toJSON);
    }

    await batch.commit().then(() => {
        console.log("Se agrego:  "+ recipeList.length+"  objetos");
        res.send(recipeList);
    }).catch(err=>{
        console.log(err.message);
    });*/

    //res.send(recipeList);

    /*res.setTimeout(15000, ()=>{
        res.send(recipeList);
    })*/

    //for (let i=338;i<=500;i++){
    /*Jimp.read(
            'http://image-previews.awap.tv/95/2320/480500/1024/0/preview',
             (err, lenna) => {
            if (err) throw err;
            lenna.quality(70).writeAsync('images/meat_free_chickpea_and_potato_curry_image3.jpg'); // resize
                //.quality(60) // set JPEG quality
                //.quality(83).rgba(true)
                //.pixelate(0) .quality(95).rgba(true)
                //.greyscale() // set greyscale
                 // save
        }).then(vl=>{
            console.log(vl)
    });*/
    //}
    //let source = tinify.fromUrl("http://image-previews.awap.tv/95/2320/480500/1024/0/preview");
    //source.toFile("images/meat_free_chickpea_and_potato_curry_image2.jpg");

    /*await imagemin('http://image-previews.awap.tv/95/2320/480500/1024/0/preview', {//['images/*.{jpg,png}']
        destination: 'build/images',
        plugins: [
            imageminJpegtran({
                progressive: true,
                //max: 10
            }),
            imageminPngquant({
                speed: 1,
                quality: [0.85, 0.95]
            })
        ]
    });*/


});

async function downloadImage (order,nameFile) {
    const url = 'http://image-previews.awap.tv/95/2320/'+order+'/1024/0/preview'
    const path = Path.resolve(__dirname, 'images', nameFile)
    const writer = Fs.createWriteStream(path)

    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
    })

    await response.data.pipe(writer)

    return new Promise((resolve, reject) => {
        writer.on('finish', resolve)
        writer.on('error', reject)
    })
}


async function updateAllPrices(param) {

    let paramPrices = {
        start:"01/01/1997",
        last:moment().format("DD/MM/YYYY"),
        type:[param.price_type_id_ref], //,'precio_prom','precio_min'
        product:param.crops_id_ref,
    };
    let response = await getPricesSisap(paramPrices);

    if (!response)
        return 0;

    let toJSON = await HtmlTableToJson.parse(response)._results[0];


    if (toJSON && toJSON.length > 0){
        console.log("Sisap precios ===> "+ toJSON.length)
    }else {
        return 0
    }

    toJSON = await clearData(toJSON);

    toJSON = await _.chunk(toJSON, 400);
    let frInsertCount = toJSON.length;

    /**Inserta grupo a grupo de 450 item */
    let promiseJsonInsert = toJSON.map( (valList,k3) =>
        new Promise(async resolve =>
            await setTimeout(async () => {
                console.log(k3);
                await inserDataDays(valList,param);
                resolve()
            }, 500 * toJSON.length - 500 * k3)
        ).catch(() => {}));

    await Promise.all(promiseJsonInsert).then(()=> console.log("ingesta subGrupo terminado======> "+frInsertCount)).catch(() => {});

    return frInsertCount

}

/*app.get('/prod-all', async (req, res) => {

    //let priceRef = await db.collection('prices');
    let dateNew = new Date(1587168000000);
    let fromDate = admin.firestore.Timestamp.fromDate(dateNew);
    let day = moment().format("LLLL");

    let daySam = moment().tz("America/Los_Angeles").format("LLLL");

    console.log(day);
    console.log(daySam);
    /!*priceRef = await  priceRef.where("date",">=",fromDate);
    //priceRef = await priceRef.where('crops_id', '==', "BzgL14JQFRorQxPooJRb");
    //priceRef = await priceRef.where('price_type_id', '==', "ShlOjc8bm8QP9q7rw4kp"); // precio_prom: dsE4vwVF1JyfWVOVLgYA precio_max: AFuN7owOgTMIvwBzFNBG , min: ShlOjc8bm8QP9q7rw4kp
    let lastPrice = await priceRef.get()
        .then(async value => {
            let resList = [];
            await value.forEach(doc => {
                let object = {};
                object["date"] = doc.data().date;
                object["created_at"] = doc.data().created_at.toDate();
                object["id"] = doc.data().id;
                console.log(object);
                resList.push(object);
                //console.log(doc.id, '=>', doc.data());
            });
            return  resList
        }).catch(err => {
            console.log('Error getting documents', err);
        });

    console.log(lastPrice.length);

    for (let [k1,price] of lastPrice.entries()){
        await db.collection('prices').doc(price.id).delete().then(vl=>{console.log("eliminado => "+price.id)});
    }*!/

    res.send(fromDate);
});*/

app.get('/update-all',async (req, res) => {

    let pStr = await updateAllProductsDB();

    res.send(pStr);

});


async function updatePricesProduct(crops,price){
    let mParams = {
        crops_id_ref: crops.id_ref,
        crops_id:crops.id,
        market_id:"3BeNPYEum6Wvw1z2dFHw", //codifgo defauld, implementar mas adelante
        price_type_id_ref: price.id_ref,
        price_type_id: price.id
    };

    /**@function getLastProductDB obtien el ultimo dato ingestado de la DB*/
    let productDB = await getLastProductDB(mParams);
    //console.log(productDB);

    if (productDB && productDB.length === 0) {
        console.log("Inicia ingesta de total " +  mParams.crops_id_ref );
        let allPrices= await updateAllPrices(mParams);
        console.log("Finaliza ingesta de" + mParams.crops_id_ref +" : "+ allPrices);
        return allPrices
    }else {
        console.log("Inicia ingesta a completar" +  mParams.crops_id_ref );
        /**@param today y beforeLastDate son fechas para validar el dia actual con el ultima fecha de la DB **/
        let today = moment().format("YYYY-MM-DD");  //DD/MM/YYYY
        let beforeLastDate = moment(productDB[0].date).add(1, 'day').format("YYYY-MM-DD");

        /**Verificar si hay datos para actualizar deacuerdo a la fecha**/
        let isUpdateData = moment(beforeLastDate).isSameOrBefore(today);

        //console.log(moment(today).format("DD/MM/YYYY"));
        //console.log(moment(beforeLastDate).format("DD/MM/YYYY"));
        console.log("Pendiente de carga: "+isUpdateData +"==="+mParams.price_type_id_ref);
        /**En caso la ultima fecha insertada no es menor o igual a la fecha actual, no se realiza la actualizacion de la DB**/
        if (!isUpdateData){
            console.log("No hay nuevos datos para actualizar, fecha de ultima carga: "+moment(productDB[0].date).format("YYYY-MM-DD"))
            return 1
        }

        /**Parametros para realizar query a la API de sisap**/
        let paramPrices = {
            start:moment(beforeLastDate).format("DD/MM/YYYY"),//"01/01/1997"
            last:moment(today).format("DD/MM/YYYY"),//"02/02/2020",
            type:[mParams.price_type_id_ref], //,'precio_prom','precio_min'
            product:mParams.crops_id_ref,
        };
        let sisapPrices = await getPricesSisap(paramPrices);

        if (!sisapPrices)
            return 0;

        let pricesResult = await HtmlTableToJson.parse(sisapPrices)._results[0];

        if (pricesResult && pricesResult.length > 0){
            console.log("Sisap precios ===> "+ pricesResult.length)
        }else {
            return 0
        }

        let pricesResultClean = await clearData(pricesResult);

        pricesResultClean = await _.chunk(pricesResultClean, 400);
        let frInsertCount = pricesResultClean.length;

        /**Inserta grupo a grupo de 450 item */
        let promiseJsonInsert = pricesResultClean.map( (valList,k3) =>
            new Promise(async resolve =>
                await setTimeout(async () => {
                    //console.log(k3);
                    await inserDataDays(valList,mParams);
                    resolve()
                }, 500 * pricesResultClean.length - 500 * k3)
            ).catch(() => {}));

        await Promise.all(promiseJsonInsert).then(()=> console.log("ingesta subGrupo terminado======> "+frInsertCount)).catch(() => {});

        //console.log(pricesResultClean.length);
        //let isCorrectInset = await inserDataDays(pricesResultClean,mParams);


        console.log("actualizado " + mParams.price_type_id_ref);
        return frInsertCount;//isCorrectInset;
    }
}

async function inserDataDays(valList,params){
    let batch = db.batch();
    let addCorrect = false;
    await valList.map(async (vl, ky) => {
        if (!vl.description) {
            let doc = db.collection('prices').doc();
            let crops_id = params.crops_id;//"BzgL14JQFRorQxPooJRb";//sandia
            let market_id = params.market_id; //defauld
            let price_type_id = params.price_type_id;//"AFuN7owOgTMIvwBzFNBG"; //max
            let date = "";
            if (vl.date && vl.date !==""){
                let mdate = moment(vl.date, "DD/MM/YYYY").toDate();
                date = Timestamp.fromDate(mdate)//admin.firestore.Timestamp.fromDate(mdate);
            }else { console.log("Sin fecha id: "+doc.id) }

            let price = 0.00;
            if (vl.price && vl.price !== ""){
                price = parseFloat(vl.price).toFixed(2);
            }

            let auditoryDay = moment().toDate();
            let date_auditory = Timestamp.fromDate(auditoryDay) //admin.firestore.Timestamp.fromDate(auditoryDay);

            let object = {
                crops_id: crops_id,
                date: date,
                id: doc.id,
                market_id: market_id,
                price: price,
                price_type_id: price_type_id,
                created_at:date_auditory
            };

            await batch.set(doc, object);
        }else {
            console.log("Objeto descripcion no se agrego: "+ky+" => "+vl);
        }
    });

    await batch.commit().then(() => {
        console.log("Se agrego:  "+ valList.length+"  objetos");
        addCorrect = true
    }).catch(err=>{
        console.log(err);
        addCorrect = false
    });

    return addCorrect ? valList.length:"error al insertar firebase"
}

async function inserDataProduct(listProduct){
    let batch = db.batch();
    let addCorrect = false;
    await listProduct.map(async (vl) => {
        let doc = db.collection('agricultural_crops').doc(); //BzgL14JQFRorQxPooJRb sandia actual

        let auditoryDay = moment().toDate();
        let date_auditory = Timestamp.fromDate(auditoryDay) //admin.firestore.Timestamp.fromDate(auditoryDay);

        let object = {
            id: doc.id,
            id_ref: vl.id,
            image_url:'',
            name_es:vl.name,
            name:'',
            created_at:date_auditory
        };

        await batch.set(doc, object);

    });

    await batch.commit().then(() => {
        console.log("Se agrego:  "+ listProduct.length+"  objetos");
        addCorrect = true
    }).catch(err=>{
        console.log(err);
        addCorrect = false
    });

    return addCorrect
}

async function clearData(listObjet){
    /**Identificar el nombre del Key del producto, ya que se le asigna el precio*/
    let keys = Object.keys(listObjet[1]);
    let productName = keys[1];
    return await listObjet.map((vl, key)=> {
        if (key === 0) {
            vl.description = vl.Fecha;
            delete vl.Fecha;
        } else {
            vl.date = vl.Fecha;
            vl.price = vl[productName];
            delete vl.Fecha;
            delete vl[productName];
        }
        return vl;
    });
}

async function getLastProductDB(params){

    let priceRef = await db.collection('prices');
    priceRef = await priceRef.where('market_id', '==', params.market_id);
    priceRef = await priceRef.where('crops_id', '==', params.crops_id);
    priceRef = await priceRef.where('price_type_id', '==', params.price_type_id);
    priceRef = await priceRef.orderBy("date", "desc").limit(1);
    let lastPrice = await priceRef.get()
        .then(async value => {
            let res = [];
            await value.forEach(doc => {
                let object = {};
                object["date"] = doc.data().date.toDate();
                object["id"] = doc.data().id;
                console.log(object);
                res.push(object);
                //console.log(doc.id, '=>', doc.data());
            });
            return  res
        }).catch(err => {
            console.log('Error getting documents', err);
        });
    console.log(lastPrice.length);
    return lastPrice;
}

async function getPricesTypeDB(){
    let pricesType = db.collection('prices_types');
    return await pricesType.select("id","name","id_ref").get().then(value => {
        let res = [];
        value.forEach(doc => {
            res.push(doc.data());
        });
        return  res
    }).catch(err => {
        console.log('Error getting documents', err);
    });
}

async function getAgriculturalCropsDB(){
    let agriculturalCrops = db.collection('agricultural_crops');
    //agriculturalCrops = agriculturalCrops.orderBy("created_at", "desc");
    agriculturalCrops = agriculturalCrops.where("state", "==",1);
    return await agriculturalCrops.get().then(value => {
        let res = [];
        value.forEach(doc => {
            res.push(doc.data());
            /*
            let today = moment().format("YYYY-MM-DD");  //DD/MM/YYYY
            let beforeLastDate = moment(doc.data().date).add(1, 'day').format("YYYY-MM-DD");

            let isUpdateData = moment(beforeLastDate).isSameOrBefore(today);

            if (isUpdateData && (res.length <= 100)){
                    res.push(doc.data());
            }
            */
        });
        return  res
    }).catch(err => {
        console.log('Error getting documents', err);
    });
}

async function updateAllProductsDB(){
    let pricesTypeDB = await getPricesTypeDB();
    let agriculturalCropsDB = await getAgriculturalCropsDB();

    let limitUpd = agriculturalCropsDB.length*pricesTypeDB.length;

    /* eslint-disable no-await-in-loop */
    for (let [k1,crops] of agriculturalCropsDB.entries()){
        for (let [k2,vlTprice] of pricesTypeDB.entries()){
            /*if (k1 >= 200){
                return 0
            }*/   
            let updatePrices = await updatePricesProduct(crops,vlTprice);

            let rgister = k1+1;
            console.log(rgister+" preductos"+" Actualizado====> "+updatePrices);
        }
    }

    return {data_ingested:limitUpd}
    //res.send({data_ingestada:limitUpd});
}

exports.executeUpdateSisaptoDBTask = functions
    .runWith({ memory: functions.VALID_MEMORY_OPTIONS[3], timeoutSeconds: functions.MAX_TIMEOUT_SECONDS })
    .pubsub.schedule('0-17/9 9-17 * * *') //'0-17/9 10 * * *'
    .timeZone('America/Lima') // Users can choose timezone - default is America/Los_Angeles
    .onRun( (context) => {
        return new Promise(async (resolve, reject) => {

            let counter = await updateAllProductsDB();

            if (counter && (counter.data_ingested > 0)){
                console.log('Esta job se ejecuta a las 9:00 am, productos max,min,prom ==> '+counter.data_ingested);
                resolve("Ok");
            } else {
                reject(new Error('error'));
            }

        });
    });

exports[API_PREFIX] = functions.runWith({ memory: functions.VALID_MEMORY_OPTIONS[3], timeoutSeconds: functions.MAX_TIMEOUT_SECONDS }).https.onRequest(app);

