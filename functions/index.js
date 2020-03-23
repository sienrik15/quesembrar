/* eslint-disable promise/always-return,consistent-return */
const admin = require('firebase-admin');
const functions = require('firebase-functions');
const express = require("express");
const axios = require('axios');
const cors = require('cors');
const html2json = require('html2json').html2json;
const path = require('path');
const history = require('connect-history-api-fallback');
const CronJob = require('cron').CronJob;
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
//const request = require('request');
const querystring = require('querystring');
const HtmlTableToJson = require('html-table-to-json');
const _ = require('lodash');
const moment = require('moment');
moment.locale('es-do');


//Prod
//admin.initializeApp(functions.config().firebase);

//Local
const serviceAccount = require(path.join(__dirname, '../agroanalytics-b2462-firebase-adminsdk-j4why-19923b79f1.json'));
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://agroanalytics-b2462.firebaseio.com"
});

const db = admin.firestore();
db.settings({ timestampsInSnapshots: true });

createProducto = async () => {
    let productRef = db.collection('precios');
    productRef.doc('sandia').set({
        fecha:'',
        peso:'1kg',
        unidad:'S/',
        precio_max:'',
        precio_prom:'',
        precio_min:''
    });

    let volumenRef = db.collection('volumen');
    volumenRef.doc('sandia').set({
        fecha:'',
        unidad:'t',
        ciudad:'',
    });
};

deletefilevalue = async ()=>{
    // Get the `FieldValue` object
    let FieldValue = require('firebase-admin').firestore.FieldValue;

    // Create a document reference
    let cityRef = db.collection('users').doc('alovelace');

    // Remove the 'capital' field from the document
    let removeCapital = cityRef.update({
        last: FieldValue.delete()
    });
};

deleteCollection = (db, collectionPath, batchSize) => {
    let collectionRef = db.collection(collectionPath);
    let query = collectionRef.orderBy('__name__').limit(batchSize);

    return new Promise( (resolve, reject) => {
        deleteQueryBatch(db, query, batchSize, resolve, reject);
    });
};

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


// Post Producto por mercado : http://sistemas.minagri.gob.pe/sisap/portal2/mayorista/generos/filtrarPorMercado  mercado: * (empty) ajax: true
// Post subproducto de producto : http://sistemas.minagri.gob.pe/sisap/portal2/mayorista/variedades/filtrarPorGenero expandir: 0231~checkBox (empty) ajax: true
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
    //console.log(productList.length);


    /*let agriculturalCrops = db.collection('agricultural_crops');
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

        return resProducts

    }).catch(err => {
        console.log('Error getting documents', err);
    });


    let productUpdate = productList.map((vlPr,index) => {
        agroCrops.map(vlAgro => {
            if (vlAgro.id_ref === vlPr.id){
                console.log(vlAgro.id_ref);
                delete productList[index];
            }
        });
    });*/

    return productList
};

getProductCrops = async (res)=>{
    /*let resProMercado = await axios.post('http://sistemas.minagri.gob.pe/sisap/portal2/mayorista/generos/filtrarPorMercado',
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

                let resListProduc =  await axios.post('http://sistemas.minagri.gob.pe/sisap/portal2/mayorista/variedades/filtrarPorGenero',
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


getScrap = async () =>{
    let response = await axios.post('http://sistemas.minagri.gob.pe/sisap/portal2/mayorista/resumenes/filtrar',
        querystring.stringify({
            mercado: '*',
            'variables[]': 'volumen',
            'procedencias[]': '110000',
            fecha: '07/09/2019',
            desde: '01/01/2019',//1997
            hasta: '07/09/2019',
            'anios[]': '2019',
            'meses[]': '09',
            'semanas[]': '36',
            //'productos[]': '0633',
            'productos[]': '063301',
            periodicidad: 'intervalo'
        }));

    return response.data;
};

getPricesSisap = async (param) => {
    let today = moment().format("DD/MM/YYYY");
    let response = await axios.post('http://sistemas.minagri.gob.pe/sisap/portal2/mayorista/resumenes/filtrar',
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
        }));

    return response.data;
};

const API_PREFIX = 'api';
const app = express();


app.use((req, res, next) => {
    if (req.url.indexOf(`/${API_PREFIX}/`) === 0) {
        req.url = req.url.substring(API_PREFIX.length + 1);
    }
    next();
});

app.get('/delet-collection', async (req, res) => {
    //console.log("Hola quesembrar");
    //let deletCallection = await deleteCollection(db, 'prices', 450);
    //res.send(deletCallection)
});

app.get('/', async (req, res) => {
    console.log("Hola quesembrar");
    //res.send("Hola quesembrar");
    //let  priceRef = db.collection('prices');
    //priceRef = await priceRef.where('price', '>', "0");
    //priceRef = await priceRef.where("crops_id","==","08XDzSuu8cxyiZgauQcl");
    /*priceRef = await priceRef.orderBy("date", "desc").limit(10);
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
    });*/

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
});

app.get('/query', async (req, res) => {

    //await getProductCrops(res);
    //res.send(response)
    /*let mParams = {
        crops_id_ref: "",
        crops_id:"BzgL14JQFRorQxPooJRb",
        market_id:"3BeNPYEum6Wvw1z2dFHw", //codifgo defauld, implementar mas adelante
        price_type_id_ref: "",
        price_type_id: "AFuN7owOgTMIvwBzFNBG"
    };
    let sma = await [0,1,3].map(async (vl,k) => {
        let productDB = await getLastProductDB(mParams);
        if (k > 1)
            res.send(productDB)
    });*/

});


async function updateAllPrices(param) {

    let paramPrices = {
        start:"01/01/1997",
        last:moment().format("DD/MM/YYYY"),
        type:[param.price_type_id_ref], //,'precio_prom','precio_min'
        product:param.crops_id_ref,
    };
    let response = await getPricesSisap(paramPrices);

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
            }, 350 * toJSON.length - 350 * k3)
        ));

    await Promise.all(promiseJsonInsert).then(()=> console.log("ingesta subGrupo terminado======> "+frInsertCount));

    return frInsertCount

}

app.get('/prod-all', async (req, res) => {

    let priceRef = await db.collection('prices');
    priceRef = await priceRef.where('crops_id', '==', "BzgL14JQFRorQxPooJRb");
    priceRef = await priceRef.where('price_type_id', '==', "ShlOjc8bm8QP9q7rw4kp"); // precio_prom: dsE4vwVF1JyfWVOVLgYA precio_max: AFuN7owOgTMIvwBzFNBG , min: ShlOjc8bm8QP9q7rw4kp
    let lastPrice = await priceRef.get()
        .then(async value => {
            let res = [];
            await value.forEach(doc => {
                let object = {};
                object["date"] = doc.data().date.toDate();
                object["id"] = doc.data().id;
                //console.log(object);
                res.push(object);
                //console.log(doc.id, '=>', doc.data());
            });
            return  res
        }).catch(err => {
            console.log('Error getting documents', err);
        });
    console.log(lastPrice.length);
    res.send(lastPrice);
});

app.get('/update-all',async (req, res) => {

    await updateAllProductsDB(res)

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
    console.log(productDB);

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

        console.log(moment(today).format("DD/MM/YYYY"));
        console.log(moment(beforeLastDate).format("DD/MM/YYYY"));
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
                    console.log(k3);
                    await inserDataDays(valList,mParams);
                    resolve()
                }, 500 * pricesResultClean.length - 500 * k3)
            ));

        await Promise.all(promiseJsonInsert).then(()=> console.log("ingesta subGrupo terminado======> "+frInsertCount));

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
                date = admin.firestore.Timestamp.fromDate(mdate);
            }else { console.log("Sin fecha id: "+doc.id) }

            let price = 0.00;
            if (vl.price && vl.price !== ""){
                price = parseFloat(vl.price).toFixed(2);
            }

            let auditoryDay = moment().toDate();
            let date_auditory = admin.firestore.Timestamp.fromDate(auditoryDay);

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
        let date_auditory = admin.firestore.Timestamp.fromDate(auditoryDay);

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
    return await agriculturalCrops.get().then(value => {
        let res = [];
        value.forEach(doc => {
            res.push(doc.data());
        });
        return  res
    }).catch(err => {
        console.log('Error getting documents', err);
    });
}

async function updateAllProductsDB(res){
    let pricesTypeDB = await getPricesTypeDB();
    let agriculturalCropsDB = await getAgriculturalCropsDB();

    let limitUpd = agriculturalCropsDB.length*pricesTypeDB.length;
    console.log("init Total "+limitUpd);
    console.log("init producto x3 "+agriculturalCropsDB.length);


    let promiseAgricultura = await agriculturalCropsDB.map((crops,k1)=>
        new Promise(async resolve =>
            await setTimeout(async () => {

                if (k1 >= 29){
                    resolve();
                    return 0
                }

                let promisePrices = pricesTypeDB.map( (vlTprice,k2) =>
                    new Promise(async resolve =>
                        await setTimeout(async () => {

                            let updatePrices = await updatePricesProduct(crops,vlTprice);

                            console.log("Actualizado====> "+updatePrices);
                            resolve()
                        }, 500 * pricesTypeDB.length - 500 * k2)
                    ));

                let rgister = k1+1;
                await Promise.all(promisePrices).then(()=> console.log("Se ingesto-"+rgister+"-Grupo"));

                resolve()
            }, 500 * pricesTypeDB.length - 500 * k1)
        )
    );

    await Promise.all(promiseAgricultura).then(()=> console.log("Se ingesto #"+limitUpd+" registros"));

    res.send({data_ingestada:limitUpd});
}

exports[API_PREFIX] = functions.https.onRequest(app);

