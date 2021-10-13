import React from "react";

import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import PlaceItem from "./PlaceItem";

import classes from "./PlaceList.module.css";

const PlaceList = (props) => {
  if (props.places.length === 0) {
    // Might want to change the message based on the user and non-user
    return (
      <div className={`${classes.placeList} center`}>
        <Card>
          <h2>No places found. Maybe create one?</h2>
          <Button to="/places/new">Share Place</Button>
        </Card>
      </div>
    );
  }

  // To understand the structure of place.variables..., Look at the model from the backend folder or the MongoDB Atlas
  return (
    <ul className={classes.placeList}>
      {props.places.map((place) => (
        <PlaceItem
          key={place.id}
          id={place.id}
          image={place.image}
          title={place.title}
          description={place.description}
          address={place.address}
          creatorId={place.creator}
          coordinates={place.location}
          onDelete={props.onDeletePlace}
        />
      ))}
    </ul>
  );
};

export default PlaceList;
