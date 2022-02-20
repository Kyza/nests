import type { Component } from "solid-js";
import { Link, useRoutes, useLocation } from "solid-app-router";

import { routes } from "./routes";

import styles from "./app.module.css";
import NavBar, { NavBarLink } from "./components/NavBar";

const App: Component = () => {
	const location = useLocation();
	const Route = useRoutes(routes);

	return (
		<>
			<NavBar>
				<NavBarLink path="/" exact>
					Select
				</NavBarLink>
				<NavBarLink path="/inspect">Inspect</NavBarLink>
				<NavBarLink path="/about">About</NavBarLink>
			</NavBar>

			<main class={styles.main}>
				<Route />
			</main>
		</>
	);
};

export default App;
