import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function EditProfile() {
    const navigate = useNavigate();

    const [userInformation, setUserInformation] = useState({});
    const [formValues, setFormValues] = useState({
        profilePic: "",
        name: userInformation.name,
        lastName: userInformation.lastName,
        phone: userInformation.phone,
        password: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [formErrors, setFormErrors] = useState({});
    const [imagePreview, setImagePreview] = useState(null);



    function validateForm() {
        let errors = {};

        // Add validation checks for each field
        if (!formValues.name) {
            errors.name = "Name is required";
        }

        if (!formValues.lastName) {
            errors.lastName = "Last name is required";
        }

        if (!formValues.phone) {
            errors.phone = "Phone is required";
        } else if (!/^[1-9]{1}[0-9]{7}$/.test(formValues.phone)) {
            errors.phone = "Por favor ingresa un número de teléfono válido";
        }

        if (!formValues.password) {
            errors.password = "Por favor ingresa tu contraseña";
        } 

        if (formValues.newPassword && !formValues.confirmPassword) {
            errors.confirmPassword = "Por favor confirma tu contraseña";
        } else if(formValues.newPassword.length<6) {
            errors.newPassword = "La contraseña debe tener al menos 6 caracteres";
        } else if (formValues.newPassword !== formValues.confirmPassword) { 
            errors.confirmPassword = "Las contraseñas no coinciden";
        }

        setFormErrors(errors);
    }


    useEffect(() => {
        fetch(`http://localhost:3000/getUser/${JSON.parse(localStorage.getItem('user')).idUser}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setUserInformation(data.user);
                setFormValues({
                    ...formValues,
                    name: data.user.name,
                    lastName: data.user.lastName,
                    phone: data.user.phone
                });

                setImagePreview(`${process.env.PUBLIC_URL}/uploads/pfp/${data.user.profilePicture}`);
            })
            .catch((err) => {
                console.log(err);
            });
    }
        , []);


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

    const handleCancel = () => {
        navigate("/Home")
    };

    function handleSubmit(e) {
        e.preventDefault();
        console.log("EditProfile");
        setFormErrors({});
        validateForm();
        if (Object.keys(formErrors).length === 0) {
            // Create a new FormData instance
            const formData = new FormData();

            // Append the form values to formData
            formData.append('idUser', userInformation.idUser);
            formData.append('name', formValues.name);
            formData.append('lastName', formValues.lastName);
            formData.append('phone', formValues.phone);
            formData.append('password', formValues.password);
            formData.append('newPassword', formValues.newPassword);
            formData.append('oldProfilePicture', userInformation.profilePicture);
            if (formValues.profilePic) {
                formData.append('profilePicUpload', formValues.profilePic);

                console.log("Profile pic changed");
            }
            console.log(formData.get('profilePicUpload'));

            fetch("http://localhost:3000/updateUser", {
                method: "POST",
                body: formData,

            })
                .then((res) => res.json())
                .then((data) => {
                    console.log(data);
                    if (data.code === 200) {
                        console.log(userInformation);

                        navigate(`/Profile/${userInformation.idUser}`);
                    } else {
                        setFormErrors({ password: data.message });
                    }
                });
        }
    }


    function handleChangeForm(e) {
        setFormValues({
            ...formValues,
            [e.target.name]: e.target.value
        });
    }


    return (
        <div className="EditProfile-page">
            <h1 className="editProfile-title" >Editar perfil</h1>
            <div className="profile-container">
                <form className="profile-info" onSubmit={handleSubmit} >
                    <label
                        className="profile-picture"
                        htmlFor="profilePicUpload"
                    >
                        <img
                            className="profile-picture"
                            src={imagePreview}
                            alt="profile picture"
                            style={{ marginTop: '100px' }}

                        />
                        <input
                            type="file"
                            id="profilePicUpload"
                            onChange={handleChange}
                            style={{ display: 'none' }}
                            accept="image/*"
                        />
                        <span className="image-upload-text">Subir archivo</span>
                    </label>
                    {formErrors.profilePicUpload && <div className="invalid-feedback">{formErrors.profilePicUpload}</div>}

                    <div className="profile-body">
                        <div className="row-2">
                            <div className="form-group-a">
                                <label htmlFor="name">Nombre</label>
                                <input type="text" name="name" id="name" placeholder={userInformation.name} onChange={handleChangeForm} />
                                {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
                            </div>
                            <div className="form-group-a">
                                <label htmlFor="lastname">Apellidos</label>
                                <input type="text" name="lastName" id="lastName" placeholder={userInformation.lastName} onChange={handleChangeForm} />
                                {formErrors.lastName && <div className="invalid-feedback">{formErrors.lastName}</div>}
                            </div>
                        </div>
                        <div className="row-2">
                            <div className="form-group-a">
                                <label htmlFor="phone">Teléfono</label>
                                <input type="number" minLength={8} name="phone" id="phone" placeholder={userInformation.phone} onChange={handleChangeForm} />
                                {formErrors.phone && <div className="invalid-feedback">{formErrors.phone}</div>}
                            </div>
                            <div className="form-group-a">
                                <label htmlFor="password">Contraseña actual</label>
                                <input type="password" name="password" id="password" placeholder="Contraseña actual" onChange={handleChangeForm} required />
                                {formErrors.password && <div className="invalid-feedback">{formErrors.password}</div>}
                            </div>
                        </div>
                        <div className="row-2">
                            <div className="form-group-a">
                                <label htmlFor="newPassword">Nueva contraseña</label>
                                <input type="password" name="newPassword" id="newPassword" placeholder="Nueva contraseña" onChange={handleChangeForm} required minLength={6}/>
                                {formErrors.newPassword && <div className="invalid-feedback">{formErrors.newPassword}</div>}
                            </div>
                            <div className="form-group-a">
                                <label htmlFor="confirmPassword">Confirmar contraseña</label>
                                <input type="password" name="confirmPassword" id="confirmPassword" placeholder="Confirmar contraseña" onChange={handleChangeForm} required minLength={6} />
                                {formErrors.confirmPassword && <div className="invalid-feedback">{formErrors.confirmPassword}</div>}
                            </div>
                        </div>
                        <div className="buttons">
                            <button type="submit" className="btn btn-primary">Guardar Cambios</button>
                            <button type="cancel" className="btn btn-secondary" onClick={handleCancel}>Cancelar</button>
                        </div>
                    </div>
                </form>

            </div>
        </div>
    )
}

export default EditProfile;