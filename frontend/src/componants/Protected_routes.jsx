import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../services/api";

const ProtectedRoute = ({ children, allowedRole }) => {

    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {

        const checkUser = async () => {

            const token = localStorage.getItem("token");

            if (!token) {
                setLoading(false);
                return;
            }

            try {

                const response = await api.get("/users/me",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setUser(response.data.user);

            } catch (error) {
                 console.error(error);

                localStorage.removeItem("token");

            } finally {

                setLoading(false);
            }
        };

        checkUser();

    }, []);


    if (loading) {
        return <h2>Loading...</h2>;
    }


    if (!user) {
        return <Navigate to="/" />;
    }


    const allowedRoles = Array.isArray(allowedRole) ? allowedRole : [allowedRole];

    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/" />;
    }


    return children;
};

export default ProtectedRoute;

