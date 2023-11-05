import React from 'react'
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
  width: '800px',
  height: '400px'
};


function LocationPicker() {
    const [center, setCenter] = React.useState({
        lat: 0,
        lng: 0
    });
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "volver a poner api"
  })

  const [map, setMap] = React.useState(null)

  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(function(position) {
        setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude
        });
      });
  }


  const onLoad = React.useCallback(function callback(map) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    getCurrentLocation();
    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  return isLoaded ? (
    
      <GoogleMap
        mapContainerStyle={containerStyle}
        //get current location
        center={center}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={(e) => {
            console.log(e.latLng.lat());
            console.log(e.latLng.lng());
            setCenter({
                lat: e.latLng.lat(),
                lng: e.latLng.lng()
            });
        }

        }
      >
        <Marker position={center} />
        <></>
      </GoogleMap>
  ) : <></>
}

export default React.memo(LocationPicker)