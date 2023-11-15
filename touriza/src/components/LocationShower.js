import React from 'react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

const LocationShower = ({ lat, lng }) => {
    const center = {
        lat: Number(lat),
        lng: Number(lng),
    };

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    });

    if (loadError) return "Error loading maps";
    if (!isLoaded) return "Loading Maps";

    return (
        <>
            <GoogleMap mapContainerClassName='location-shower-map' zoom={15} center={center}  >
                <Marker position={center} />
            </GoogleMap>
            <a href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`} target="_blank" rel="noreferrer">
                Ver en Google Maps
            </a>
        </>
    );
};

export default LocationShower;