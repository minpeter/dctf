import { useState, useCallback, useEffect } from "preact/hooks";
import Router, { route } from "preact-router";
import toast, { Toaster, useToasterStore } from "react-hot-toast";
const TOAST_LIMIT = 2;

import "cirrus-ui";
import "./styles/reset-cirrus.css";
import "./styles/global.css";

import Header from "./components/header";
import Footer from "./components/footer";

import ErrorRoute from "./routes/error";
import Home from "./routes/home";
import Login from "./routes/login";
import Profile from "./routes/profile";
import Challenges from "./routes/challs";
import Scoreboard from "./routes/scoreboard";
import GithubCallback from "./routes/github-callback";

import AdminChallenges from "./routes/admin/challs";

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
    <GithubCallback
      key="githubCallback"
      path="/integrations/github/callback"
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

  const { toasts } = useToasterStore();

  // Enforce Limit
  useEffect(() => {
    toasts
      .filter((t) => t.visible) // Only consider visible toasts
      .filter((_, i) => i >= TOAST_LIMIT) // Is toast index over limit
      .forEach((t) => toast.dismiss(t.id)); // Dismiss – Use toast.remove(t.id) removal without animation
  }, [toasts]);

  return (
    <div class="h-100p u-flex u-flex-column  u-justify-space-between u-items-center">
      <div class="w-100p">
        <Header paths={headerPaths} />
        <Router onChange={triggerRerender}>{currentPaths}</Router>
      </div>
      <Footer />
      <Toaster position="bottom-center" reverseOrder={false} />
    </div>
  );
}
