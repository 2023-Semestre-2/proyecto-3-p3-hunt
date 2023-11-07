import React, { useEffect } from 'react'
import { GoogleMap, Marker, useLoadScript, StandaloneSearchBox } from '@react-google-maps/api';

const containerStyle = {
  width: '800px',
  height: '400px'
};

const libraries = ["places"];

function LocationPicker( props) {
  console.log(props)
  const { isLoaded, loadError } = useLoadScript({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries
  })

  const [map, setMap] = React.useState(null)
  const [marker, setMarker] = React.useState(null);
  const [searchBox, setSearchBox] = React.useState(null);


  const onMapClick = React.useCallback((event) => {
    console.log(event.latLng.lat());
    console.log(event.latLng.lng());
    
    setMarker({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
    
  }, []);

  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(function(position) {
        setMarker({
            lat: position.coords.latitude,
            lng: position.coords.longitude
        });
      });
  }

  const onPlacesChanged = () => {
    const places = searchBox.getPlaces();
    if (places.length === 0) return;

    const place = places[0];
    setMarker({
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    });
  };

  const onLoad = React.useCallback(function callback(map) {
    getCurrentLocation();
    const bounds = new window.google.maps.LatLngBounds(marker);
    map.fitBounds(bounds);
    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  useEffect(() => {
    if (marker) {
      props.setCoords(marker);
    }
  }, [marker])

  return isLoaded ? (
    <div>
      <StandaloneSearchBox onLoad={ref => setSearchBox(ref)} onPlacesChanged={onPlacesChanged}>
        <input type="text" placeholder="Search location" />
      </StandaloneSearchBox>
      <GoogleMap
        mapContainerStyle={{ width: '800px', height: '400px' }}
        zoom={15}
        center={marker}
        onClick={onMapClick}
        onLoad={onLoad}
        onUnmount={onUnmount}

      >
        {marker && <Marker position={marker} />}
      </GoogleMap>
    </div>
  ) : <></>
}

export default React.memo(LocationPicker)