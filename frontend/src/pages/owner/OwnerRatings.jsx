import { useEffect, useState } from "react";
import api from "../../services/api";
import OwnerNavbar from "./OwnerNavbar.jsx";

const OwnerRatings = () => {
    const [ratings, setRatings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    useEffect(() => {
        const fetchRatings = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await api.get("/owner/ratings", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setRatings(response.data.ratings || []);
            } catch (error) {
                console.error("Owner ratings error:", error);
                setError(error.response?.data?.message || "Failed to fetch ratings");
            } finally {
                setLoading(false);
            }
        };

        fetchRatings();
    }, []);

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
                            Ratings
                        </h1>

                        <p className="mt-2 text-gray-500">
                            View ratings given by your customers.
                        </p>
                    </div>

                    {loading && (
                        <p className="text-gray-600">Loading ratings...</p>
                    )}

                    {error && (
                        <p className="text-red-600">{error}</p>
                    )}

                    {!loading && !error && ratings.length === 0 && (
                        <p className="text-gray-500">No ratings found.</p>
                    )}

                    <div className="grid gap-4">
                        {!loading && !error && ratings.map((rating) => (
                            <div
                                key={rating.id}
                                className="rounded bg-white p-5 shadow"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold text-gray-900">
                                            {rating.name}
                                        </p>

                                        <p className="mt-2 text-2xl text-yellow-500">
                                            {showStars(rating.rating)}
                                        </p>
                                    </div>

                                    <div className="text-2xl font-bold text-gray-900">
                                        {rating.rating}/5
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default OwnerRatings;
