import { useEffect, useState } from "react";
import api from "../../services/api";
import OwnerNavbar from "./OwnerNavbar.jsx";


const OwnerDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [ratings, setRatings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    

    useEffect(() => {
        fetchDashboardData();
        fetchRatings();
    }, []);

    const fetchDashboardData = async () => {
        const token = localStorage.getItem("token");

        try {
            const response = await api.get("/owner/dashboard", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setDashboardData(response.data);
        } 
        catch (error) {
            console.error("Owner dashboard error:", error);
            setError(error.response?.data?.message || "Failed to load dashboard");
            
        } finally {
            setLoading(false);
        }
    };

    const fetchRatings = async () => {
        const token = localStorage.getItem("token");

        try {
            const response = await api.get("/owner/ratings", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setRatings(response.data.ratings || []);
        } catch (error) {
            console.error("Owner ratings error:", error);
        }
    };

    const showStars = (rating) => {
        return "★".repeat(Number(rating) || 0);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <OwnerNavbar />

            <main className="p-8">
                <div className="mx-auto max-w-6xl">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Owner Dashboard
                        </h1>

                        <p className="mt-2 text-gray-500">
                            Manage your store ratings from here.
                        </p>
                    </div>

                    {loading && (
                        <p className="text-gray-600">Loading dashboard...</p>
                    )}

                    {error && (
                        <p className="text-red-600">{error}</p>
                    )}

                    {dashboardData && (
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="rounded bg-white p-6 shadow">
                                <p className="text-sm font-medium text-gray-500">
                                    Average Rating
                                </p>

                                <div className="mt-4 flex items-center gap-3">
                                    <h2 className="text-4xl font-bold text-gray-900">
                                        {dashboardData.averageRating}
                                    </h2>

                                    <span className="text-3xl text-yellow-500">
                                        ★
                                    </span>
                                </div>
                            </div>

                            <div className="rounded bg-white p-6 shadow">
                                <p className="text-sm font-medium text-gray-500">
                                    Total Ratings
                                </p>

                                <h2 className="mt-4 text-4xl font-bold text-gray-900">
                                    {dashboardData.totalRatings}
                                </h2>
                            </div>
                        </div>
                    )}

                    <div className="mt-10 rounded bg-white p-6 shadow">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Recent Ratings
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Latest ratings given by your customers.
                        </p>

                        <div className="mt-5 grid gap-4">
                            {ratings.length === 0 && (
                                <p className="text-gray-500">
                                    No ratings found.
                                </p>
                            )}

                            {ratings.slice(0, 3).map((rating) => (
                                <div
                                    key={rating.id}
                                    className="flex items-center justify-between border-b border-gray-200 pb-3"
                                >
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {rating.name}
                                        </p>

                                        <p className="text-xl text-yellow-500">
                                            {showStars(rating.rating)}
                                        </p>
                                    </div>

                                    <p className="font-bold text-gray-900">
                                        {rating.rating}/5
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default OwnerDashboard;
