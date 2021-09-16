import React from "react";
import UsersList from "../components/UsersList";

const Users = () => {
  const USERS = [
    {
      id: "u1",
      name: "Bob",
      image:
        "https://images.unsplash.com/photo-1630313877297-8773445184b9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      places: 3,
    },
  ];

  return <UsersList users={USERS} />;
};

export default Users;
