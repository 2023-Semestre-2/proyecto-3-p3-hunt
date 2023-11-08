import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Favourites() {
    const navigate = useNavigate();

    const [tours, setTours] = useState([]);

    useEffect(() => {
        fetch("http://localhost:3000/getToursPreviewsFav", {
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
        <div>
            <h1>Home</h1>
            <section className="tours">
                {tours.map((tour) => (
                    <article className="tour" key={tour.idTour} style={{border:'1px solid #000'}} 
                        onClick={() => { 
                            navigate(`/Tour/${tour.idTour}`, { state: { tour } }); 
                            }
                        }>
                        <h2>{tour.name}</h2>
                        {/** get image from public uploads tours */}
                        <img 
                            style={{width:'100px'}}
                            src={`${process.env.PUBLIC_URL}/uploads/tours/${tour.image}`} 
                            alt={tour.name} />
                        <p>{tour.description}</p>
                        <p>{tour.stars}</p>
                    </article>
                ))}
            </section>
        </div>
    );
    }
    
export default Favourites;
