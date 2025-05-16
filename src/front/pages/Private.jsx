import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Private = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    useEffect(() => {
        // Verificar si hay un token en el estado
        if (!store.auth.token) {
            // No hay token, redirigir al login
            navigate("/login");
            return;
        }

        // Verificar que el token sea válido haciendo una petición al backend
        const validateToken = async () => {
            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                const response = await fetch(`${backendUrl}/api/validate`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${store.auth.token}`
                    }
                });

                if (!response.ok) {
                    // Token inválido o expirado
                    throw new Error("Invalid token");
                }

                // Token válido, obtener datos del usuario
                const userData = await response.json();

                // Actualizar información del usuario si es necesario
                if (JSON.stringify(userData) !== JSON.stringify(store.auth.user)) {
                    dispatch({
                        type: "auth_success",
                        payload: {
                            token: store.auth.token,
                            user: userData
                        }
                    });
                }
            } catch (error) {
                console.error("Token validation error:", error);
                // Error en la validación, limpiar la autenticación y redirigir al login
                dispatch({ type: "auth_logout" });
                navigate("/login");
            }
        };

        validateToken();
    }, [store.auth.token, navigate, dispatch]);

    // Si no está autenticado o está cargando, mostrar un loader
    if (!store.auth.isAuthenticated) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "70vh" }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <div className="card">
                <div className="card-body">
                    <h2 className="card-title">Welcome to the Private Area</h2>
                    <div className="alert alert-success">
                        <p className="mb-0">
                            You are logged in as <strong>{store.auth.user?.email}</strong>
                        </p>
                    </div>
                    <p>This is a protected page that only authenticated users can access.</p>
                    <p>You can add more private content here.</p>
                </div>
            </div>
        </div>
    );
};