import { Link, useLocation } from "solid-app-router";
import { Component, For, JSX, JSXElement } from "solid-js";

import styles from "./NavBar.module.css";

type ManualHeading = {
	children: string;
	onClick: (
		event: MouseEvent & {
			currentTarget: HTMLAnchorElement;
			target: Element;
		}
	) => void;
	selected: boolean;
};

type AutomaticHeading = {
	children: string;
	path: string;
	exact?: boolean;
};

function isAutomatic(obj: any): obj is AutomaticHeading {
	return obj.path !== undefined;
}

export const NavBarLink: Component<AutomaticHeading | ManualHeading> = (
	props
) => {
	const location = useLocation();
	if (isAutomatic(props)) {
		return (
			<Link
				classList={{
					[styles.link]: true,
					[styles.selected]: props.exact
						? location.pathname === props.path
						: location.pathname.startsWith(props.path),
				}}
				href={props.path}
			>
				{props.children}
			</Link>
		);
	}
	return (
		<Link
			classList={{
				[styles.link]: true,
				[styles.selected]: props.selected,
			}}
			onClick={(e) => (e.preventDefault(), props.onClick(e))}
			href=""
		>
			{props.children}
		</Link>
	);
};

const NavBar: Component<{
	children: typeof NavBarLink[];
}> = (props) => {
	return <nav class={styles.header}>{props.children}</nav>;
};

export default NavBar;
