import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileWMS from 'ol/source/TileWMS';
import proj4 from 'proj4';
import Projection from 'ol/proj/Projection';
import { register } from 'ol/proj/proj4';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import GeoJSON from 'ol/format/GeoJSON';
import VectorSource from 'ol/source/Vector';
import { Circle as CircleStyle, Fill, Stroke, Style, Text } from 'ol/style';
import geojsonObject from './marsLandingSites.json'

// Mars 2000
// https://spatialreference.org/ref/iau2000/mars-2000/
/* proj4.defs(
  'EPSG:49900',
  'GEOGCS["Mars 2000",DATUM["D_Mars_2000",SPHEROID["Mars_2000_IAU_IAG",3396190.0,169.89444722361179]],PRIMEM["Greenwich",0],UNIT["Decimal_Degree",0.0174532925199433]]'
);
register(proj4);

const projection = new Projection({
  code: 'EPSG:49900',
  extent: [-180.0, -90.0, 180.0, 90.0],
  units: 'degrees',
  getPointResolution: function (r) {
    return r;
  }
}); */

// Points
function pointStyleFunction(feature, resolution) {
  return new Style({
    image: new CircleStyle({
      radius: 10,
      fill: new Fill({ color: 'rgba(255, 0, 0, 0.5)' }),
      stroke: new Stroke({ color: 'red', width: 1 })
    }),
    text: new Text({
      text: feature.get('name'),
      font: 'bold 11px "Open Sans"',
      fill: new Fill({
        color: '#fff'
      }),
      stroke: new Stroke({
        color: 'red',
        width: 1
      }),
      offsetY: -15,
      offsetX: 16,
      textAlign: 'left',
      textBaseline: 'middle'
    })
  });
}

// Mars Vector Layer
var marsData = new VectorSource({
  projection: 'EPSG:4326',
  features: new GeoJSON().readFeatures(geojsonObject),
  wrapX: false
});
var marsLayer = new VectorLayer({
  source: marsData,
  style: pointStyleFunction
});

// Basemap Layer
// https://astrowebmaps.wr.usgs.gov/webmapatlas/Layers/maps.html
// https://planetarymaps.usgs.gov/cgi-bin/mapserv?map=/maps/mars/mars_simp_cyl.map&service=WMS&request=GetCapabilities
// OpenPlanetary Basemaps : https://www.openplanetary.org/opm/basemaps
const layers = [
  new TileLayer({
    source: new TileWMS({
      url: 'https://planetarymaps.usgs.gov/cgi-bin/mapserv?map=/maps/mars/mars_simp_cyl.map',
      params: { LAYERS: 'MDIM21_color' },
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
