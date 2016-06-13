import React from 'react';
//import '../../css/dealer/dealer_locator';
//require('../css/dealer/dealer_locator.scss');
//import 'style.css';
/*
class DealerMap extends React.Component {
    state = {
        zoom: 10
    };
    
    static propTypes = {
        initialCenter: React.PropTypes.objectOf(React.PropTypes.number).isRequired,
        mapRefName: React.PropTypes.string,
        googleMap: React.PropTypes.objectOf(google.maps.Map)
    }

    static defaultProps = {
        mapRefName: 'mapCanvas'
    }

    constructor(props) {
        super(props);
        this.mapRefName = props.mapRefName;
    }

    render() {
        return <div className="Gmap">
            <div className="UpdatedText">
                <p>Current Zoom: { this.state.zoom }</p>
            </div>
            <div className="GMap-canvas" ref={ this.props.mapRefName }>
            </div>
        </div>
    }

    componentDidMount() {
        // create the map, marker and infoWindow after the component has
        // been rendered because we need to manipulate the DOM for Google =(
        this.map = this.createMap()
        this.marker = this.createMarker()
        this.infoWindow = this.createInfoWindow()

        // have to define google maps event listeners here too
        // because we can't add listeners on the map until its created
        google.maps.event.addListener(this.map, 'zoom_changed', ()=> this.handleZoomChange())
    }

    // clean up event listeners when component unmounts
    componentDidUnMount() {
        google.maps.event.clearListeners(map, 'zoom_changed')
    }

    createMap() {
        let mapOptions = {
            zoom: this.state.zoom,
            center: this.mapCenter()
        }

        return new google.maps.Map(this.refs[this.props.mapRefName], mapOptions)
    }

    mapCenter() {
        return new google.maps.LatLng(
            this.props.initialCenter.lat,
            this.props.initialCenter.lng
        )
    }

    createMarker() {
        return new google.maps.Marker({
            position: this.mapCenter(),
            map: this.map
        })
    }

    createInfoWindow() {
        let contentString = "<div class='InfoWindow'>I'm a Window that contains Info Yay</div>"
        return new google.maps.InfoWindow({
            map: this.map,
            anchor: this.marker,
            content: contentString
        })
    }

    handleZoomChange() {
        this.setState({
            zoom: this.map.getZoom()
        })
    }
}

export default DealerMap;
    */  