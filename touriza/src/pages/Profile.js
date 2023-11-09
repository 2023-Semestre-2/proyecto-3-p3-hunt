import { id } from "date-fns/locale";
import React, {useState, useEffect} from "react";
import { useParams, useNavigate } from "react-router-dom";

function Profile() {
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
        })
        .catch((err) => {
            console.log(err);
        });
    }
    , [idUser]);


    return (
        <div>
            <h1>Profile</h1>
            <img 
                style={{width:'70px'}}
                src={`${process.env.PUBLIC_URL}/uploads/pfp/${userInformation.profilePicture}`} 
                alt="profile picture"
            />
            {idUser == JSON.parse(localStorage.getItem('user')).idUser ? (
                <button
                    onClick={() => {navigate(`/EditProfile`);}}
                >Editar</button>
            ) : (
                <></>
            )}
            <p>Posts: {userInformation.numberOfPost}</p>
            <p>Favoritos: {userInformation.numberOfFavorites}</p>
            <p>Comentarios: {userInformation.numberOfComments}</p>
            <p>{userInformation.name +" "+ userInformation.lastName}</p>
            <p>{userInformation.email}</p>
            <p>{userInformation.phone}</p>

        </div>
    );
}

export default Profile;