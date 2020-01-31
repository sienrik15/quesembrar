/* eslint-disable promise/always-return,consistent-return */
const admin = require('firebase-admin');
const functions = require('firebase-functions');
const express = require("express");
const axios = require('axios')
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

createContry = async () => {
    let citiesRef = db.collection('cities');

    let setSf = citiesRef.doc('SF').set({
        name: 'San Francisco', state: 'CA', country: 'USA',
        capital: false, population: 860000,
        regions: ['west_coast', 'norcal']
    });
    let setLa = citiesRef.doc('LA').set({
        name: 'Los Angeles', state: 'CA', country: 'USA',
        capital: false, population: 3900000,
        regions: ['west_coast', 'socal']
    });
    let setDc = citiesRef.doc('DC').set({
        name: 'Washington, D.C.', state: null, country: 'USA',
        capital: true, population: 680000,
        regions: ['east_coast']
    });
    let setTok = citiesRef.doc('TOK').set({
        name: 'Tokyo', state: null, country: 'Japan',
        capital: true, population: 9000000,
        regions: ['kanto', 'honshu']
    });
    let setBj = citiesRef.doc('BJ').set({
        name: 'Beijing', state: null, country: 'China',
        capital: true, population: 21500000,
        regions: ['jingjinji', 'hebei']
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

getPrecios = async (tipe) => {
    let response = await axios.post('http://sistemas.minagri.gob.pe/sisap/portal2/mayorista/resumenes/filtrar',
        querystring.stringify({
            mercado: '*',
            'variables[]': tipe,
            fecha: '24/01/2020',
            desde: '01/01/2020',//1997
            hasta: '24/01/2020',
            'anios[]': '2020',
            'meses[]': '11',
            'semanas[]': '48',
            //'productos[]': '0633',
            'productos[]': '0633',
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

app.get('/api-user', (req, res) => {
    const hours = (new Date().getHours() % 12) + 1 // London is UTC + 1hr;
    res.status(200).send(`<!doctype html>
    <head>
      <title>Time</title>
    </head>
    <body>
        <h1>Hola Mundo - primer cloud funtion</h1>
      ${'BONG '.repeat(hours)}
    </body> 
  </html>`);
});

app.get('/', async (req, res) => {
    res.send("Hola mundo")
});

app.get('/prod-all', async (req, res) => {
    //deletefilevalue();
    //let delet = await deleteCollection(db, 'cities', 100);

    let response = await getPrecios(['precio_max']);//,'precio_prom','precio_min'
    res.send(HtmlTableToJson.parse(response)._results)
    //createContry();

    /*let citiesRef = await db.collection('cities');
    //let queryRef = await citiesRef.where('state', '==', 'CA');
    let queryRef = citiesRef.where('capital', '==', true);
    let respons = await queryRef.get()
        .then((snapshot) => {
            let data = [];
            snapshot.forEach((doc) => { data.push(doc.data()); });
            return data;
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        });
    res.send(respons);*/

    //res.send(html2json(response));
});

app.get('/read',async (req, res) => {
    //Obtener lista de coleccion en un documento
    /*let sfRef = db.collection('lima_market').doc('watermelon');
    sfRef.listCollections().then(value => {
        value.forEach(collection => {
            console.log('Found subcollection with id:', collection.id);
        });
    }).catch(err=> {
        console.log('Error getting documents', err);
    });*/

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
    insertData()
    let citiesRef = db.collection('prices');
    let allCities = await citiesRef.get()
        .then(value => {
            let res = [];
            value.forEach(doc => {
                res.push(doc.data());
                console.log(doc.id, '=>', doc.data());
            });
            return  res
        }).catch(err => {
            console.log('Error getting documents', err);
        });

    res.json(allCities);


});

function insertData(){

    let crops_id = "BzgL14JQFRorQxPooJRb";//sandia
    let date = "";
    let id = "";
    let market_id = "3BeNPYEum6Wvw1z2dFHw"; //defauld
    let price = 0.0;
    let price_type_id = "AFuN7owOgTMIvwBzFNBG" //max

    let pricesTb = db.collection('prices').doc();
    let object = {
        crops_id:crops_id,
        date:date,
        id:pricesTb.id,
        market_id:market_id,
        price:price,
        price_type_id:price_type_id,
    };

    pricesTb.set(object).then(ref => {
        console.log('Added document with ID: ', ref);
    }).catch(err=>{
        console.log(err)
    });
}

exports[API_PREFIX] = functions.https.onRequest(app);
