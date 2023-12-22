import { useState, useCallback, useEffect } from "preact/hooks";
import Router, { route } from "preact-router";

import "cirrus-ui";
import Header from "./components/header";
import Footer from "./components/footer";

import ErrorRoute from "./routes/error";
import Home from "./routes/home";
import Login from "./routes/login";
import Profile from "./routes/profile";
import Challenges from "./routes/challs";
import Scoreboard from "./routes/scoreboard";
import CtftimeCallback from "./routes/ctftime-callback";

import AdminChallenges from "./routes/admin/challs";

import { ToastProvider } from "./components/toast";

function useTriggerRerender() {
  const setToggle = useState(false)[1];
  return useCallback(() => setToggle((t) => !t), [setToggle]);
}

const makeRedir = (to) => () => {
  useEffect(() => route(to, true), []);
  return null;
};
const LoggedOutRedir = makeRedir("/");
const LoggedInRedir = makeRedir("/profile");

export function App() {
  const triggerRerender = useTriggerRerender();

  const loggedOut = !localStorage.token;

  const loggedOutPaths = [<Login key="login" path="/login" name="Login" />];

  const loggedInPaths = [
    <Profile key="profile" path="/profile" name="Profile" />,
    <Challenges key="challs" path="/challs" name="Challenges" />,
    <AdminChallenges key="adminChalls" path="/admin/challs" />,
  ];

  const allPaths = [
    <ErrorRoute key="error" default error="404" />,
    <Home key="home" path="/" name="Home" />,
    <Scoreboard key="scoreboard" path="/scores" name="Scoreboard" />,
    <Profile key="multiProfile" path="/profile/:uuid" />,
    <CtftimeCallback
      key="ctftimeCallback"
      path="/integrations/ctftime/callback"
    />,
  ];

  loggedInPaths.forEach((route) =>
    loggedOutPaths.push(
      <LoggedOutRedir
        key={`loggedOutRedir-${route.props.path}`}
        path={route.props.path}
      />
    )
  );
  loggedOutPaths.forEach((route) =>
    loggedInPaths.push(
      <LoggedInRedir
        key={`loggedInRedir-${route.props.path}`}
        path={route.props.path}
      />
    )
  );
  const currentPaths = [
    ...allPaths,
    ...(loggedOut ? loggedOutPaths : loggedInPaths),
  ];
  const headerPaths = currentPaths.filter(
    (route) => route.props.name !== undefined
  );

  return (
    <div>
      <ToastProvider>
        <Header paths={headerPaths} />
        <div>
          <Router onChange={triggerRerender}>{currentPaths}</Router>
        </div>
        <Footer />
      </ToastProvider>
    </div>
  );
}
