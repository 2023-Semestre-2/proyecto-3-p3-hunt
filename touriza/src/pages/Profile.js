import { id } from "date-fns/locale";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function Profile({ updateProfile }) {
    const navigate = useNavigate();
    const { idUser } = useParams();
    const [userInformation, setUserInformation] = useState({});

    useEffect(() => {
        fetch(`http://localhost:3000/getInfoProfile/${idUser}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setUserInformation(data.user);
                updateProfile(data.user);
            })
            .catch((err) => {
                console.log(err);
            });


    }
        , [idUser]);


    return (
        <div className="Profile-page">
            <div className="profile-container">
                <div className="profile-info">
                    <img
                        className="profile-picture"
                        src={`${process.env.PUBLIC_URL}/uploads/pfp/${userInformation.profilePicture}`}
                        alt={`Foto de perfil de ${userInformation.name} ${userInformation.lastName} `}
                    />
                    <div className="profile-header">
                        {idUser == JSON.parse(localStorage.getItem('user')).idUser ? (
                            <button
                                className="btn btn-primary edit-profile"
                                onClick={() => { navigate(`/EditProfile`); }}
                                aria-label="Editar perfil"
                            >

                                <i className="fi fi-rr-edit"></i>
                                Editar perfil
                            </button>
                        ) : (
                            <></>
                        )}
                    </div>
                    <div className="profile-body">
                        <div className="profile-stats">
                            <div className="stat-group">
                                <label>
                                    {
                                        userInformation.numberOfPost ?
                                            userInformation.numberOfPost
                                            : 0
                                    }
                                </label>

                                <label>{userInformation.numberOfPost == 1 ? "Tour" : "Tours"}</label>


                            </div>
                            <div className="stat-group">
                                <label>
                                    {
                                        userInformation.numberOfComments ?
                                            userInformation.numberOfComments
                                            : 0
                                    }
                                </label>
                                <label>{userInformation.numberOfComments == 1 ? "Comentario" : "Comentarios"}</label>
                            </div>
                            <div className="stat-group">
                                <label>
                                    {
                                        userInformation.numberOfFavorites ?
                                            userInformation.numberOfFavorites
                                            : 0
                                    }
                                </label>
                                <label>{userInformation.numberOfFavorites == 1 ? "Favorito" : "Favoritos"}</label>
                            </div>
                        </div>
                        <h1>
                            {userInformation.name + " " + userInformation.lastName}
                        </h1>
                        <p className="profile-data " >
                            <i class="fi fi-rr-phone-call" aria-label="Icono teléfono" ></i>
                            {userInformation.phone}
                        </p>
                        <p className="profile-data" >
                            <i class="fi fi-rr-at" aria-label="Icono email"  ></i>
                            {userInformation.email}
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Profile;