import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


function Register() {
    const navigate = useNavigate();

    const [formValues, setFormValues] = useState({
        profilePic: "",
        name: "",
        lastname: "",
        email: "",
        phone: "",
        password: "",
        password2: ""
    });
    const [imagePreview, setImagePreview] = useState(
        `${process.env.PUBLIC_URL}/user.png`
    );

    const [formErrors, setFormErrors] = useState({});

    
    function handelSubmit(e) {
        e.preventDefault();
        console.log("Register");

        if (true) {
            //register the user
            console.log(formValues);

            // Create a new FormData instance
            const formData = new FormData();

            // Append the form values to formData
            formData.append('name', formValues.name);
            formData.append('lastname', formValues.lastname);
            formData.append('email', formValues.email);
            formData.append('phone', formValues.phone);
            formData.append('password', formValues.password);
            formData.append('password2', formValues.password2);
            formData.append('profilePicUpload', formValues.profilePic);

            fetch("http://localhost:3000/register", {
                method: "POST",
                body: formData,
            })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                if(data.code === 200){
                    navigate("/Login");
                }
            });
        }
    }

    function validateForm(values) {
        let errors = {};
        //name errors
        if (!values.name) {
            errors.name = "Name is required";
        }
        //lastname errors
        if (!values.lastname) {
            errors.lastname = "Lastname is required";
        }
        //email errors
        if (!values.email) {
            errors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(values.email)) {
            errors.email = "Email is invalid";
        }
        //phone errors
        if (!values.phone) {
            errors.phone = "Phone is required";
        } else if (values.phone.length < 10) {
            errors.phone = "Phone must be at least 10 characters";
        }
        //password errors
        if (!values.password) {
            errors.password = "Password is required";
        } else if (values.password.length < 6) {
            errors.password = "Password must be at least 6 characters";
        }
        //password2 errors
        if (!values.password2) {
            errors.password2 = "Password is required";
        } else if (values.password2 !== values.password) {
            errors.password2 = "Passwords do not match";
        }
        return errors;
    }

    function handleChange(e) {
        if (e.target.files && e.target.files[0]) {
            let img = e.target.files[0];
            setFormValues({
                ...formValues,
                profilePic: img
            });
            setImagePreview(URL.createObjectURL(img));
        }
    }

    useEffect(() => {  
        console.log(formValues.profilePic);
    }, [formValues.profilePic]);

    return (
        <section className="register">
            <form className="form-a"  onSubmit={handelSubmit} >
                <h1 id="register-title" >Registrarse</h1>
                {/*image to upload a profile pic*/}
                <div className="row-2">
                    <div className="form-group-a">
                        <label
                            className="profile-pic-upload"  
                            htmlFor="profilePicUpload">
                            <img
                                className="profile-pic-upload" 
                                src={imagePreview} 
                                alt="Foto de perfil" />
                            <input
                                type="file"
                                className="form-control"
                                id="profilePicUpload"
                                name="profilePicUpload"
                                onChange={handleChange}
                                style={{ display: 'none' }}
                            />
                        </label>
                    </div>
                    {/*name*/}
                    <div className="col">
                        <div className="form-group-a">
                            <label htmlFor="name">Nombre</label>
                            <input
                                type="text"
                                className="input-2"
                                id="name"
                                name="name"
                                placeholder="Ingresa tu nombre"
                                value={formValues.name}
                                onChange={(e) =>
                                    setFormValues({ ...formValues, name: e.target.value })
                                }
                            />
                            <div className="invalid-feedback">{formErrors.name}</div>
                        </div>
                        {/*lastname*/}
                        <div className="form-group-a">
                            <label htmlFor="lastname">Apellidos</label>
                            <input
                                type="text"
                                className="input-2"
                                id="lastname"
                                name="lastname"
                                placeholder="Ingresa tus apellidos"
                                value={formValues.lastname}
                                onChange={(e) =>
                                    setFormValues({ ...formValues, lastname: e.target.value })
                                }
                            />
                            <div className="invalid-feedback">{formErrors.lastname}</div>
                        </div>
                    </div>
                </div>
                {/*email*/}
                <div className="form-group-a">
                    <label htmlFor="email">Correo electrónico</label>
                    <input
                        type="email"
                        className={`form-control ${formErrors.email && "is-invalid"}`}
                        id="email"
                        name="email"
                        placeholder="Ingresa tu correo electrónico"
                        value={formValues.email}
                        onChange={(e) =>
                            setFormValues({ ...formValues, email: e.target.value })
                        }
                    />
                    <div className="invalid-feedback">{formErrors.email}</div>
                </div>
                {/*phone*/}
                <div className="form-group-a">
                    <label htmlFor="phone">Teléfono</label>
                    <input
                        type="text"
                        className={`form-control ${formErrors.phone && "is-invalid"}`}
                        id="phone"
                        name="phone"
                        placeholder="Ingresa tu teléfono"
                        value={formValues.phone}
                        onChange={(e) =>
                            setFormValues({ ...formValues, phone: e.target.value })
                        }
                    />
                    <div className="invalid-feedback">{formErrors.phone}</div>
                </div>
                {/*password*/}
                <div className="form-group-a">
                    <label htmlFor="password">Contraseña</label>
                    <input
                        type="password"
                        className={`form-control ${formErrors.password && "is-invalid"}`}
                        id="password"
                        name="password"
                        placeholder="Ingresa tu contraseña"
                        value={formValues.password}
                        onChange={(e) =>
                            setFormValues({ ...formValues, password: e.target.value })
                        }
                    />
                    <div className="invalid-feedback">{formErrors.password}</div>
                </div>
                {/*password2*/}
                <div className="form-group-a">
                    <label htmlFor="password2">Confirmar contraseña</label>
                    <input
                        type="password"
                        className={`form-control ${formErrors.password2 && "is-invalid"}`}
                        id="password2"
                        name="password2"
                        placeholder="Confirma tu contraseña"
                        value={formValues.password2}
                        onChange={(e) =>
                            setFormValues({ ...formValues, password2: e.target.value })
                        }
                    />
                    <div className="invalid-feedback">{formErrors.password2}</div>
                </div>
                <button type="submit" className="btn btn-primary">
                    Registrarse
                </button>
                <p id='ya-cuenta' >¿Ya tienes cuenta? <a href="/login">Inicia sesión</a></p>

            </form>
        </section>
    );
    }

export default Register;

