import React, { useState, useMemo, useEffect } from "react";
import { connect } from "react-redux";
import Cookies from "js-cookie";
import { Route, Switch, Redirect } from "react-router-dom";
import RegisterPage from "./pages/register/register";
import SignInPage from "./pages/sign-in/sign-in";
import HomePage from "./pages/home/home";
import ProductsPage from "./pages/products/products";
import ProfilePage from "./pages/profile/profile";
import AdminRoute from "./pages/admin/admin-main";
import Header from "./components/header/header";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import ThemeContext from "./contexts/theme.context";

import { selectCurrentUser } from "./redux/user/user.selector";
import { checkUserSession } from "./redux/user/user.actions";

// const RegisterPage = lazy(() => import("./pages/register/register"));
const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
    navBar: {
      main: "#2d3436",
    },
    text: {
      main: "#f1f2f6",
    },
  },
});

const lightTheme = createMuiTheme({
  palette: {
    type: "light",
    navBar: {
      main: "#f1f2f6",
    },
    text: {
      main: "#2d3436",
    },
  },
});
const App = ({ currUser, checkUserSession }) => {
  useEffect(() => {
    console.log("run Effect Check User S");
    checkUserSession();
  }, [checkUserSession]);

  const [night, setNight] = useState(false);
  useEffect(() => {
    if (Cookies.get("isNight") !== "true") setNight(true);
  }, []);
  const themeValue = useMemo(() => {
    return { night, setNight };
  }, [night, setNight]);
  const theme = night ? darkTheme : lightTheme;
  console.log("CURRENT USER IN APP : ", currUser);
  return (
    <div>
      <ThemeProvider theme={theme}>
        <ThemeContext.Provider value={themeValue}>
          <Header />
        </ThemeContext.Provider>

        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route
            exact
            path="/register"
            render={() => (currUser ? <Redirect to="/" /> : <RegisterPage />)}
          />
          <Route
            exact
            path="/sign-in"
            render={() => (currUser ? <Redirect to="/" /> : <SignInPage />)}
          />
          <Route exact path="/products" component={ProductsPage} />
          <AdminRoute path="/admin" />
          <Route
            exact
            path="/profiles"
            render={() =>
              currUser ? <ProfilePage /> : <Redirect to="/sign-in" />
            }
          />
        </Switch>
      </ThemeProvider>
    </div>
  );
};

const mapStateToProp = (state) => ({
  currUser: selectCurrentUser(state),
});

const mapDispatchToProps = (dispatch) => ({
  checkUserSession: () => dispatch(checkUserSession()),
});

export default connect(mapStateToProp, mapDispatchToProps)(App);
