import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import GeoJSON from 'ol/format/GeoJSON';
import VectorSource from 'ol/source/Vector';
import { Circle as CircleStyle, Fill, Stroke, Style, Text } from 'ol/style';
import geojsonObject from './marsLandingSites.json';
import XYZ from 'ol/source/XYZ';

// Points Style
const pointStyleFunction = (feature, resolution) => {
  return new Style({
    image: new CircleStyle({
      radius: 10,
      fill: new Fill({ color: 'rgba(255, 0, 0, 0.5)' }),
      stroke: new Stroke({ color: 'red', width: 1 })
    }),
    text: new Text({
      text: feature.get('name'),
      font: 'bold 16px Open Sans',
      fill: new Fill({
        color: '#fff'
      }),
      stroke: new Stroke({
        color: 'red',
        width: 1
      }),
      offsetY: -16,
      offsetX: 16,
      textAlign: 'left',
      textBaseline: 'middle'
    })
  });
};

// Mars Vector Layer
var marsData = new VectorSource({
  projection: 'EPSG:4326',
  features: new GeoJSON().readFeatures(geojsonObject),
  wrapX: false
});
var marsLayer = new VectorLayer({
  source: marsData,
  style: pointStyleFunction,
  declutter: false
});

// Basemap Layer
// https://astrowebmaps.wr.usgs.gov/webmapatlas/Layers/maps.html
// OpenPlanetary Basemaps : https://www.openplanetary.org/opm/basemaps
const layers = [
  new TileLayer({
    source: new XYZ({
      url: 'http://s3-eu-west-1.amazonaws.com/whereonmars.cartodb.net/celestia_mars-shaded-16k_global/{z}/{x}/{-y}.png',
      wrapX: false
    }),
    projection: 'EPSG:4326'
  }),
  marsLayer
];

// Create Map
const map = new Map({
  layers: layers,
  target: 'map',
  view: new View({
    projection: 'EPSG:4326',
    center: [0, 0]
  })
});

// Zoom to features
let extent = marsData.getExtent();
map.getView().fit(extent, map.getSize());
