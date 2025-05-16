// import { Link } from "react-router-dom";

// export const Navbar = () => {

// 	return (
// 		<nav className="navbar navbar-light bg-light">
// 			<div className="container">
// 				<Link to="/">
// 					<span className="navbar-brand mb-0 h1">React Boilerplate</span>
// 				</Link>
// 				<div className="ml-auto">
// 					<Link to="/demo">
// 						<button className="btn btn-primary">Check the Context in action</button>
// 					</Link>
// 				</div>
// 			</div>
// 		</nav>
// 	);
// };

import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Navbar = () => {
	const { store, dispatch } = useGlobalReducer();
	const navigate = useNavigate();

	const handleLogout = () => {
		dispatch({ type: "auth_logout" });
		navigate("/login");
	};

	return (
		<nav className="navbar navbar-expand-lg navbar-light bg-light">
			<div className="container">
				<Link to="/" className="navbar-brand">
					<span className="navbar-brand mb-0 h1">React Auth Demo</span>
				</Link>

				<button
					className="navbar-toggler"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#navbarNav"
				>
					<span className="navbar-toggler-icon"></span>
				</button>

				<div className="collapse navbar-collapse" id="navbarNav">
					<ul className="navbar-nav me-auto">
						<li className="nav-item">
							<Link to="/" className="nav-link">Home</Link>
						</li>
						{store.auth.isAuthenticated && (
							<li className="nav-item">
								<Link to="/private" className="nav-link">Private Area</Link>
							</li>
						)}
						<li className="nav-item">
							<Link to="/demo" className="nav-link">Demo</Link>
						</li>
					</ul>

					<div className="d-flex">
						{store.auth.isAuthenticated ? (
							<>
								<span className="navbar-text me-3">
									{store.auth.user?.email}
								</span>
								<button
									onClick={handleLogout}
									className="btn btn-outline-danger"
								>
									Logout
								</button>
							</>
						) : (
							<>
								<Link to="/login" className="btn btn-outline-primary me-2">
									Login
								</Link>
								<Link to="/signup" className="btn btn-primary">
									Sign Up
								</Link>
							</>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
};