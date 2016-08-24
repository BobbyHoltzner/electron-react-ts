import * as React from 'react';
import {render} from 'react-dom';
import { Map, TileLayer } from 'react-leaflet';

type Props = {

};

type State = {
  lat: number,
  lng: number,
  zoom: number,
}

export default class App extends React.Component<Props, State> {
  constructor() {
    super();
    this.state = {
      lat: 37.889231,
      lng:  -76.81030,
      zoom: 16,
    };
  }

  render() {
    const position = [this.state.lat, this.state.lng];
    return (
      <Map center={position} zoom={this.state.zoom}>
        <TileLayer
          url='http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'
           maxZoom={20}
           subdomains={['mt0','mt1','mt2','mt3']}
        />
      </Map>
    );
  }
}

render(<App />, document.getElementById('app'));
