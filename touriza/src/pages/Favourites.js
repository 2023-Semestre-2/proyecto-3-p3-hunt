import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaStar, FaRegStar } from 'react-icons/fa';

function Favourites() {
    const navigate = useNavigate();

    const [tours, setTours] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:3000/getToursPreviewsFav/${JSON.parse(localStorage.getItem('user')).idUser}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            setTours(data.tours);
        })
        .catch((err) => {
            console.log(err);
        });
    }
    , []);

    return (
        <div className="Favourites-page" >
            <h1 className="page-title" >Mis Favoritos</h1>
            <div className="main-container">
            <section className="tours">
                    {tours.length > 0 ? (
                        tours.map((tour) => (
                        <article   className="tour-prev" key={tour.idTour} tabIndex="0" aria-label={`Tour: ${tour.name}`}
                            onClick={() => {
                                navigate(`/Tour/${tour.idTour}`, { state: { tour } });
                            }}
                            onKeyPress={(event) => {
                                if (event.key === 'Enter') {
                                    navigate(`/Tour/${tour.idTour}`, { state: { tour } });
                                }
                            }}
                            
                            >
                            {/** get image from public uploads tours */}
                            <img
                                className="tour-img"
                                src={`${process.env.PUBLIC_URL}/uploads/tours/${tour.image}`}
                                alt={tour.name} />
                            <div className="tour-info">
                                <div className="tour-header">
                                    <h2 className="tour-name">{tour.name}</h2>
                                    <div className="tour-stars">
                                        {[...Array(5)].map((star, index) => {
                                            return index < tour.stars ? (
                                                <FaStar key={index} className="star" />
                                            ) : (
                                                <FaRegStar key={index} className="reg-star" />
                                            );
                                        })}
                                    </div>
                                </div>
                                <p className="tour-description">
                                    {tour.description.length > 300 ? tour.description.substring(0, 300) + "..." : tour.description}
                                </p>
                            </div>
                        </article>
                    ))
                    ) : (
                        <h2 className="no-tours" >No se encontraron tours</h2>
                    )}
                </section>
            </div>
        </div>
    );
    }
    
export default Favourites;
