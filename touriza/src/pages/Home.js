import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaStar, FaRegStar,FaBars } from 'react-icons/fa';

function Home() {
    const navigate = useNavigate();

    const [tours, setTours] = useState([]);
    const [filteredTours, setFilteredTours] = useState(tours);
    const [filters, setFilters] = useState({ stars: 1, type: [], amenities: [] });
    const [search, setSearch] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    useEffect(() => {
        fetch("http://localhost:3000/getToursPreviews", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setTours(data.tours);
                setFilteredTours(data.tours);
            })
            .catch((err) => {
                console.log(err);
            });
    }
        , []);



    const handleFilterChange = (event) => {
        if (event.target.type === 'checkbox') {
            if (event.target.checked) {
                setFilters(prevFilters => ({
                    ...prevFilters,
                    [event.target.name]: prevFilters[event.target.name]
                        ? [...prevFilters[event.target.name], event.target.value]
                        : [event.target.value]
                }));
            } else {
                setFilters(prevFilters => ({
                    ...prevFilters,
                    [event.target.name]: prevFilters[event.target.name].filter(value => value !== event.target.value)
                }));
            }
        } else {
            setFilters({ ...filters, [event.target.name]: event.target.value });
        }
    };

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
    };

    useEffect(() => {
        const filteredTours = tours.filter(tour =>
            (!filters.stars || tour.stars >= Number(filters.stars)) &&
            (filters.type.length === 0 || filters.type.some(type => tour.amenities && tour.amenities[type] === 1)) &&
            (filters.amenities.length === 0 || filters.amenities.some(amenity => tour.amenities && tour.amenities[amenity] === 1)) &&
            (!search || tour.name.toLowerCase().includes(search.toLowerCase()))
        );
        setFilteredTours(filteredTours);
    }, [tours, filters, search]);


    useEffect(() => {
        console.log(filteredTours);
    }, [filteredTours]);

    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    return (
        <div className="Home-page" >
            <div className="Home-header">
            <h1 className="page-title" >Tours</h1>
            <button aria-label="Desplegar filtros" className="burger-button" onClick={toggleFilters}>
                
                <FaBars />
            </button>
            </div>
            <div className="main-container">
            <section className={`filters ${showFilters ? 'show' : ''}`}>
                    
                    <h2 >Filtros</h2>
                    <div className="fieldSets">
                    <fieldset className="fieldset-estrellas" >
                        <legend>Estrellas:</legend>
                        <div>
                            {[...Array(5)].map((_, i) => (
                                filters.stars >= i + 1 ?
                                    <FaStar
                                        className="star"
                                        key={i}
                                        name="stars"
                                        value={i + 1}
                                        onClick={() => handleFilterChange({ target: { name: 'stars', value: i + 1 } })}
                                    /> :
                                    <FaRegStar
                                        className="reg-star"
                                        key={i}
                                        name="stars"
                                        value={i + 1}
                                        onClick={() => handleFilterChange({ target: { name: 'stars', value: i + 1 } })}
                                    />
                            ))} o más
                        </div>
                    </fieldset>
                    <fieldset>
                        <legend>Tipo:</legend>
                        <label>
                            <input type="checkbox" name="type" value="isBeach" onChange={handleFilterChange} />
                            Playa
                        </label>
                        <label>
                            <input type="checkbox" name="type" value="isMountain" onChange={handleFilterChange} />
                            Montaña
                        </label>
                        <label>
                            <input type="checkbox" name="type" value="isHotel" onChange={handleFilterChange} />
                            Hotel
                        </label>
                        <label>
                            <input type="checkbox" name="type" value="isRestaurant" onChange={handleFilterChange} />
                            Restaurante
                        </label>
                        <label>
                            <input type="checkbox" name="type" value="isRiver" onChange={handleFilterChange} />
                            Rio
                        </label>
                    </fieldset>
                    <fieldset>
                        <legend>Comodidades:</legend>
                        <label>
                            <input type="checkbox" name="amenities" value="isFree" onChange={handleFilterChange} />
                            Gratis
                        </label>
                        <label>
                            <input type="checkbox" name="amenities" value="hasAirConditioner" onChange={handleFilterChange} />
                            Aire acondicionado
                        </label>
                        <label>
                            <input type="checkbox" name="amenities" value="hasBar" onChange={handleFilterChange} />
                            Bar
                        </label>
                        <label>
                            <input type="checkbox" name="amenities" value="hasBreakfast" onChange={handleFilterChange} />
                            Desayuno incluido
                        </label>
                        <label>
                            <input type="checkbox" name="amenities" value="hasFireplace" onChange={handleFilterChange} />
                            Chimenea
                        </label>
                        <label>
                            <input type="checkbox" name="amenities" value="hasGreatView" onChange={handleFilterChange} />
                            Gran vista
                        </label>
                        <label>
                            <input type="checkbox" name="amenities" value="hasGym" onChange={handleFilterChange} />
                            Gimnasio
                        </label>
                        <label>
                            <input type="checkbox" name="amenities" value="hasParking" onChange={handleFilterChange} />
                            Estacionamiento
                        </label>
                        <label>
                            <input type="checkbox" name="amenities" value="hasPool" onChange={handleFilterChange} />
                            Piscina
                        </label>
                        <label>
                            <input type="checkbox" name="amenities" value="hasRanch" onChange={handleFilterChange} />
                            Rancho
                        </label>
                        <label>
                            <input type="checkbox" name="amenities" value="hasRoomService" onChange={handleFilterChange} />
                            Servicio a la habitación
                        </label>
                        <label>
                            <input type="checkbox" name="amenities" value="hasSpa" onChange={handleFilterChange} />
                            Spa
                        </label>
                        <label>
                            <input type="checkbox" name="amenities" value="hasWifi" onChange={handleFilterChange} />
                            Wifi
                        </label>
                        <label>
                            <input type="checkbox" name="amenities" value="isPetFriendly" onChange={handleFilterChange} />
                            Pet friendly
                        </label>
                        <label>
                            <input type="checkbox" name="amenities" value="isAccesible" onChange={handleFilterChange} />
                            Accesible
                        </label>
                    </fieldset>
                    </div>
                </section>
                <section className="tours">
                    <form className="search-form" onSubmit={e => e.preventDefault()}>
                        <input aria-label="Buscar tours" type="text" className="search-input" placeholder="Buscar..." value={search} onChange={handleSearchChange} />
                        <button type="submit" className="search-btn">
                            Buscar
                            < i className="fi fi-rr-search"></i>
                        </button>
                    </form>
                    {filteredTours.length > 0 ? (
                        filteredTours.map((tour) => (
                        <article className="tour-prev" key={tour.idTour}
                            onClick={() => {
                                navigate(`/Tour/${tour.idTour}`, { state: { tour } });
                            }}>
                            {/** get image from public uploads tours */}
                            <img
                                className="tour-img"
                                src={`${process.env.PUBLIC_URL}/uploads/tours/${tour.image}`}
                                alt={`Portada ${tour.name}`} />
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

export default Home;


