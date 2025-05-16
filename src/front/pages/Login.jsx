import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            dispatch({ type: "auth_loading" });

            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const response = await fetch(`${backendUrl}/api/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Invalid credentials");
            }

            // Autenticación exitosa, guardar datos
            dispatch({
                type: "auth_success",
                payload: {
                    token: data.token,
                    user: { id: data.user_id, email: data.email }
                }
            });

            // Redireccionar a la página privada
            navigate("/private");

        } catch (error) {
            console.error("Login error:", error);
            dispatch({ type: "auth_error", payload: error.message });
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title text-center mb-4">Log In</h2>

                            {store.auth.error && (
                                <div className="alert alert-danger" role="alert">
                                    {store.auth.error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="d-grid">
                                    <button type="submit" className="btn btn-primary" disabled={store.auth.loading}>
                                        {store.auth.loading ? "Loading..." : "Log In"}
                                    </button>
                                </div>
                            </form>

                            <div className="mt-3 text-center">
                                <p>
                                    Don't have an account?{" "}
                                    <a href="#" onClick={(e) => { e.preventDefault(); navigate("/signup"); }}>
                                        Sign Up
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};