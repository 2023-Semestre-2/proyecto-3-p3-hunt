import { set } from "date-fns";
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
        setFormErrors({});
        validateForm(formValues);
        if (Object.keys(formErrors).length === 0) {
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
            errors.name = " *Por favor ingresa tu nombre";
        }
        //lastname errors
        if (!values.lastname) {
            errors.lastname = "*Por favor ingresa tus apellidos";
        }
        //email errors
        if (!values.email) {
            errors.email = "*Por favor ingresa tu correo electrónico";
        } else if (!/\S+@\S+\.\S+/.test(values.email)) {
            errors.email = "*Correo electrónico inválido";
        }
        //phone errors
        if (!values.phone) {
            errors.phone = "*Por favor ingresa tu teléfono";
        } else if (!/^[1-9]{1}[0-9]{7}$/.test(values.phone)) {
            errors.phone = "*Teléfono inválido";
        }
        
        //password errors
        if (!values.password) {
            errors.password = "*Por favor ingresa tu contraseña";
        } else if (values.password.length < 6) {
            errors.password = "*La contraseña debe tener al menos 6 caracteres";
        }
        //password2 errors
        if (!values.password2) {
            errors.password2 = "*Por favor confirma tu contraseña";
        } else if (values.password2 !== values.password) {
            errors.password2 = " *Las contraseñas no coinciden";
        }

        if (!values.profilePic) {
            errors.profilePic = "*Por favor sube una foto de perfil";
        }

        console.log("check errors");
        console.log(errors);
        setFormErrors(errors);
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
                            <div className="image-upload">
                                <img
                                    className="profile-pic-upload"
                                    src={imagePreview}
                                    alt="Foto de perfil"
                                />
                                <span className="image-upload-text">Subir archivo</span>
                            </div>
                            <input
                                type="file"
                                className="form-control"
                                id="profilePicUpload"
                                name="profilePicUpload"
                                onChange={handleChange}
                                style={{ display: 'none' }}
                            />
                        </label>
                        <div className="invalid-feedback">{formErrors.profilePic}</div>
                    </div>
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
                                maxLength={45}
                            />
                            <div className="invalid-feedback">{formErrors.name}</div>
                        </div>
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
                                maxLength={45}
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
                        maxLength={45}
                    />
                    <div className="invalid-feedback">{formErrors.email}</div>
                </div>
                {/*phone*/}
                <div className="form-group-a">
                    <label htmlFor="phone">Teléfono</label>
                    <input
                        type="number"
                        className={`form-control ${formErrors.phone && "is-invalid"}`}
                        id="phone"
                        name="phone"
                        placeholder="Ingresa tu teléfono"
                        value={formValues.phone}
                        onChange={(e) =>
                            setFormValues({ ...formValues, phone: e.target.value })
                        }
                        minLength={8}
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

