import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoadingRoute = () => {
    const { currentUser, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>; // You can replace this with a spinner or loading animation
    }

    return currentUser ? <Outlet /> : <Navigate to="/login" />;
}

export default LoadingRoute;