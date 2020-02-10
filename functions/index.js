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

    return new Promise((resolve, reject) => {
        deleteQueryBatch(db, query, batchSize, resolve, reject);
    });
};

deleteQueryBatch = (db, query, batchSize, resolve, reject) => {
    query.get()
        .then((snapshot) => {
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

//app.use(express.json());

//app.use(cors({origin: '*'}));

app.use((req, res, next) => {
    if (req.url.indexOf(`/${API_PREFIX}/`) === 0) {
        req.url = req.url.substring(API_PREFIX.length + 1);
    }
    next();
});

app.get('/', async (req, res) => {
    res.send("Hola mundo")
});

app.get('/prod-all', async (req, res) => {
    //deletefilevalue();
    //let delet = await deleteCollection(db, 'cities', 100);

    let paramPrices = {
        start:"01/01/1997",
        last:"02/02/2020",
        type:['precio_max'], //,'precio_prom','precio_min'
        product:"0633",
    };
    let response = await getPricesSisap(paramPrices);
    let toJSON = HtmlTableToJson.parse(response)._results[0];


    toJSON = await clearData(toJSON);

    /*let date = moment(toJSON[1].date, "DD/MM/YYYY").toDate();
    let timest = admin.firestore.Timestamp.fromDate(date);
    console.log(toJSON[1].date);
    console.log(date);
    console.log(timest);
    console.log(timest.toDate());
     let flo = parseFloat(toJSON[1].price).toFixed(2);
    console.log(flo);*/

    toJSON = _.chunk(toJSON, 400);
    let sum = toJSON.length;
    console.log(sum);
    //let insertDt = await insertDataAllDate(toJSON);
    res.send(toJSON)
    //res.send(html2json(response));
});

app.get('/read',async (req, res) => {


    //Obtener lista de documentos en una coleccion
    /*let citiesRef = db.collection('lima_market').doc('watermelon').collection("prices");
    let allCities = await citiesRef.select("name").get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                console.log(doc.id, '=>', doc.data());
            });
            return snapshot
        }).catch(err => {
            console.log('Error getting documents', err);
        }); */
    /*let citiesRef = db.collection('lima_market').doc('watermelon').collection("prices");
    let allCities = await citiesRef.where('name', '==', "precio promedio").get()
        .then(value => {
            let res = [];
            value.forEach(doc => {
                res.push(doc.data());
                console.log(doc.id, '=>', doc.data());
            });
            return  res
        }).catch(err => {
            console.log('Error getting documents', err);
        });*/

    /*let citiesRef = db.collection('lima_market').doc('watermelon').collection("prices").doc("avg_price");
    let allCities = await citiesRef.get()
        .then(value => {
            return  value.data()
        }).catch(err => {
            console.log('Error getting documents', err);
        });*/
    /*let citiesRef = db.collection('prices').orderBy("date", "desc").limit(1);
    let allCities = await citiesRef.get()
        .then(value => {
            let res = [];
            value.forEach(doc => {
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

    let today = moment().format();
    console.log(today);
    console.log(moment(allCities[0].date).isBefore(today));
    console.log(allCities.length);
    res.json(allCities);*/

    //res.json(await updatePricesProduct());
    res.json(await updateAllProductsDB());

});

async function insertDataAllDate (dataList) {

    await dataList.map( async (valList,key) => {
        console.log(key);
        await inserDataDays(valList);
    });

    return dataList
}

async function updatePricesProduct(){

    /**@function getLastProductDB obtien el ultimo dato ingestado de la DB*/
    let productDB = await getLastProductDB();

    /**@param today y beforeLastDate son fechas para validar el dia actual con el ultima fecha de la DB **/
    let today = moment().format("YYYY-MM-DD");  //DD/MM/YYYY
    let beforeLastDate = moment(productDB[0].date).add(1, 'day').format("YYYY-MM-DD");

    /**Verificar si hay datos para actualizar deacuerdo a la fecha**/
    let isUpdateData = moment(beforeLastDate).isSameOrBefore(today);

    console.log(moment(today).format("DD/MM/YYYY"));
    console.log(moment(beforeLastDate).format("DD/MM/YYYY"));
    console.log("Pendiente de carga: "+isUpdateData);
    /**En caso la ultima fecha insertada no es menor o igual a la fecha actual, no se realiza la actualizacion de la DB**/
    if (!isUpdateData){ return "No hay nuevos datos para actualizar, fecha de ultima carga: "+moment(productDB[0].date).format("YYYY-MM-DD")}

    /**Parametros para realizar query a la API de sisap**/
    let paramPrices = {
        start:moment(beforeLastDate).format("DD/MM/YYYY"),//"01/01/1997"
        last:moment(today).format("DD/MM/YYYY"),//"02/02/2020",
        type:['precio_max'], //,'precio_prom','precio_min'
        product:"0633",
    };
    let sisapPrices = await getPricesSisap(paramPrices);
    let pricesResult = HtmlTableToJson.parse(sisapPrices)._results[0];
    let pricesResultClean = await clearData(pricesResult);
    console.log(pricesResultClean.length);
    let isCorrectInset = await inserDataDays(pricesResultClean);

    return isCorrectInset ? pricesResultClean:"err insert";

}

async function inserDataDays(valList){
    let batch = db.batch();
    let addCorrect = false;
    await valList.map(async (vl, ky) => {
        if (!vl.description) {
            let doc = db.collection('prices').doc();
            let crops_id = "BzgL14JQFRorQxPooJRb";//sandia
            let market_id = "3BeNPYEum6Wvw1z2dFHw"; //defauld
            let price_type_id = "AFuN7owOgTMIvwBzFNBG"; //max
            let date = "";
            if (vl.date && vl.date !==""){
                let mdate = moment(vl.date, "DD/MM/YYYY").toDate();
                date = admin.firestore.Timestamp.fromDate(mdate);
            }else { console.log("Sin fecha id: "+doc.id) }

            let price = 0.00;
            if (vl.price && vl.price !== ""){
                price = parseFloat(vl.price).toFixed(2);
            }else { console.log("Sin Precio id: "+doc.id) }

            let object = {
                crops_id: crops_id,
                date: date,
                id: doc.id,
                market_id: market_id,
                price: price,
                price_type_id: price_type_id,
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

    return addCorrect
}

async function clearData(listObjet){
    return await listObjet.map((vl, key)=> {
        if (key === 0) {
            vl.description = vl.Fecha;
            delete vl.Fecha;
        } else {
            vl.date = vl.Fecha;
            vl.price = vl.Sandia;
            delete vl.Fecha;
            delete vl.Sandia;
        }
        return vl;
    });
}

async function getLastProductDB(){
    let priceRef = await db.collection('prices').orderBy("date", "desc").limit(1);
    let lastPrice = await priceRef.get()
        .then(value => {
            let res = [];
            value.forEach(doc => {
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
    return pricesType.select("id","name","id_ref").get().then(value => {
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
    return agriculturalCrops.get().then(value => {
        let res = [];
        value.forEach(doc => {
            res.push(doc.data());
        });
        return  res
    }).catch(err => {
        console.log('Error getting documents', err);
    });
}

async function updateAllProductsDB(){
    let pricesTypeDB = await getPricesTypeDB();
    let agriculturalCropsDB = await getAgriculturalCropsDB();

    return {
        pricesType:pricesTypeDB,
        crops:agriculturalCropsDB
    }
}

exports[API_PREFIX] = functions.https.onRequest(app);
