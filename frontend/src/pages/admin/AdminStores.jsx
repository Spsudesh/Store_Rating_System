import { useEffect, useState } from "react";

import api from "../../services/api";



const AdminStores = () => {


    const [stores, setStores] = useState([]);

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [sortConfig, setSortConfig] = useState({
        key: "",
        direction: "asc"
    });


    const handleSort = (key) => {

        setSortConfig((previous) => ({
            key: key,
            direction: previous.key === key && previous.direction === "asc" ? "desc" : "asc"
        }));

    };


    const getSortIcon = (key) => {

        if (sortConfig.key !== key) {
            return "↕";
        }

        return sortConfig.direction === "asc" ? "↑" : "↓";

    };


    const getStoreRating = (store) => {

        if (!store.store_rating) {
            return "No ratings";
        }

        return `${Number(store.store_rating).toFixed(1)} / 5`;

    };


    const sortedStores = [...stores].sort((a, b) => {

        if (!sortConfig.key) {
            return 0;
        }

        const firstValue = a[sortConfig.key] || "";
        const secondValue = b[sortConfig.key] || "";

        if (sortConfig.key === "id" || sortConfig.key === "store_rating") {
            return sortConfig.direction === "asc" ? firstValue - secondValue : secondValue - firstValue;
        }

        return sortConfig.direction === "asc"
            ? String(firstValue).localeCompare(String(secondValue))
            : String(secondValue).localeCompare(String(firstValue));

    });


    // Fetch stores

    const fetchStores = async (searchValue = search) => {

        setLoading(true);

        setError("");


        try {

            const token =
                localStorage.getItem("token");


            const response = await api.get( "/admin/stores",
                    {

                        params: {

                            search: searchValue.trim()
                        },

                        headers: {

                            Authorization: `Bearer ${token}`

                        }

                    }

                );


            setStores(
                response.data.stores || []
            );

        }


        catch (error) {

            console.error( "Get stores error:", error );

            setError( error.response?.data?.message || "Failed to fetch stores" );

        }

        finally {

            setLoading(false);

        }

    };



    // Load stores when page opens

    useEffect(() => {

        fetchStores(search);

    }, []);



    // Search
    const handleSearch = (e) => {

        e.preventDefault();

        fetchStores();

    };



    // Clear search
    const handleClear = () => {

        setSearch("");

        fetchStores("");

    };



    return (

        <div className=" min-h-screen bg-white px-8 py-8 ">

            <div className=" mx-auto w-full max-w-7xl ">


                {/*  Heading */}
                <div className="mb-8">
                        <h1 className=" text-3xl font-bold text-gray-900 "> Manage Stores </h1>

                        <p className=" mt-2 text-gray-600 "> Add, search and manage stores. </p>

                </div>



                {/* Search  */}

                <form onSubmit={handleSearch} className=" mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm " >

                    <div className=" flex items-end gap-4 ">
                        
                        <div className="flex-1">

                            <label htmlFor="search" className=" mb-2 block text-sm font-semibold text-gray-800 " > Search Stores </label>

                            <input id="search" type="text" value={search} onChange={(e) => { setSearch( e.target.value ); }}
                                placeholder=" Search by store name, email, address or owner " className=" w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 "
                            />

                        </div>



                        {/* Search Button */}
                             <button type="submit" disabled={loading} className=" rounded-lg bg-blue-600 px-7 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 " > {loading ? "Searching..." : "Search" } </button>


                        {/* Clear Button */}
                        <button type="button" onClick={handleClear} className=" rounded-lg border border-gray-300 bg-white px-7 py-3 font-medium text-gray-700 hover:bg-gray-50 " > Clear </button>

                    </div>

                </form>



                {/* Error */}
                {error && ( <div className=" mb-6 rounded-lg border border-red-200 bg-white px-5 py-4 text-red-600 "> {error} </div> )}


                {/* Stores Table */}
                <div className=" overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm ">

                <div className=" overflow-x-auto ">
                        <table className=" w-full min-w-[900px] ">


                            <thead>

                                <tr className=" border-b border-gray-200 ">

                                    <th className=" px-7 py-5 text-left text-sm font-semibold text-gray-800 ">
                                        <button type="button" onClick={() => handleSort("id")} className=" flex items-center gap-2 font-semibold ">
                                            ID <span>{getSortIcon("id")}</span>
                                        </button>
                                    </th>

                                    <th className=" px-7 py-5 text-left text-sm font-semibold text-gray-800 ">
                                        <button type="button" onClick={() => handleSort("name")} className=" flex items-center gap-2 font-semibold ">
                                            Store Name <span>{getSortIcon("name")}</span>
                                        </button>
                                    </th>
                                    <th className=" px-7 py-5 text-left text-sm font-semibold text-gray-800 ">
                                        <button type="button" onClick={() => handleSort("email")} className=" flex items-center gap-2 font-semibold ">
                                            Email <span>{getSortIcon("email")}</span>
                                        </button>
                                    </th>
                                    <th className=" px-7 py-5 text-left text-sm font-semibold text-gray-800 ">
                                        <button type="button" onClick={() => handleSort("address")} className=" flex items-center gap-2 font-semibold ">
                                            Address <span>{getSortIcon("address")}</span>
                                        </button>
                                    </th>

                                    <th className=" px-7 py-5 text-left text-sm font-semibold text-gray-800 ">
                                        <button type="button" onClick={() => handleSort("owner_name")} className=" flex items-center gap-2 font-semibold ">
                                            Owner <span>{getSortIcon("owner_name")}</span>
                                        </button>
                                    </th>

                                    <th className=" px-7 py-5 text-left text-sm font-semibold text-gray-800 ">
                                        <button type="button" onClick={() => handleSort("store_rating")} className=" flex items-center gap-2 font-semibold ">
                                            Rating <span>{getSortIcon("store_rating")}</span>
                                        </button>
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {loading ? (

                                    <tr>

                                        <td colSpan="6" className=" px-7 py-10 text-center text-gray-500 " > Loading stores... </td>

                                    </tr>

                                ) : stores.length === 0 ? (

                                    <tr>

                                        <td colSpan="6" className=" px-7 py-10 text-center text-gray-500 " > No stores found. </td>

                                    </tr>

                                ) : (

                                    sortedStores.map(
                                        (store) => (

                                            <tr key={ store.id } className=" border-b border-gray-200 last:border-b-0 " >

                                                <td className=" px-7 py-5 text-sm text-gray-800 "> {store.id} </td>

                                                <td className=" px-7 py-5 text-sm font-medium text-gray-900 "> {store.name} </td>

                                                <td className=" px-7 py-5 text-sm text-gray-700 "> {store.email} </td>

                                                <td className=" px-7 py-5 text-sm text-gray-700 "> {store.address} </td>

                                                <td className=" px-7 py-5 text-sm text-gray-700 "> {store.owner_name} </td>

                                                <td className=" px-7 py-5 text-sm text-gray-700 "> {getStoreRating(store)} </td>
                                            </tr>

                                        )

                                    )

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>


            </div>

        </div>

    );

};


export default AdminStores;
