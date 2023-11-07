import React, {useState, useEffect} from "react";
import { useLocation } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { GoogleMap, Marker, useLoadScript, StandaloneSearchBox } from '@react-google-maps/api';
import LocationShower from "../components/LocationShower";
function Tour() {

    const location = useLocation();
    const tour = location.state.tour;
    const [images, setImages] = React.useState([]);
    const [contact, setContact] = React.useState([]);
    const [locationTour, setLocationTour] = React.useState([]);


    useEffect(() => {
        fetch(`http://localhost:3000/getImagesTour/${tour.idTour}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            setImages(data.images);
        })
        .catch((err) => {
            console.log(err);
        });

        fetch(`http://localhost:3000/getContactTour/${tour.idTour}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            setContact(data.contact);
        })

        fetch(`http://localhost:3000/getLocationTour/${tour.idTour}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            setLocationTour(data.location);
        })
        .catch((err) => {
            console.log(err);
        });

    }, []);


    useEffect(() => {
        console.log(locationTour);
    }
    , [locationTour]);

    return (
        <div>
            <h1>Tour</h1>
            <section className="tour" key={tour.idTour} style={{border:'1px solid #000'}}>
                <h2>{tour.name}</h2>
                {/** get image from public uploads tours */}
                <Carousel 
                    showArrows={true}
                    showThumbs={false}
                    showStatus={false}
                    infiniteLoop={true}
                    swipeable={true}
                    dynamicHeight={true}
                    emulateTouch={true}
                    selectedItem={0}
                    transitionTime={1000}
                    swipeScrollTolerance={5}
                    >
                    
                    {images.map((image) => (
                        <div>
                            <img 
                                style={{width:'300px'}}
                                src={`${process.env.PUBLIC_URL}/uploads/tours/${image.picture}`} 
                                alt={tour.name} />
                        </div>
                    ))}
                </Carousel>
                
                <p>{tour.description}</p>
                <p>{tour.stars}</p>
            </section>
            <aside className="ubicacion" key={tour.idTour} style={{border:'1px solid #000'}}>
                <h2>Ubicacion</h2>
                <LocationShower lat={locationTour.lat} lng={locationTour.lng} />
                <p>{locationTour.lat}</p>
                <p>{locationTour.lng}</p>
                <p>{locationTour.address}</p>

                <h2>Contacto</h2>
                <p>{contact.email}</p>
                <p>{contact.phone}</p>
                <p>{contact.website}</p>

            </aside>

        </div>
    );
    }

export default Tour;