import { useEffect, useState } from "react";

import api from "../../services/api";
import UserNavbar from "./UserNavbar";

import StoreSearch from "./StoreSearch";

import StoreCard from "./StoreCard";


const Userdashboard = () => {

    const [stores, setStores] = useState([]);

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    const ratedStores = stores.filter((store) => store.userRating).length;


    // Fetch stores
    const fetchStores = async (searchValue = "") => {

        try {

            setLoading(true);

            setError("");


            const token = localStorage.getItem("token");

            const response = await api.get("/user/stores", {

                params: {
                    search: searchValue
                },

                headers: {
                    Authorization: `Bearer ${token}`
                }

            });


            setStores(response.data.stores || []);

        }

        catch (error) {

            console.error("Get stores error:", error);

            setError(error.response?.data?.message || "Failed to load stores");

        }

        finally {

            setLoading(false);

        }

    };


    // Load stores when page opens
    useEffect(() => {

        fetchStores();

    }, []);


    // Search
    const handleSearch = () => {

        fetchStores(search);

    };


    // Clear search
    const handleClear = () => {

        setSearch("");

        fetchStores();

    };


    // Submit rating
    const handleRatingSubmit = async (storeId, rating) => {

        try {

            const token = localStorage.getItem("token");

            await api.post("/user/ratings", {

                storeId: storeId,

                rating: rating
            },

                {

                    headers: {
                        Authorization: `Bearer ${token}`
                    }

                }

            );


            fetchStores(search);

        }

        catch (error) {

            console.error("Submit rating error:", error);

            setError(error.response?.data?.message || "Failed to submit rating");

        }

    };


    // Update rating
    const handleRatingUpdate = async (storeId, rating) => {

        try {

            const token = localStorage.getItem("token");


            await api.put(`/user/ratings/${storeId}`, {

                rating: rating

            },

                {

                    headers: {
                        Authorization: `Bearer ${token}`
                    }

                }

            );


            fetchStores(search);

        }

        catch (error) {

            console.error("Update rating error:", error);

            setError(error.response?.data?.message || "Failed to update rating");

        }

    };


    return (

        <div className=" min-h-screen bg-gray-50 ">

            <UserNavbar />


            {/* Main Content */}
            <main className=" mx-auto max-w-7xl px-6 py-8 lg:px-8 ">

                {/* Heading */}
                <div className=" mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between ">

                    <div>

                        <h1 className=" text-3xl font-bold text-gray-900 "> Stores </h1>

                        <p className=" mt-2 text-gray-600 "> Find stores and submit your ratings. </p>

                    </div>


                    <div className=" grid w-full grid-cols-2 gap-3 sm:w-auto ">

                        <div className=" rounded-lg border border-gray-200 bg-white px-5 py-4 shadow-sm ">
                            <p className=" text-sm font-medium text-gray-500 "> Stores </p>

                            <p className=" mt-1 text-2xl font-bold text-gray-900 "> {stores.length} </p>
                        </div>

                        <div className=" rounded-lg border border-gray-200 bg-white px-5 py-4 shadow-sm ">
                            <p className=" text-sm font-medium text-gray-500 "> Rated </p>

                            <p className=" mt-1 text-2xl font-bold text-gray-900 "> {ratedStores} </p>
                        </div>

                    </div>

                </div>


                {/* Search */}
                <StoreSearch search={search} setSearch={setSearch} onSearch={handleSearch} onClear={handleClear} />


                {/* Error */}
                {error && (<div className=" mt-6 rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-red-700 "> {error} </div>)}


                {/* Loading */}
                {loading && (<div className=" mt-8 rounded-lg border border-gray-200 bg-white px-6 py-10 text-center text-gray-600 shadow-sm "> Loading stores... </div>)}


                {/* No Stores */}
                {!loading && stores.length === 0 && (<div className=" mt-8 rounded-lg border border-gray-200 bg-white px-6 py-10 text-center text-gray-600 shadow-sm "> No stores found. </div>)}


                {/* Store List */}
                {!loading &&
                    stores.length > 0 && (

                        <div className=" mt-8 grid grid-cols-1 gap-5 xl:grid-cols-2 ">
                            {stores.map((store) => (
                                <StoreCard
                                    key={store.id}

                                    store={store}

                                    onRatingSubmit={handleRatingSubmit}

                                    onRatingUpdate={handleRatingUpdate}
                                />

                            ))}

                        </div>

                    )
                }

            </main>

        </div>

    );

};


export default Userdashboard;
