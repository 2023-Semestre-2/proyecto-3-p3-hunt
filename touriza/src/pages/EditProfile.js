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
    const [imagePreview, setImagePreview] = useState(null);
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


        // Check if the new password and its confirmation match
        if (formValues.newPassword !== formValues.confirmPassword) {
            alert('The new password and its confirmation do not match.');
            return;
        }
        // Update the user
        console.log(formValues);

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
                    alert(data.message);
                }
            });
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
                            />
                        <span className="image-upload-text">Subir archivo</span>
                    </label>

                    <div className="profile-body">
                        <div className="row-2">
                            <div className="form-group-a">
                                <label htmlFor="name">Nombre</label>
                                <input type="text" name="name" id="name" placeholder={userInformation.name} onChange={handleChangeForm} />
                            </div>
                            <div className="form-group-a">
                                <label htmlFor="lastname">Apellidos</label>
                                <input type="text" name="lastName" id="lastName" placeholder={userInformation.lastName} onChange={handleChangeForm} />
                            </div>
                        </div>
                        <div className="row-2">
                            <div className="form-group-a">
                                <label htmlFor="phone">Teléfono</label>
                                <input type="text" name="phone" id="phone" placeholder={userInformation.phone} onChange={handleChangeForm} />
                            </div>
                            <div className="form-group-a">
                                <label htmlFor="password">Contraseña actual</label>
                                <input type="password" name="password" id="password" placeholder="Contraseña actual" onChange={handleChangeForm} />
                            </div>
                        </div>
                        <div className="row-2">
                            <div className="form-group-a">
                                <label htmlFor="newPassword">Nueva contraseña</label>
                                <input type="password" name="newPassword" id="newPassword" placeholder="Nueva contraseña" onChange={handleChangeForm} />
                            </div>
                            <div className="form-group-a">
                                <label htmlFor="confirmPassword">Confirmar contraseña</label>
                                <input type="password" name="confirmPassword" id="confirmPassword" placeholder="Confirmar contraseña" onChange={handleChangeForm} />
                            </div>
                        </div>
                        <div className="buttons">
                            <button type="cancel" className="btn btn-secondary" onClick={handleCancel}>Cancelar</button>
                            <button type="submit" className="btn btn-primary">Guardar Cambios</button>
                        </div>
                    </div>
                </form>

            </div>
        </div>
    )
}

export default EditProfile;