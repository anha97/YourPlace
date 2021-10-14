import React, { useState } from "react";
import { useSelector } from "react-redux";

import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import Map from "../../shared/components/UIElements/Map";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

import { useHttpClient } from "../../shared/hooks/http-hook";

import classes from "./PlaceItem.module.css";

const PlaceItem = (props) => {
  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const uid = useSelector((state) => state.auth.userId);
  const token = useSelector((state) => state.auth.token);

  const toggleMap = () => {
    setShowMap((prevShowMap) => !prevShowMap);
  };

  const toggleConfirm = () => {
    setShowConfirmModal((prevShowConfirm) => !prevShowConfirm);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        `http://localhost:5000/api/places/${props.id}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + token,
        }
      );
      props.onDelete(props.id);
    } catch (err) {}
  };

  // Modal will trigger if only showMap is true
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
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
      <Modal
        show={showConfirmModal}
        onCancel={toggleConfirm}
        header="Are you sure?"
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={toggleConfirm}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </React.Fragment>
        }
      >
        <p>
          Do you want to proceed and delete this place? Please note that it
          can't be undone thereafter.
        </p>
      </Modal>
      <li className={classes.placeItem}>
        <Card className={classes.placeItem__content}>
          {isLoading && <LoadingSpinner asOverlay />}
          <div className={classes.placeItem__image}>
            <img
              src={`http://localhost:5000/${props.image}`}
              alt={props.title}
            />
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
            {uid === props.creatorId && (
              <Button to={`/places/${props.id}`}>EDIT</Button>
            )}
            {/* Regular button */}
            {uid === props.creatorId && (
              <Button danger onClick={toggleConfirm}>
                DELETE
              </Button>
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default PlaceItem;
