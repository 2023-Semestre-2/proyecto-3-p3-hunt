import React, {useState, useEffect} from "react";

function EditProfile() {

    const [userInformation, setUserInformation] = useState({});
    const [formValues, setFormValues] = useState({
        profilePicture: "",
        name: "",
        lastName: "",
        phone: "",
        password: "",
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
                profilePicture: img
            });
            setImagePreview(URL.createObjectURL(img));
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        console.log("EditProfile");

        if (true) {
            //Update the user
            console.log(formValues);
            
            // Create a new FormData instance
            const formData = new FormData();

            // Append the form values to formData
            formData.append('idUser', userInformation.idUser);
            formData.append('name', formValues.name);
            formData.append('lastName', formValues.lastName);
            formData.append('phone', formValues.phone);
            formData.append('password', formValues.password);

            if(formValues.profilePicture !== ""){
                formData.append('profilePicUpload', formValues.profilePicture);
            }

            fetch("http://localhost:3000/updateUser", {
                method: "POST",
                body: formData,
            })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                if(data.code === 200){
                    //navigate("/Login");
                }
            });
        }
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
              <input type="text" name="name" id="name" placeholder={userInformation.name}/>
              <input type="text" name="lastName" id="lastName" placeholder={userInformation.lastName} />
              <input type="text" name="phone" id="phone" placeholder={userInformation.phone} />
              <input type="password" name="password" id="password" placeholder="Contraseña actual" />
              <input type="password" name="newPassword" id="newPassword" placeholder="Nueva contraseña" />
              <input type="password" name="confirmPassword" id="confirmPassword" placeholder="Confirmar contraseña" />
          </form>

    </div>
    )
}

export default EditProfile;