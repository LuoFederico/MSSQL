const express = require('express');
const app = new express();
const cors = require('cors');
app.use(new cors());


//Importo la classe per le chiamate al DB
const sqlUtils = require('./SqlUtils.js'); 

app.get('/', function (req, res) {
   //Per connettermi al DB uso il metodo statico sqlUtils.connect
   //Passo come parametro la funzione sqlUtils.makeSqlRequest che verrà lanciata 
   //se la connessione al DB avrà successo  
   sqlUtils.connect(req, res, sqlUtils.makeSqlRequest);
});
app.get('/ci_vettore/:foglio', function (req, res) {
    console.log(req.params.foglio);
    //richiamo il metodo che ottiene l'elenco dei vettori energetici
    sqlUtils.connect(req, res, sqlUtils.ciVettRequest);
 });

 app.get('/ci_geovettore/:lng/:lat/:r', function (req, res) {
    console.log(req.params);
    //richiamo il metodo che ottiene l'elenco dei vettori energetici
    sqlUtils.connect(req, res, sqlUtils.ciVettGeoRequest);
 });

 
app.get('/geogeom/:lng/:lat/:r', function (req, res) {
     //richiamo il metodo che ottiene l'elenco dei vettori energetici
     console.log(req.params);
    sqlUtils.connect(req, res, sqlUtils.geoGeomRequest);
 });



app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
