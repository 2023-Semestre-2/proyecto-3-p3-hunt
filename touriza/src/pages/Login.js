import { set } from "date-fns";
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login(props) {
    const [formValues, setFormValues] = useState({
        email: "",
        password: "",
    });
    const [formErrors, setFormErrors] = useState({});

    const navigate = useNavigate();

   
    
    function handleSubmint(e) {
        e.preventDefault();
        console.log("Login");

        //login the user
        console.log(formValues);
        setFormErrors({});
        validateForm();
        if (Object.keys(formErrors).length === 0) {
            fetch("http://localhost:3000/login", {
                method: "POST",
                body: JSON.stringify(formValues),
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((res) => res.json())
                .then((data) => {
                        console.log(data);
                        if (data.code === 200) {
                            let user = data.user;
                            delete user.password;
                            props.onLogin(user);                 
                            navigate("/Home");
                        } else {
                            setFormErrors({ email: data.message });
                        }      
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
            }
    }

    function validateForm() {
        let errors = {};

        if (!formValues.email) {
            errors.email = "Por favor ingresa tu correo electrónico";
        }

        if (!formValues.password) {
            errors.password = "Por favor ingresa tu contraseña";
        }


        setFormErrors(errors);
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    }

    return (
        <section className="login">
                <form className="form-a" onSubmit={handleSubmint} >
                    <h1 id="iniciar-sesion"  >Iniciar sesión</h1>
                    {/*email*/}
                    <div className="form-group-a">
                        <label htmlFor="email">Correo electrónico</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            placeholder="Ingresa tu correo electrónico"
                            onChange={handleChange}
                        />
                        {formErrors.email && <div className="invalid-feedback">{formErrors.email}</div>}

                    </div>
                    {/*password*/}
                    <div className="form-group-a">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            name="password"
                            placeholder="Contraseña"
                            onChange={handleChange}
                            
                        />
                        {formErrors.password && <div className="invalid-feedback">{formErrors.password}</div>}
                    </div>
                    <button 
                        type="submit" 
                        className="btn btn-primary"
                        style={{margin: '60px 0 0 0'}}
                        >
                        Iniciar sesión
                    </button>
                    
                    <p id='no-cuenta' >¿No tienes cuenta? <a href="/register">Regístrate</a></p>
                    
                </form>

        </section>
    );
    }

export default Login;