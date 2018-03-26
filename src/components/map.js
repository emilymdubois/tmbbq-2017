import React from 'react';
import { connect } from 'react-redux';
import mapboxgl from 'mapbox-gl';
import data from '../data';
import { setActiveId } from '../redux/action_creators';
import _ from 'lodash';

mapboxgl.accessToken = 'pk.eyJ1IjoiZW1pbHltZHVib2lzIiwiYSI6ImNqZjVmcDJmbzB2M3gzM3FoNDdrc2k0czAifQ.FjkIvd3yOZyHDJ6Poj6aAg';

let Map = class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeId: null,
      validIds: [...Array(50).keys()].map(e => e.toString())
    };
  }

  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/light-v9',
      center: [-98.5, 31],
      zoom: this.props.zoom
    });

    this.map.on('load', () => {
      this.map.addSource('places', {
        type: 'geojson',
        data: data
      });

      this.map.addLayer({
        id: 'places',
        type: 'circle',
        source: 'places',
        paint: {
          'circle-color': '#333f48',
          'circle-opacity': 0.3,
          'circle-radius': 5,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#333f48'
        }
      });
    });

    this.map.on('mouseenter', 'places', () => {
      this.map.getCanvas().style.cursor = 'pointer';
    });

    this.map.on('click', event => {
      const features = this.map.queryRenderedFeatures(event.point, {
        layers: ['places']
      });
      const activeId = features.length ? features[0].properties.id : null;
      this.setState({ activeId });
      this.props.setActiveId(activeId);
    });

    this.map.on('mouseleave', 'places', () => {
      this.map.getCanvas().style.cursor = '';
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.activeId && this.state.activeId !== nextProps.activeId) {
      this.setState({ activeId: nextProps.activeId });
    }

    if (nextProps.validIds && !_.isEqual(this.state.validIds, nextProps.validIds)) {
      this.setState({ validIds: nextProps.validIds })
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.activeId !== nextState.activeId || !_.isEqual(this.state.validIds, nextState.validIds)) return true;
    return false;
  }

  componentDidUpdate() {
    let { activeId, validIds } = this.state;
    if (!activeId) activeId = '-1';
    if (!validIds.length) validIds = ['-1'];

    const colorCondition = ['match', ['get', 'id'], activeId, '#bf5700', '#333f48'];
    const radiusCondition = ['match', ['get', 'id'], activeId, 10, 5];

    this.map.setPaintProperty('places', 'circle-color', colorCondition);
    this.map.setPaintProperty('places', 'circle-stroke-color', colorCondition);
    this.map.setPaintProperty('places', 'circle-radius', radiusCondition);
    this.map.setFilter('places', ['match', ['get', 'id'], validIds, true, false]);
  }

  render() {
    const { classes} = this.props;
    return (
      <div className={classes}>
        <div ref={el => this.mapContainer = el} className="w-full h-full"></div>
      </div>
    );
  }
}

const mapStateToProp = state => {
  return {
    activeId: state.activeId,
    validIds: state.validIds
  }
}

const mapDispatchToProps = {
  setActiveId
};

Map = connect(mapStateToProp, mapDispatchToProps)(Map);

export { Map };
