import React, { useEffect } from "react";
import { useState } from "react";
import LocationPicker from "../components/LocationPicker";
function CrearTour(props) {
    const [user] = useState(props.user);

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
        location:{
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

    function setCoords(coords){
        console.log("setLng");
        console.log(coords);
        setFormValues({ ...formValues, 
            location: {...formValues.location, lng: coords.lng, lat: coords.lat} 
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
            if(user && user.idUser) formData.append('idUser',user.idUser);
            if(formValues.name) formData.append('name', formValues.name);
            if(formValues.description) formData.append('description', formValues.description);
            if(formValues.stars) formData.append('stars', formValues.stars);
            
            if(formValues.images){
                for (let i = 0; i < formValues.images.length; i++) {
                    formData.append('images', formValues.images[i]);
                }
            }

            // Log the formData to see what's being sent
            for (var pair of formData.entries()) {
                console.log(pair[0]+ ', ' + pair[1]); 
            }

            fetch("http://localhost:3000/createTour", {
                method: "POST",
                body: formData,
            })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                if(data.code === 200){
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

                }else{
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
        setFormValues({ ...formValues, contact: {...formValues.contact, [name]: value} });
    }

    function handleChangeAmenities(e) {
        const { id, checked } = e.target;
        setFormValues({ ...formValues, ammenities: {...formValues.ammenities, [id]: checked} });
    }

    function handleChangeImages(e) {
        const { files } = e.target;
        setFormValues({ ...formValues, images: files });
    }

    useEffect(() => {
        console.log(formValues);
    }
    , [formValues]);

    return(
        <>
        <h1>Crear Tour</h1>
        <h2>{user.idUser}</h2>
        <form className="form" onSubmit={handleSubmit} >
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
            <div className="form-group">
                <label htmlFor="images">Imagenes</label>
                <input type="file" 
                    className="form-control-file" 
                    id="images" 
                    accept="image/*" 
                    multiple
                    onChange={handleChangeImages}
                    />
            </div>
            <div className="form-group">
                <label htmlFor="description">Reseña</label>
                <textarea 
                    className="form-control" 
                    id="description"
                    name="description"
                    rows="3" 
                    onChange={handleChange}
                ></textarea>
            </div>
            <div className="form-group">
                <label htmlFor="etiquetas">Etiquetas</label>
                {/** a group of checkboxes for amenities*/}
                <div className="form-check">
                    <input type="checkbox" className="form-check-input" id="isHotel" onChange={handleChangeAmenities} />
                    <label className="form-check-label" htmlFor="isHotel">Hotel</label>

                    <input type="checkbox" className="form-check-input" id="isRestaurant" onChange={handleChangeAmenities} />
                    <label className="form-check-label" htmlFor="isRestaurant">Restaurante</label>

                    <input type="checkbox" className="form-check-input" id="isRiver" onChange={handleChangeAmenities} />
                    <label className="form-check-label" htmlFor="isRiver">Río</label>

                    <input type="checkbox" className="form-check-input" id="isBeach" onChange={handleChangeAmenities} />
                    <label className="form-check-label" htmlFor="isBeach">Playa</label>

                    <input type="checkbox" className="form-check-input" id="isMountain" onChange={handleChangeAmenities} />
                    <label className="form-check-label" htmlFor="isMountain">Montaña</label>

                    <input type="checkbox" className="form-check-input" id="hasRanch" onChange={handleChangeAmenities} />
                    <label className="form-check-label" htmlFor="hasRanch">Rancho</label>

                    <input type="checkbox" className="form-check-input" id="hasPool" onChange={handleChangeAmenities} />
                    <label className="form-check-label" htmlFor="hasPool">Piscina</label>

                    <input type="checkbox" className="form-check-input" id="hasBreakfast" onChange={handleChangeAmenities} />
                    <label className="form-check-label" htmlFor="hasBreakfast">Desayuno</label>

                    <input type="checkbox" className="form-check-input" id="hasBar" onChange={handleChangeAmenities} />
                    <label className="form-check-label" htmlFor="hasBar">Bar</label>

                    <input type="checkbox" className="form-check-input" id="hasWifi" onChange={handleChangeAmenities} />
                    <label className="form-check-label" htmlFor="hasWifi">Wifi</label>

                    <input type="checkbox" className="form-check-input" id="hasFireplace" onChange={handleChangeAmenities} />
                    <label className="form-check-label" htmlFor="hasFireplace">Chimenea</label>

                    <input type="checkbox" className="form-check-input" id="hasParking" onChange={handleChangeAmenities} />
                    <label className="form-check-label" htmlFor="hasParking">Parqueo</label>

                    <input type="checkbox" className="form-check-input" id="hasAirConditioner" onChange={handleChangeAmenities} />
                    <label className="form-check-label" htmlFor="hasAirConditioner">Aire acondicionado</label>

                    <input type="checkbox" className="form-check-input" id="hasGym" onChange={handleChangeAmenities} />
                    <label className="form-check-label" htmlFor="hasGym">Gimnasio</label>

                    <input type="checkbox" className="form-check-input" id="hasSpa" onChange={handleChangeAmenities} />
                    <label className="form-check-label" htmlFor="hasSpa">Spa</label>

                    <input type="checkbox" className="form-check-input" id="hasRoomService" onChange={handleChangeAmenities} />
                    <label className="form-check-label" htmlFor="hasRoomService">Room service</label>

                    <input type="checkbox" className="form-check-input" id="hasGreatView" onChange={handleChangeAmenities} />
                    <label className="form-check-label" htmlFor="hasGreatView">Vista</label>

                    <input type="checkbox" className="form-check-input" id="isAccessible" onChange={handleChangeAmenities} />
                    <label className="form-check-label" htmlFor="isAccessible">Accesible</label>

                    <input type="checkbox" className="form-check-input" id="isPetFriendly" onChange={handleChangeAmenities} />
                    <label className="form-check-label" htmlFor="isPetFriendly">Pet friendly</label>

                    <input type="checkbox" className="form-check-input" id="isFree" onChange={handleChangeAmenities} />
                    <label className="form-check-label" htmlFor="isFree">Gratis</label>


                    
                </div>
            </div>
            <div className="form-group">
                <label htmlFor="stars">Estrellas</label>
                <input type="number" 
                    className="form-control" 
                    id="stars" 
                    name="stars"
                    placeholder="Estrellas" 
                    onChange={handleChange}
                 />
            </div>
            <div className="form-group">
                <label htmlFor="location">Ubicación</label>
                <LocationPicker setCoords={setCoords} />
                
            </div>
            <div className="form-group">
                <label htmlFor="address">Dirección</label>
                <textarea className="form-control" 
                id="address" 
                name="address"
                rows="3"
                maxLength={45}
                placeholder="Dirección"
                onChange={
                    (e) => setFormValues({ 
                        ...formValues, location: {
                            ...formValues.location, address: e.target.value
                        } 
                    })
                }

                ></textarea>
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


            
            
            
            
            <button type="submit" className="btn btn-primary">Crear</button>
        </form>
        </>
    )

}

export default CrearTour;
