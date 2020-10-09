import { Component, OnInit } from '@angular/core';
import { Lugar, ResponseMarkers } from '../../interfaces/interfaces';

import * as mapboxgl from 'mapbox-gl';
import { ServiceMapService } from '../../services/service-map.service';
import { WebsocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  map: mapboxgl.Map;
  // lugares: Lugar[] = [];
  lugares: ResponseMarkers = {};
  markerMapBox: { [key: string]: mapboxgl.Marker } = {};

  constructor( private serviceMap: ServiceMapService, private wsService: WebsocketService) { }

  ngOnInit(): void {

    this.serviceMap.getDataMap().subscribe( (res: ResponseMarkers) => {
      this.lugares = res;
      this.createMap();
    });

    this.listenSockets();
  }

  listenSockets(){

    // marcador-nuevo
    this.wsService.listen('marcador-nuevo').subscribe( ( marker: Lugar ) => this.addMarker( marker ) );

    // marcador-mover
    this.wsService.listen('marcador-mover').subscribe( ( marker: Lugar ) => {
      this.markerMapBox[marker.id].setLngLat([marker.lng, marker.lat]);
    });

    // marcador-borrar
    this.wsService.listen('marcador-borrar').subscribe( ( id: string ) => {
      this.markerMapBox[id].remove();
      delete this.markerMapBox[id];
    });
  }

  createMap(){
    (mapboxgl as any).accessToken = 'pk.eyJ1IjoieWFjLW1jIiwiYSI6ImNrZzFncWU4ODAybHAycHRjeTNhdWRsYmcifQ.aQdrSHGreFThDalFXVUyoQ';

    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-75.75512993582937, 45.349977429009954],
      zoom: 15.8
    });

    for (const [id, marker] of Object.entries(this.lugares)) {
      this.addMarker(marker);
    }

  }

  addMarker(marcador: Lugar){

    const h2 = document.createElement('h2');
    h2.innerText = marcador.nombre;

    const btnDelete = document.createElement('button');
    btnDelete.innerText = 'Borrar';

    const div = document.createElement('div');
    div.append(h2, btnDelete);

    const customPopup = new mapboxgl.Popup({
      offset: 25,
      closeOnClick: false
    }).setDOMContent(div);

    const marker = new mapboxgl.Marker({
      draggable: true,
      color: marcador.color
    })
    .setLngLat( [marcador.lng, marcador.lat] )
    .setPopup( customPopup )
    .addTo( this.map );

    marker.on('drag', () => {

      const lngLat = marker.getLngLat();

      const nuevoMarker = {
        id: marcador.id,
        ...lngLat
      }

      this.wsService.emit('marcador-mover', nuevoMarker );

    });

    btnDelete.addEventListener('click', () => {

      marker.remove();

      this.wsService.emit('marcador-borrar', marcador.id);

    });

    this.markerMapBox[ marcador.id ] = marker;

  }

  createMarker(){

    const customMarker: Lugar = {
      id: new Date().toISOString(),
      lng: -75.75512993582937,
      lat: 45.349977429009954,
      nombre: 'sin-nombre',
      color: '#' + Math.floor(Math.random() * 16777215).toString(16)
    };

    this.addMarker( customMarker );

    this.wsService.emit('marcador-nuevo', customMarker );

  }

}
