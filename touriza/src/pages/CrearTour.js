import React from "react";
import { useState } from "react";
import LocationPicker from "../components/LocationPicker";
function CrearTour() {
    const [form, setForm] = useState({
        name: "",
        description: "",
        stars: 0,

    });

    return(
        <>
            <LocationPicker />
        </>
    )

}

export default CrearTour;
