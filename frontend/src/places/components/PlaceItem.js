import React from "react";

import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";

import classes from "./PlaceItem.module.css";

const PlaceItem = (props) => {
  return (
    <li className={classes.placeItem}>
      <Card className={classes.placeItem__content}>
        <div className={classes.placeItem__image}>
          <img src={props.image} alt={props.title} />
        </div>
        <div className={classes.placeItem__info}>
          <h2>{props.title}</h2>
          <h3>{props.address}</h3>
          <p>{props.description}</p>
        </div>
        <div className={classes.placeItem__actions}>
          <Button inverse>VIEW ON MAP</Button>
          <Button to={`/places/${props.id}`}>EDIT</Button>
          <Button danger>DELETE</Button>
        </div>
      </Card>
    </li>
  );
};

export default PlaceItem;
