use touriza;

create table if not exists user (
    idUser int not null auto_increment,
    name varchar(45) not null,
    lastName varchar(45) not null,
    email varchar(45) not null unique,
    phone int not null,
    password varchar(45) not null,
    profilePicture varchar(45) null,
    primary key (idUser)
);


create table if not exists contact (
    idContact int not null auto_increment,
    email varchar(45) not null,
    phone int not null,
    webPage varchar(100) not null,
    primary key (idContact)
);

create table if not exists tour (
    idTour int not null auto_increment,
    idUser int not null,
    name varchar(45) not null,
    description varchar(500) not null,
    isFree boolean not null,
    stars int not null,
    idContact int not null,
    primary key (idTour),
    foreign key (idUser) references user (idUser),
    foreign key (idContact) references contact (idContact)
);

create table if not exists amenities (
    idAmenity int not null auto_increment,
    idTour int not null,
    isHotel boolean not null,
    isRestaurant boolean not null,
    isRiver boolean not null,
    isBeach boolean not null,
    isMountain boolean not null,
    hasRanch boolean not null,
    hasPool boolean not null,
    hasBreakfast boolean not null,
    hasBar boolean not null,
    hasWifi boolean not null,
    hasFireplace boolean not null,
    hasParking boolean not null,
    hasAirConditioning boolean not null,
    hasGym boolean not null,
    hasSpa boolean not null,
    hasRoomService boolean not null,
    hasGreatView boolean not null,
    isAccessible boolean not null,
    isPetFriendly boolean not null,
    primary key (idAmenity),
    foreign key (idTour) references tour (idTour)
);

create table if not exists location (
    idLocation int not null auto_increment,
    idTour int not null,
    googleMapsUrl varchar(500) not null,
    address varchar(45) not null,
    primary key (idLocation),
    foreign key (idTour) references tour (idTour)
);

create table if not exists tourPicture (
    idTourPicture int not null auto_increment,
    idTour int not null,
    picture varchar(45) not null,
    primary key (idTourPicture),
    foreign key (idTour) references tour (idTour)
);

create table if not exists comment (
    idComment int not null auto_increment,
    idUser int not null,
    idTour int not null,
    comment varchar(500) not null,
    stars int not null,
    primary key (idComment),
    foreign key (idUser) references user (idUser),
    foreign key (idTour) references tour (idTour)
);

create table if not exists favorite (
    idFavorite int not null auto_increment,
    idUser int not null,
    idTour int not null,
    primary key (idFavorite),
    foreign key (idUser) references user (idUser),
    foreign key (idTour) references tour (idTour)
);

