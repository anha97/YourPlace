import React from "react";
import { NavLink, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { authActions } from "../../../store/auth-slice";

import "./NavLinks.css";

const NavLinks = (props) => {
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.auth.isLoggedIn);
  const uid = useSelector((state) => state.auth.userId);
  const history = useHistory();

  const logoutHandler = () => {
    dispatch(authActions.logout());
    history.push('/');
  };

  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/" exact>
          ALL USERS
        </NavLink>
      </li>
      {userLogin && (
        <li>
          <NavLink to={`/${uid}/places`}>MY PLACES</NavLink>
        </li>
      )}
      {userLogin && (
        <li>
          <NavLink to="/places/new">ADD PLACE</NavLink>
        </li>
      )}
      {!userLogin && (
        <li>
          <NavLink to="/auth">AUTHENTICATE</NavLink>
        </li>
      )}
      {userLogin && (
        <li>
          <button onClick={logoutHandler}>LOGOUT</button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
