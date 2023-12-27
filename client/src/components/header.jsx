import Match from "preact-router/match";
import LogoutButton from "./logout-button";

export default function Header({ paths }) {
  const loggedIn = localStorage.getItem("token") !== null;

  return (
    <div class="tab-container tabs--center tabs--xs">
      <ul>
        {paths.map(({ props: { path, name } }) => (
          <Match key={name} path={path}>
            {({ matches }) => (
              <li class={matches ? "selected" : ""}>
                <a href={path}>{name}</a>
              </li>
            )}
          </Match>
        ))}
        {loggedIn && (
          <li>
            <LogoutButton />
          </li>
        )}
      </ul>
    </div>
  );
}
