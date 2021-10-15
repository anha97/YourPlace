import React, { useEffect, Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { authActions } from "./store/auth-slice";

import MainNavigation from "./shared/components/Navigation/MainNavigation";
import LoadingSpinner from "./shared/components/UIElements/LoadingSpinner";

let logoutTimer;

const NewPlace = React.lazy(() => import("./places/pages/NewPlace"));
const Users = React.lazy(() => import("./user/pages/Users"));
const UserPlaces = React.lazy(() => import("./places/pages/UserPlaces"));
const UpdatePlace = React.lazy(() => import("./places/pages/UpdatePlaces"));
const Auth = React.lazy(() => import("./user/pages/Auth"));

function App() {
  const token = useSelector((state) => state.auth.token);
  const expirationDate = useSelector((state) => state.auth.tokenExpirationDate);
  const dispatch = useDispatch();

  useEffect(() => {
    if (
      token &&
      expirationDate.getTime() - new Date().getTime < new Date().getTime()
    ) {
      const remainingTime = expirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(dispatch(authActions.logout(), remainingTime));
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, dispatch, expirationDate]);

  // Check local storage to see if there is a user's info, automatically logging you in.
  // You stored user's info on localStorage at auth-slice.js file btw
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));

    // In if statement, the third one means if the expiration is greater than the current date, then it's not expired.
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      dispatch(
        authActions.login({
          id: storedData.userId,
          token: storedData.token,
          expirationDate: new Date(storedData.expiration),
        })
      );
    }
  }, [dispatch]);

  let routes;
  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/places/new" exact>
          <NewPlace />
        </Route>
        <Route path="/places/:placeId">
          <UpdatePlace />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    // If you were to add a new place while not logging in. It will redirect you to /auth page instead
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/auth">
          <Auth />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    );
  }

  return (
    <Router>
      <MainNavigation />
      <main>
        <Suspense
          fallback={
            <div className="center">
              <LoadingSpinner />
            </div>
          }
        >
          {routes}
        </Suspense>
      </main>
    </Router>
  );
}

export default App;
