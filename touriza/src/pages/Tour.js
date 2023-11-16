import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import LocationShower from "../components/LocationShower";
import { parseISO, format } from 'date-fns';
import { FaStar, FaRegStar } from 'react-icons/fa';
import autosize from 'autosize';

function Tour() {
    const navigate = useNavigate();
    const location = useLocation();
    const tour = location.state.tour;

    const [images, setImages] = useState([]);
    const [contact, setContact] = useState([]);
    const [locationTour, setLocationTour] = useState([]);
    const [comments, setComments] = useState([]);
    const [amenities, setAmenities] = useState([]);
    const [isFav, setIsFav] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);


    const handleWindowResize = () => {
        setWindowWidth(window.innerWidth);
    };

    useEffect(() => {
        window.addEventListener('resize', handleWindowResize);
        return () => window.removeEventListener('resize', handleWindowResize);
    }, []);

    const [commentForm, setCommentForm] = useState({
        idUser: JSON.parse(localStorage.getItem('user')).idUser,
        idTour: tour.idTour,
        stars: 0,
        comment: "",
    });

    const textareaRef = useRef(null);

    useEffect(() => {
        if (textareaRef.current) {
            autosize(textareaRef.current);
        }


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

        fetch(`http://localhost:3000/isFav/${JSON.parse(localStorage.getItem('user')).idUser}/${tour.idTour}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {

                if (data.code === 200) {
                    console.log(data.message);
                    console.log(data.isFav);
                    setIsFav(data.isFav);
                } else {
                    console.log(data.message);
                }

            })
            .catch((err) => {
                console.log(err);
            });




    }, []);

    useEffect(() => {
        if (textareaRef.current) {
            autosize.update(textareaRef.current);
        }
    }, [commentForm.comment]);

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
        fetch("http://localhost:3000/toggleFav", {
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

    function getAsides() {
        return(
            <div className="asides-container">
                    <aside className="aside-ubi-con" key={tour.idTour} >
                    <article className="location">
                        <h2>Ubicacion</h2>
                        <LocationShower lat={locationTour.lat} lng={locationTour.lng} />
                        <p>{locationTour.address}</p>
                    </article>
                    <article className="contact-info">


                        <h2>Contacto</h2>
                        <p className="contact-data">
                            <i class="fi fi-rr-at"></i>
                            {contact.email}
                        </p>
                        <p className="contact-data">
                            <i class="fi fi-rr-phone-call"></i>
                            {contact.phone}
                        </p>
                        <p className="contact-data">
                            <i class="fi fi-rr-globe"></i>
                            {contact.website}
                        </p>
                    </article>
                    </aside>
                    <aside className="tags" key={tour.idTour}>
                        <h2>Tags</h2>

                        <div className="tag-container">
                            {Object.values(amenities)[2] !== 0 && <p className="tag">Hotel</p>}
                            {Object.values(amenities)[3] !== 0 && <p className="tag">Restaurante</p>}
                            {Object.values(amenities)[4] !== 0 && <p className="tag">Rio</p>}
                            {Object.values(amenities)[5] !== 0 && <p className="tag">Playa</p>}
                            {Object.values(amenities)[6] !== 0 && <p className="tag">Montaña</p>}
                            {Object.values(amenities)[7] !== 0 && <p className="tag">Rancho</p>}
                            {Object.values(amenities)[8] !== 0 && <p className="tag">Piscina</p>}
                            {Object.values(amenities)[9] !== 0 && <p className="tag">Desayuno incluido</p>}
                            {Object.values(amenities)[10] !== 0 && <p className="tag">Bar</p>}
                            {Object.values(amenities)[11] !== 0 && <p className="tag">Wifi</p>}
                            {Object.values(amenities)[12] !== 0 && <p className="tag">Fogata</p>}
                            {Object.values(amenities)[13] !== 0 && <p className="tag">Parqueo</p>}
                            {Object.values(amenities)[14] !== 0 && <p className="tag">Aire acondicionado</p>}
                            {Object.values(amenities)[15] !== 0 && <p className="tag">Gimnacio</p>}
                            {Object.values(amenities)[16] !== 0 && <p className="tag">Spa</p>}
                            {Object.values(amenities)[17] !== 0 && <p className="tag">Servicio al cuarto</p>}
                            {Object.values(amenities)[18] !== 0 && <p className="tag">Buena vista</p>}
                            {Object.values(amenities)[19] !== 0 && <p className="tag">Accesible</p>}
                            {Object.values(amenities)[20] !== 0 && <p className="tag">Se aceptan mascotas</p>}
                            {Object.values(amenities)[21] !== 0 && <p className="tag">Gratis</p>}
                        </div>
                    </aside>
                </div>
        )

    }



    return (
        <div className="Tour-page">
            <div className="tour-header">
                <h1 className="tour-title" >{tour.name}</h1>
                <div className="tour-fav">
                    <i className={isFav ? "fi fi-sr-heart red" : "fi fi-rr-heart"}
                        onClick={() => {
                            addToFav();
                            setIsFav(!isFav);
                        }}
                    ></i>
                </div>    
            </div>
            <div className="tour-container">
                <div className="tour-body">
                    <section className="tour" key={tour.idTour} >
                        {/** get image from public uploads tours */}
                        <Carousel
                            className=""
                            showArrows={true}
                            showStatus={false}
                            infiniteLoop={true}
                            swipeable={true}
                            dynamicHeight={true}
                            emulateTouch={true}
                            selectedItem={0}
                            transitionTime={1000}
                            swipeScrollTolerance={15}
                        >

                            {images.map((image, index) => (
                                <div key={index} >
                                    <img
                                        className="selected-images"
                                        src={`${process.env.PUBLIC_URL}/uploads/tours/${image.picture}`}
                                        alt={tour.name} />
                                </div>
                            ))}
                        </Carousel>
                        <div className="tour-info">
                            <div className="tour-header">
                                <h2 >Reseña</h2>
                                <div className="tour-stars">
                                    {[...Array(5)].map((star, index) => {
                                        return index < tour.stars ? (
                                            <FaStar key={index} className="star" />
                                        ) : (
                                            <FaRegStar key={index} className="reg-star" />
                                        );
                                    })}
                                </div>
                            </div>
                            <p>{tour.description}</p>
                        </div>
                    </section>
                    {windowWidth > 1280 ? <></> : getAsides()}
                    <section className="comments" key={tour.idTour} >
                        <h2>{comments.length}
                            {comments.length === 1 ? " Comentario" : " Comentarios"}
                        </h2>
                        <section className="newComment-container" key={tour.idTour} >
                            <form onSubmit={postComment} className="newComment" >
                                <div className="comment-details">
                                    <img
                                        src={`${process.env.PUBLIC_URL}/uploads/pfp/${JSON.parse(localStorage.getItem('user')).profilePicture}`}
                                        alt={JSON.parse(localStorage.getItem('user')).name}
                                    />
                                    <div className="comment-body">
                                        <div className="form-group row">
                                            <div className="star-picker" >
                                                {[...Array(5)].map((_, i) => (
                                                    commentForm.stars >= i + 1 ?
                                                        <FaStar
                                                            className="star"
                                                            key={i}
                                                            name="stars"
                                                            value={i + 1}
                                                            onClick={() => handleChangeComment({ target: { name: 'stars', value: i + 1 } })}
                                                        /> :
                                                        <FaRegStar
                                                            className="reg-star"
                                                            key={i}
                                                            name="stars"
                                                            value={i + 1}
                                                            onClick={() => handleChangeComment({ target: { name: 'stars', value: i + 1 } })}
                                                        />
                                                ))}
                                            </div>


                                        </div>
                                        <div className="form-group">
                                            <textarea
                                                ref={textareaRef}
                                                id="comment"
                                                name="comment"
                                                rows="1"
                                                className="comment-input"
                                                placeholder="Escribe un comentario..."
                                                value={commentForm.comment}
                                                onChange={handleChangeComment}
                                                maxLength={500}
                                            ></textarea>
                                            <p className="char-counter" >{commentForm.comment.length} / 500</p>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={commentForm.comment.length === 0}
                                    style={commentForm.comment.length === 0 ? { display: 'none' } : { cursor: 'pointer' }}
                                >Comentar</button>
                            </form>
                        </section>


                        {[...comments]
                            .sort((a, b) => new Date(b.postDate) - new Date(a.postDate))
                            .map((comment) => (
                                <article className="comment" key={comment.idComment}>
                                    <img
                                        style={{ width: '70px' }}
                                        src={`${process.env.PUBLIC_URL}/uploads/pfp/${comment.profilePicture}`}
                                        alt={comment.name}
                                        onClick={() => { goToProfile(comment.idUser) }}
                                    />
                                    <div className="comment-container">
                                        <div className="comment-header">
                                            <p>{comment.name}</p>
                                            <p>Publicado: {format(parseISO(comment.postDate), 'MM/dd/yyyy')}</p>

                                            <div className="tour-stars">
                                                {[...Array(5)].map((star, index) => {
                                                    return index < comment.stars ? (
                                                        <FaStar key={index} className="star" />
                                                    ) : (
                                                        <FaRegStar key={index} className="reg-star" />
                                                    );
                                                })}
                                            </div>
                                        </div>
                                        <p className="comment-comment" >{comment.comment}</p>
                                    </div>
                                </article>
                            ))}
                    </section>
                </div>
                {windowWidth > 1280 ? getAsides() : <></>}
            </div>
        </div>


    );
}

export default Tour;