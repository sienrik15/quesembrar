const admin = require('firebase-admin');
const functions = require('firebase-functions');
const express = require("express");
const cors = require('cors');
const path = require('path');
const history = require('connect-history-api-fallback');
const CronJob = require('cron').CronJob;


admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
db.settings({ timestampsInSnapshots: true });



const job = new CronJob('0 0 9 * * 1-6', function() {
//const job = new CronJob('*/5 * * * * *', function() {
    const d = new Date();
    const aTuringRef = db.collection('users').doc('meseta');
    const setAlan = aTuringRef.set({
        'first': 'Sam',
        'middle': 'Mathison',
        'last': 'Turing',
        'born': d
    });

}, function() {
    // Código a ejecutar cuando la tarea termina.
    // Puedes pasar null para que no haga nada
}, true);
job.start();


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
const app = express();
const app2 = express();
app.use(cors({origin: '*'}));
//app.use(history());
app2.use(cors({origin: '*'}));

app2.get('/api-user', (req, res) => {
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
app.use('/services', app2);


app.get('**', (req, res) => {
    //console.log(path.join(__dirname, '../dist/index.html'));
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});


exports.app = functions.https.onRequest(app);
