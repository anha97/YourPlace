import React, { useState } from "react";

import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import Map from "../../shared/components/UIElements/Map";

import classes from "./PlaceItem.module.css";

const PlaceItem = (props) => {
  const [showMap, setShowMap] = useState(false);

  const toggleMap = () => {
    setShowMap(!showMap);
  };

  // Modal will trigger if only showMap is true
  return (
    <React.Fragment>
      <Modal
        show={showMap}
        onCancel={toggleMap}
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={toggleMap}>CLOSE</Button>}
      >
        <div className="map-container">
          <Map center={props.coordinates} />
        </div>
      </Modal>
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
            {/* Regular button */}
            <Button inverse onClick={toggleMap}>
              VIEW ON MAP
            </Button>
            {/* Link button */}
            <Button to={`/places/${props.id}`}>EDIT</Button>
            {/* Regular button */}
            <Button danger>DELETE</Button>
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default PlaceItem;
