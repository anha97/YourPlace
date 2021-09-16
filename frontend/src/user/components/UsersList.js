import React from "react";

import UserItem from "./UserItem";

import classes from "./UsersList.module.css";

const UsersList = (props) => {
  if (props.users.length === 0) {
    return (
      <div className="centered">
        <h2>No users found.</h2>
      </div>
    );
  }

  return (
    <ul className={classes.userList}>
      {props.users.map((user) => (
        <UserItem
          key={user.id}
          id={user.id}
          name={user.name}
          image={user.image}
          placeCount={user.places}
        />
      ))}
    </ul>
  );
};

export default UsersList;
