import React, {useState, useEffect} from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import LocationShower from "../components/LocationShower";
import { parseISO, format } from 'date-fns';

function Tour() {
    const navigate = useNavigate();
    const location = useLocation();
    const tour = location.state.tour;

    const [images, setImages] = useState([]);
    const [contact, setContact] = useState([]);
    const [locationTour, setLocationTour] = useState([]);
    const [comments, setComments] = useState([]);
    const [amenities, setAmenities] = useState([]);

    const [commentForm, setCommentForm] = useState({
        idUser: JSON.parse(localStorage.getItem('user')).idUser,
        idTour: tour.idTour,
        stars: 0,
        comment: "",
    });


    useEffect(() => {
        fetch(`http://localhost:3000/getImagesTour/${tour.idTour}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            setImages(data.images);
        })
        .catch((err) => {
            console.log(err);
        });

        fetch(`http://localhost:3000/getContactTour/${tour.idTour}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            setContact(data.contact);
        })

        fetch(`http://localhost:3000/getLocationTour/${tour.idTour}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            setLocationTour(data.location);
        })
        .catch((err) => {
            console.log(err);
        });

        fetch(`http://localhost:3000/getAmenitiesTour/${tour.idTour}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then((res) => res.json())
        .then((data) => {
            console.log(data.amenities);
            setAmenities(data.amenities);
        })
        .catch((err) => {
            console.log(err);
        });

        getComments();



    }, []);


    function getComments() {
        fetch(`http://localhost:3000/getCommentsTour/${tour.idTour}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            setComments(data.comments);
        })
        .catch((err) => {
            console.log(err);
        });
    }


    useEffect(() => {
        console.log("Nuevo comentario");
    }, [comments]);

    function handleChangeComment(e) {
        const { name, value } = e.target;
        setCommentForm({ ...commentForm, [name]: value });
    }

    function postComment(e) {
        e.preventDefault();
        console.log("Comment");
        console.log(commentForm);
        fetch("http://localhost:3000/postComment", {
            method: "POST",
            body: JSON.stringify(commentForm),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                    console.log(data);
                    if (data.code === 200) {
                        console.log(data.message);
                        getComments();
                        setCommentForm({
                            idUser: commentForm.idUser,
                            idTour: commentForm.idTour,
                            stars: 0,
                            comment: "",
                        });
                    } else {
                        console.log(data.message);
                    }
                
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    useEffect(() => {
        console.log(locationTour);
    }
    , [locationTour]);


    function addToFav() {
        console.log("Favorito");
        console.log(JSON.parse(localStorage.getItem('user')).idUser);
        console.log(tour.idTour);
        fetch("http://localhost:3000/addToFav", {
            method: "POST",
            body: JSON.stringify({
                idUser: JSON.parse(localStorage.getItem('user')).idUser,
                idTour: tour.idTour,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                    console.log(data);
                    if (data.code === 200) {
                        console.log(data.message);
                    } else {
                        console.log(data.message);
                    }
                
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    function goToProfile(idUser) {
        console.log("Go to profile");
        console.log(idUser);
        navigate(`/Profile/${idUser}`);
    }

    return (
        <div>
            <h1>Tour</h1>
            <section className="tour" key={tour.idTour} style={{border:'1px solid #000'}}>
                <h2>{tour.name}</h2>
                <button type="button" className="btn btn-primary" onClick={addToFav} >Favorito</button>
                {/** get image from public uploads tours */}
                <Carousel 
                    showArrows={true}
                    showThumbs={false}
                    showStatus={false}
                    infiniteLoop={true}
                    swipeable={true}
                    dynamicHeight={true}
                    emulateTouch={true}
                    selectedItem={0}
                    transitionTime={1000}
                    swipeScrollTolerance={15}
                    >
                    
                    {images.map((image) => (
                        <div>
                            <img 
                                style={{width:'300px'}}
                                src={`${process.env.PUBLIC_URL}/uploads/tours/${image.picture}`} 
                                alt={tour.name} />
                        </div>
                    ))}
                </Carousel>
                
                <p>{tour.description}</p>
                <p>{tour.stars}</p>
            </section>
            <aside className="ubicacion" key={tour.idTour} style={{border:'1px solid #000'}}>
                <h2>Ubicacion</h2>
                <LocationShower lat={locationTour.lat} lng={locationTour.lng} />
                <p>{locationTour.lat}</p>
                <p>{locationTour.lng}</p>
                <p>{locationTour.address}</p>

                <h2>Contacto</h2>
                <p>{contact.email}</p>
                <p>{contact.phone}</p>
                <p>{contact.website}</p>

            </aside>
            <aside className="tags" key={tour.idTour} style={{border:'1px solid #000'}}>
                <h2>Tags</h2>
                

                {Object.values(amenities)[2] ? <p>Hotel</p> : <p></p>}
                {Object.values(amenities)[3] ? <p>Restaurante</p> : <p></p>}
                {Object.values(amenities)[4] ? <p>Rio</p> : <p></p>}
                {Object.values(amenities)[5] ? <p>Playa</p> : <p></p>}
                {Object.values(amenities)[6] ? <p>Montaña</p> : <p></p>}
                {Object.values(amenities)[7] ? <p>Rancho</p> : <p></p>}
                {Object.values(amenities)[8] ? <p>Piscina</p> : <p></p>}
                {Object.values(amenities)[9] ? <p>Desayuno incluido</p> : <p></p>}
                {Object.values(amenities)[10] ? <p>Bar</p> : <p></p>}
                {Object.values(amenities)[11] ? <p>Wifi</p> : <p></p>}
                {Object.values(amenities)[12] ? <p>Fogata</p> : <p></p>}
                {Object.values(amenities)[13] ? <p>Parqueo</p> : <p></p>}
                {Object.values(amenities)[14] ? <p>Aire acondicionado</p> : <p></p>}
                {Object.values(amenities)[15] ? <p>Gimnacio</p> : <p></p>}
                {Object.values(amenities)[16] ? <p>Spa</p> : <p></p>}
                {Object.values(amenities)[17] ? <p>Servicio al cuarto</p> : <p></p>}
                {Object.values(amenities)[18] ? <p>Buena vista</p> : <p></p>}
                {Object.values(amenities)[19] ? <p>Accesible</p> : <p></p>}
                {Object.values(amenities)[20] ? <p>Se aceptan mascotas</p> : <p></p>}
                {Object.values(amenities)[21] ? <p>Gratis</p> : <p></p>}
            </aside>
            <section className="newComment" key={tour.idTour} style={{border:'1px solid #000'}}>
                <h2>Comentar</h2>
                <form onSubmit={postComment} >
                    <p>{JSON.parse(localStorage.getItem('user')).name}</p>
                    <img 
                        style={{width:'70px'}}
                        src={`${process.env.PUBLIC_URL}/uploads/pfp/${JSON.parse(localStorage.getItem('user')).profilePicture}`} 
                        alt={JSON.parse(localStorage.getItem('user')).name} 
                    />
                    <div className="form-group">
                        <label htmlFor="stars">Estrellas</label>
                        <input type="number" 
                        className="form-control" 
                        id="stars" 
                        name="stars"
                        min="0"
                        max="5"
                        value={commentForm.stars}
                        onChange={handleChangeComment}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="comment">Comentario</label>
                        <textarea className="form-control" 
                        id="comment" 
                        name="comment"
                        rows="3"
                        value={commentForm.comment}
                        onChange={handleChangeComment}
                        ></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary">Enviar</button>
                </form>
            </section>
            <section className="comments" key={tour.idTour} style={{border:'1px solid #000'}}>
                <h2>Comentarios</h2>


                {[...comments].reverse().map((comment) => (
                    <article className="comment" key={comment.idComment} style={{border:'1px solid #000'}}>
                        <p>{comment.name}</p>
                        <img 
                            style={{width:'70px'}}
                            src={`${process.env.PUBLIC_URL}/uploads/pfp/${comment.profilePicture}`} 
                            alt={comment.name} 
                            onClick={() => {goToProfile(comment.idUser)}}
                        />
                        <p>{comment.stars}</p>
                        <p>{comment.comment}</p>
                        <p>Posted on: {format(parseISO(comment.postDate), 'MM/dd/yyyy')}</p>
                    </article>
                ))}
            </section>

        </div>
    );
    }

export default Tour;