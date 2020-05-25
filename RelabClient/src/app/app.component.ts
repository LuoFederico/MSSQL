import { Component, OnInit } from '@angular/core';
import { GeoFeatureCollection } from './models/geojson.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ci_vettore } from './models/ci_vett.model';
import { Marker } from './models/marker.model';
import { MouseEvent } from '@agm/core';
@Component({
 selector: 'app-root',
 templateUrl: './app.component.html',
 styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
 title = 'ang-maps';


 circleLat : number = 0; //Latitudine e longitudine iniziale del cerchio
 circleLng: number = 0;
 maxRadius: number = 400; //Voglio evitare raggi troppo grossi
 radius : number = this.maxRadius;

 zoom: number = 12;
 fillColor: string = "#FF0000"; //Colore delle zone catastali
 lng: number = 9.205331366401035;
 lat: number = 45.45227445505016;
 obsCiVett : Observable<Ci_vettore[]>;
 geoJsonObject: GeoFeatureCollection; //Oggetto che conterrà il vettore di GeoJson
 obsGeoData: Observable<GeoFeatureCollection>;
 markers: Marker[];
 constructor(public http: HttpClient) {
 //Facciamo iniettare il modulo HttpClient dal framework Angular (ricordati di importare la libreria)
 }
 //Metodo che scarica i dati nella variabile geoJsonObject
 prepareData = (data: GeoFeatureCollection) => {
 this.geoJsonObject = data
 console.log( this.geoJsonObject );
 }
 //Una volta che la pagina web è caricata, viene lanciato il metodo ngOnInit scarico i dati
 //dal server
 ngOnInit() {
    this.obsGeoData = this.http.get<GeoFeatureCollection>("https://3000-a568cba0-5af4-446b-95b2-16e194be2736.ws-eu01.gitpod.io/");
    this.obsGeoData.subscribe(this.prepareData);
 }
 styleFunc = (feature) => {
 return ({
 clickable: false,
 fillColor: this.fillColor,
 strokeWeight: 1
 });
 }
  cambiaFoglio(foglio) : boolean{
    let val = foglio.value;
    this.obsCiVett = this.http.get<Ci_vettore[]>(`https://3000-a568cba0-5af4-446b-95b2-16e194be2736.ws-eu01.gitpod.io/ci_vettore/${val}`); //fa una richiesta di tipo ci_Vettore all'URL
    this.obsCiVett.subscribe(this.prepareCiVettData); //quando riceve i dati lancia il metodo prepareCiVettData
    console.log(val);
    return false;
  }


 prepareCiVettData = (data: Ci_vettore[]) =>
 {
    let latTot = 0;
    let lngTot = 0;
    console.log(data);
    this.markers = [];
    for (const iterator of data) { //Per ogni oggetto del vettore creoa un Marker
      let m = new Marker(iterator.WGS84_X,iterator.WGS84_Y,iterator.CI_VETTORE);
      latTot += m.lat;
      lngTot += m.lng;
      this.markers.push(m);
    }
    this.lng = lngTot/data.length;//faccio la media della longitudine
    this.lat = latTot/data.length;
    this.zoom = 16;
  }


   mapClicked($event: MouseEvent) {
      this.circleLat = $event.coords.lat; // le coordinate cliccate
      this.circleLng = $event.coords.lng; //Sposto il centro del cerchio qui
      this.lat = this.circleLat; //Sposto il centro della mappa qui
      this.lng = this.circleLng;
      this.zoom = 15; //Zoom sul cerchio
 }
 //Aggiungi il gestore del metodo radiusChange
  circleRedim(newRadius : number){
    console.log(newRadius) //posso leggere sulla console il nuovo raggio
    this.radius = newRadius; //Ogni volta che modifico il cerchio, ne salvo il raggio
 }

  circleDoubleClicked(circleCenter){
    let raggioInGradi = (this.radius * 0.00001)/1.1132;
//Posso riusare lo stesso observable e lo stesso metodo di gestione del metodo
//cambiaFoglio poichè riceverò lo stesso tipo di dati
//Divido l'url andando a capo per questioni di leggibilità non perchè sia necessario
 this.obsCiVett = this.http.get<Ci_vettore[]>(`https://3000-a568cba0-5af4-446b-95b2-16e194be2736.ws-eu01.gitpod.io/ci_geovettore/
 ${this.circleLat}/
 ${this.circleLng}/
 ${raggioInGradi}`);
 this.obsCiVett.subscribe(this.prepareCiVettData);

    console.log(circleCenter); //Voglio ottenere solo i valori entro questo cerchio
    console.log(this.radius);
    this.circleLat = circleCenter.coords.lat; //Aggiorno le coordinate del cerchio
    this.circleLng = circleCenter.coords.lng; //Aggiorno le coordinate del cerchio
    if(this.radius > this.maxRadius){
      console.log("area selezionata troppo vasta sarà reimpostata a maxRadius");
      this.radius = this.maxRadius;
    }
 console.log ("raggio in gradi " + (this.radius * 0.00001)/1.1132)
 //Voglio spedire al server una richiesta che mi ritorni tutte le abitazioni all'interno del cerchio
 }



}




