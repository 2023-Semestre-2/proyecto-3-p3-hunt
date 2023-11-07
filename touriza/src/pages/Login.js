import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login(props) {
    
    const [formValues, setFormValues] = useState({
        email: "",
        password: "",
    });

    const navigate = useNavigate();

    function handleSubmint(e) {
        e.preventDefault();
        console.log("Login");

        //login the user
        console.log(formValues);
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
                        props.onLogin({idUser: data.user.idUser, email:data.user.email});
                        navigate("/Home");
                    } else {
                        console.log(data.message);
                    }
                
            })
            .catch((error) => {
                console.error('Error:', error);
            });


    }

    function handleChange(e) {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    }

    return (
        <section className="login">
            <div className="container">
                <div className="row">
                    <div className="col-12 col-md-6 mx-auto">
                        <form className="my-4" onSubmit={handleSubmint} >
                            <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>
                            {/*email*/}
                            <div className="form-group">
                                <label htmlFor="email">Email address</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    name="email"
                                    placeholder="Enter email"
                                    onChange={handleChange}
                                />
                            </div>
                            {/*password*/}
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    name="password"
                                    placeholder="Password"
                                    onChange={handleChange}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">
                                Sign in
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
    }

export default Login;