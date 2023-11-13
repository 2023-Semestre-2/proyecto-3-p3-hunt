import React, { useEffect } from "react";
import { useState } from "react";
import LocationPicker from "../components/LocationPicker";
import { FaStar, FaRegStar } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
function CrearTour(props) {
    const navigate = useNavigate();

    const [user] = useState(props.user);
    const [selectedImages, setSelectedImages] = useState([]);
    const [charCount, setCharCount] = useState(0);
    const [addressCharCount, setAddressCharCount] = useState(0);
    const [formValues, setFormValues] = useState({
        name: "",
        images: {},
        description: "",
        ammenities: {
            isHotel: false,
            isRestaurant: false,
            isRiver: false,
            isBeach: false,
            isMountain: false,
            hasRanch: false,
            hasPool: false,
            hasBreakfast: false,
            hasBar: false,
            hasWifi: false,
            hasFireplace: false,
            hasParking: false,
            hasAirConditioner: false,
            hasGym: false,
            hasSpa: false,
            hasRoomService: false,
            hasGreatView: false,
            isAccessible: false,
            isPetFriendly: false,
            isFree: false
        },
        stars: "",
        location: {
            lat: "",
            lng: "",
            address: ""
        },

        contact: {
            phone: "",
            email: "",
            website: ""
        }
    });

    function setCoords(coords) {
        console.log("setLng");
        console.log(coords);
        setFormValues({
            ...formValues,
            location: { ...formValues.location, lng: coords.lng, lat: coords.lat }
        });

    }


    function handleSubmit(e) {
        e.preventDefault();
        console.log("CrearTour");

        if (true) {
            console.log(formValues);

            // Create a new FormData instance
            const formData = new FormData();

            // Check if the properties exist before appending
            if (user && user.idUser) formData.append('idUser', user.idUser);
            if (formValues.name) formData.append('name', formValues.name);
            if (formValues.description) formData.append('description', formValues.description);
            if (formValues.stars) formData.append('stars', formValues.stars);

            if (formValues.images) {
                for (let i = 0; i < formValues.images.length; i++) {
                    formData.append('images', formValues.images[i]);
                }
            }

            // Log the formData to see what's being sent
            for (var pair of formData.entries()) {
                console.log(pair[0] + ', ' + pair[1]);
            }

            fetch("http://localhost:3000/createTour", {
                method: "POST",
                body: formData,
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log(data);
                    if (data.code === 200) {
                        console.log("Tour creado");
                        fetch("http://localhost:3000/createContact", {
                            method: "POST",
                            body: JSON.stringify({
                                ...formValues.contact,
                                idTour: data.idTour
                            }),
                            headers: {
                                "Content-Type": "application/json",
                            },
                        })
                            .then((res) => res.json())
                            .then((data) => {
                                console.log(data);
                            });

                        fetch("http://localhost:3000/createLocation", {
                            method: "POST",
                            body: JSON.stringify({
                                ...formValues.location,
                                idTour: data.idTour
                            }),
                            headers: {
                                "Content-Type": "application/json",
                            },
                        })
                            .then((res) => res.json())
                            .then((data) => {
                                console.log(data);
                            });

                        fetch("http://localhost:3000/createAmenities", {
                            method: "POST",
                            body: JSON.stringify({
                                ...formValues.ammenities,
                                idTour: data.idTour
                            }),
                            headers: {
                                "Content-Type": "application/json",
                            },
                        })
                            .then((res) => res.json())
                            .then((data) => {
                                console.log(data);
                            });

                    } else {
                        console.log("Error al crear el tour");

                    }
                });
        }
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    }

    function handleChangeContact(e) {
        const { name, value } = e.target;
        setFormValues({ ...formValues, contact: { ...formValues.contact, [name]: value } });
    }

    function handleChangeAmenities(e) {
        const { id, checked } = e.target;
        setFormValues({ ...formValues, ammenities: { ...formValues.ammenities, [id]: checked } });
    }

    function handleChangeImages(e) {
        const { files } = e.target;
        setSelectedImages([...files]);
        setFormValues({ ...formValues, images: files });
    }

    const handleChangeCounter = (e) => {
        setCharCount(e.target.value.length);
    };

    const handleCancel = () => {
        navigate("/Home")
    };

    useEffect(() => {
        console.log(formValues);
    }
        , [formValues]);

    return (
        <div className="Create-tour">
            <h1 className="create-tour-title" >Crear Tour</h1>
            <form className="form-create-tour" onSubmit={handleSubmit} >
                <h2 >Información del lugar</h2>
                <div className="form-group">
                    <label htmlFor="name">Nombre del lugar</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        placeholder="Nombre"
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group ">
                    <label htmlFor="images">Fotos</label>
                    <input type="file"
                        className="upload-images-tour"
                        id="images"
                        accept="image/*"
                        multiple
                        onChange={handleChangeImages}
                    />
                    <label 
                        htmlFor="images" 
                        className="upload-images-tour-label"
                    >
                        Subir fotos
                    </label>
                    <Carousel
                        className=""
                        showArrows={true}
                        showStatus={false}
                        infiniteLoop={true}
                        swipeable={true}
                        dynamicHeight={true}
                        emulateTouch={true}
                        selectedItem={0}
                        transitionTime={1000}
                        swipeScrollTolerance={15}
                    >
                        {selectedImages.map((image, index) => (
                            <div key={index}>
                                <img className="selected-images" src={URL.createObjectURL(image)} alt="" />
                            </div>
                        ))}
                    </Carousel>
                </div>
                <div className="form-group">
                    <label htmlFor="description">Reseña</label>
                    <textarea
                        className="form-control"
                        id="description"
                        name="description"
                        placeholder="Escibe una reseña del lugar"
                        onChange={handleChangeCounter}
                        rows={7}
                        maxLength={500}
                    ></textarea>
                    <p className="char-counter">{charCount}/500</p>
                </div>
                <div className="form-group">
                    <label htmlFor="etiquetas">Etiquetas</label>
                    <div className="form-check-tags">
                        <div className="checkbox-group">
                            <input type="checkbox" className="form-check-input" id="isHotel" onChange={handleChangeAmenities} />
                            <label className="form-check-label" htmlFor="isHotel">Hotel</label>
                        </div>

                        <div className="checkbox-group">
                            <input type="checkbox" className="form-check-input" id="isRestaurant" onChange={handleChangeAmenities} />
                            <label className="form-check-label" htmlFor="isRestaurant">Restaurante</label>
                        </div>

                        <div className="checkbox-group">
                            <input type="checkbox" className="form-check-input" id="isRiver" onChange={handleChangeAmenities} />
                            <label className="form-check-label" htmlFor="isRiver">Río</label>
                        </div>

                        <div className="checkbox-group">
                            <input type="checkbox" className="form-check-input" id="isBeach" onChange={handleChangeAmenities} />
                            <label className="form-check-label" htmlFor="isBeach">Playa</label>
                        </div>

                        <div className="checkbox-group">
                            <input type="checkbox" className="form-check-input" id="isMountain" onChange={handleChangeAmenities} />
                            <label className="form-check-label" htmlFor="isMountain">Montaña</label>
                        </div>

                        <div className="checkbox-group">
                            <input type="checkbox" className="form-check-input" id="hasRanch" onChange={handleChangeAmenities} />
                            <label className="form-check-label" htmlFor="hasRanch">Rancho</label>
                        </div>

                        <div className="checkbox-group">
                            <input type="checkbox" className="form-check-input" id="hasPool" onChange={handleChangeAmenities} />
                            <label className="form-check-label" htmlFor="hasPool">Piscina</label>
                        </div>

                        <div className="checkbox-group">
                            <input type="checkbox" className="form-check-input" id="hasBreakfast" onChange={handleChangeAmenities} />
                            <label className="form-check-label" htmlFor="hasBreakfast">Desayuno</label>
                        </div>

                        <div className="checkbox-group">
                            <input type="checkbox" className="form-check-input" id="hasBar" onChange={handleChangeAmenities} />
                            <label className="form-check-label" htmlFor="hasBar">Bar</label>
                        </div>

                        <div className="checkbox-group">
                            <input type="checkbox" className="form-check-input" id="hasWifi" onChange={handleChangeAmenities} />
                            <label className="form-check-label" htmlFor="hasWifi">Wifi</label>
                        </div>

                        <div className="checkbox-group">
                            <input type="checkbox" className="form-check-input" id="hasFireplace" onChange={handleChangeAmenities} />
                            <label className="form-check-label" htmlFor="hasFireplace">Chimenea</label>
                        </div>

                        <div className="checkbox-group">
                            <input type="checkbox" className="form-check-input" id="hasParking" onChange={handleChangeAmenities} />
                            <label className="form-check-label" htmlFor="hasParking">Parqueo</label>
                        </div>

                        <div className="checkbox-group">
                            <input type="checkbox" className="form-check-input" id="hasAirConditioner" onChange={handleChangeAmenities} />
                            <label className="form-check-label" htmlFor="hasAirConditioner">Aire acondicionado</label>
                        </div>

                        <div className="checkbox-group">
                            <input type="checkbox" className="form-check-input" id="hasGym" onChange={handleChangeAmenities} />
                            <label className="form-check-label" htmlFor="hasGym">Gimnasio</label>
                        </div>

                        <div className="checkbox-group">
                            <input type="checkbox" className="form-check-input" id="hasSpa" onChange={handleChangeAmenities} />
                            <label className="form-check-label" htmlFor="hasSpa">Spa</label>
                        </div>

                        <div className="checkbox-group">
                            <input type="checkbox" className="form-check-input" id="hasRoomService" onChange={handleChangeAmenities} />
                            <label className="form-check-label" htmlFor="hasRoomService">Room service</label>
                        </div>

                        <div className="checkbox-group">
                            <input type="checkbox" className="form-check-input" id="hasGreatView" onChange={handleChangeAmenities} />
                            <label className="form-check-label" htmlFor="hasGreatView">Vista</label>
                        </div>

                        <div className="checkbox-group">
                            <input type="checkbox" className="form-check-input" id="isAccessible" onChange={handleChangeAmenities} />
                            <label className="form-check-label" htmlFor="isAccessible">Accesible</label>
                        </div>

                        <div className="checkbox-group">
                            <input type="checkbox" className="form-check-input" id="isPetFriendly" onChange={handleChangeAmenities} />
                            <label className="form-check-label" htmlFor="isPetFriendly">Pet friendly</label>
                        </div>

                        <div className="checkbox-group">
                            <input type="checkbox" className="form-check-input" id="isFree" onChange={handleChangeAmenities} />
                            <label className="form-check-label" htmlFor="isFree">Gratis</label>
                        </div>
                    </div>
                </div>
                
                <div className="form-group">
                    <label htmlFor="location">Ubicación</label>
                    <LocationPicker setCoords={setCoords} />

                </div>
                <div className="form-group">
                    <label htmlFor="address">Dirección</label>
                    <textarea
                        className="form-control"
                        id="address"
                        name="address"
                        rows="3"
                        maxLength={200}
                        placeholder="Escibe la dirección del lugar"
                        onChange={(e) => {
                            setAddressCharCount(e.target.value.length);
                            setFormValues({
                                ...formValues, location: {
                                    ...formValues.location, address: e.target.value
                                }
                            });
                        }}
                    ></textarea>
                    <p className="char-counter" >{addressCharCount}/200</p>
                </div>
                <div className="form-group row">
                    <label htmlFor="stars">
                        ¿Que tan bueno es este lugar?
                    </label>

                    <div className="star-picker" >
                        {[...Array(5)].map((_, i) => (
                            formValues.stars >= i + 1 ?
                                <FaStar
                                    className="star"
                                    key={i}
                                    name="stars"
                                    value={i + 1}
                                    onClick={() => handleChange({ target: { name: 'stars', value: i + 1 } })}
                                /> :
                                <FaRegStar
                                    className="reg-star"
                                    key={i}
                                    name="stars"
                                    value={i + 1}
                                    onClick={() => handleChange({ target: { name: 'stars', value: i + 1 } })}
                                />
                        ))}
                    </div>
                        
                
                </div>
                <h2>Información de contacto</h2>
                <div className="form-group">
                    <label htmlFor="phone">Teléfono</label>
                    <input type="tel"
                        className="form-control"
                        id="phone"
                        name="phone"
                        placeholder="Teléfono"
                        pattern="[1-9]{1}[0-9]{7}"
                        onChange={handleChangeContact}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Correo electrónico</label>
                    <input type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        placeholder="Correo electrónico"
                        onChange={handleChangeContact}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="website">Sitio web</label>
                    <input type="text"
                        className="form-control"
                        id="website"
                        name="website"
                        placeholder="Sitio web"
                        onChange={handleChangeContact}
                    />
                </div>

                <div className="buttons">
                    <button type="cancel" className="btn btn-secondary" onClick={handleCancel}>Cancelar</button>        
                    <button type="submit" className="btn btn-primary">Crear</button>
                </div>
            </form>
        </div >
    )

}

export default CrearTour;
