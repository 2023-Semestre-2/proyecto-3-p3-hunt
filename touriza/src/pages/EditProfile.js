import React, {useState, useEffect} from "react";
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
            if(data.code === 200){
                navigate(`/Profile/${userInformation.idUser}`);
            }else{
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
    <div>
      <h1>EditProfile</h1>
          <form onSubmit={handleSubmit} >

              <img
                  style={{ width: '70px' }}
                  src={imagePreview}
                  alt="profile picture"
              />
              <input type="file" name="profilePicture" id="profilePicture" onChange={handleChange} />
              <input type="text" name="name" id="name" placeholder={userInformation.name} onChange={handleChangeForm}/>
              <input type="text" name="lastName" id="lastName" placeholder={userInformation.lastName} onChange={handleChangeForm} />
              <input type="text" name="phone" id="phone" placeholder={userInformation.phone} onChange={handleChangeForm} />
              <input type="password" name="password" id="password" placeholder="Contraseña actual" onChange={handleChangeForm} />
              <input type="password" name="newPassword" id="newPassword" placeholder="Nueva contraseña" onChange={handleChangeForm} />
              <input type="password" name="confirmPassword" id="confirmPassword" placeholder="Confirmar contraseña" onChange={handleChangeForm} />
               <button type="submit" >Guardar</button>
          </form>

    </div>
    )
}

export default EditProfile;