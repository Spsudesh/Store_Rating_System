import { useEffect, useState } from "react";

import api from "../../services/api";


const AdminUsers = () => {

    const [users, setUsers] = useState([]);

    const [search, setSearch] = useState("");

    const [role, setRole] = useState("ALL");

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [selectedUser, setSelectedUser] = useState(null);

    const [sortConfig, setSortConfig] = useState({
        key: "",
        direction: "asc"
    });


    const roleLabels = {
        ADMIN: "Admin",
        USER: "User",
        STORE_OWNER: "Store Owner"
    };


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


    const getStoreRating = (user) => {

        if (user.role !== "STORE_OWNER") {
            return "-";
        }

        if (!user.store_rating) {
            return "No ratings";
        }

        return `${Number(user.store_rating).toFixed(1)} / 5`;

    };


    const sortedUsers = [...users].sort((a, b) => {

        if (!sortConfig.key) {
            return 0;
        }

        const firstValue = a[sortConfig.key] || "";
        const secondValue = b[sortConfig.key] || "";

        if (sortConfig.key === "id" || sortConfig.key === "total_stores") {
            return sortConfig.direction === "asc"
                ? Number(firstValue) - Number(secondValue)
                : Number(secondValue) - Number(firstValue);
        }

        return sortConfig.direction === "asc"
            ? String(firstValue).localeCompare(String(secondValue))
            : String(secondValue).localeCompare(String(firstValue));

    });


    // Fetch users
    const fetchUsers = async (searchValue = search, roleValue = role) => {

        setLoading(true);

        setError("");


        try {

            const token = localStorage.getItem("token");

            const params = {};


            if (searchValue.trim() !== "") {
                params.search = searchValue.trim();
            }


            if (roleValue !== "ALL") {
                params.role = roleValue;
            }


            const response = await api.get("/admin/users",
                {
                    params: params,

                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );


            setUsers(response.data.users || []);

        }

        catch (error) {

            console.error("Get users error:", error);

            setError(error.response?.data?.message || "Failed to load users");

        }

        finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchUsers(search, role);

    }, []);


    const handleSearch = (e) => {

        e.preventDefault();

        fetchUsers();

    };


    const handleClear = () => {

        setSearch("");

        setRole("ALL");

        fetchUsers("", "ALL");

    };


    return (

        <div className=" min-h-screen bg-white px-8 py-8 ">

            <div className=" mx-auto w-full max-w-7xl ">

                {/* Heading */}
                <div className=" mb-8 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between ">

                    <div>
                        <h1 className=" text-3xl font-bold text-gray-900 "> Manage Users </h1>

                        <p className=" mt-2 text-gray-600 "> View users and store owner rating details. </p>
                    </div>

                    <div className=" text-sm font-medium text-gray-600 ">
                        Total Users: <span className=" text-gray-900 "> {users.length} </span>
                    </div>

                </div>


                {/* Filters */}
                <form onSubmit={handleSearch} className=" mb-7 rounded-lg border border-gray-200 bg-white p-6 shadow-sm ">

                    <div className=" grid grid-cols-1 gap-5 lg:grid-cols-12 lg:items-end ">

                        <div className=" lg:col-span-5 ">
                            <label htmlFor="search" className=" mb-2 block text-sm font-semibold text-gray-800 "> Search </label>

                            <input id="search" type="text" value={search} onChange={(e) => { setSearch(e.target.value); }} placeholder="Search by name or email" className=" w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 " />
                        </div>


                        <div className=" lg:col-span-3 ">
                            <label htmlFor="role" className=" mb-2 block text-sm font-semibold text-gray-800 "> Role </label>

                            <select id="role" value={role} onChange={(e) => { setRole(e.target.value); }} className=" w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ">
                                <option value="ALL"> All </option>

                                <option value="USER"> User </option>

                                <option value="STORE_OWNER"> Store Owner </option>

                                <option value="ADMIN"> Admin </option>
                            </select>
                        </div>


                        <div className=" flex gap-3 lg:col-span-4 ">
                            <button type="submit" disabled={loading} className=" flex-1 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 ">
                                {loading ? "Searching..." : "Search"}
                            </button>

                            <button type="button" onClick={handleClear} className=" rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-50 ">
                                Clear
                            </button>
                        </div>

                    </div>

                </form>


                {error && (<div className=" mb-6 rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-red-700 "> {error} </div>)}


                {/* Users table */}
                <div className=" overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm ">

                    <div className=" border-b border-gray-200 px-6 py-4 ">
                        <h2 className=" text-base font-semibold text-gray-900 "> Users List </h2>
                    </div>

                    <div className=" overflow-x-auto ">
                        <table className=" w-full min-w-[1050px] ">

                            <thead>
                                <tr className=" border-b border-gray-200 bg-gray-50 ">
                                    <th className=" px-6 py-4 text-left text-sm font-semibold text-gray-800 ">
                                        <button type="button" onClick={() => handleSort("id")} className=" flex items-center gap-2 ">
                                            ID <span>{getSortIcon("id")}</span>
                                        </button>
                                    </th>

                                    <th className=" px-6 py-4 text-left text-sm font-semibold text-gray-800 ">
                                        <button type="button" onClick={() => handleSort("name")} className=" flex items-center gap-2 ">
                                            Name <span>{getSortIcon("name")}</span>
                                        </button>
                                    </th>

                                    <th className=" px-6 py-4 text-left text-sm font-semibold text-gray-800 ">
                                        <button type="button" onClick={() => handleSort("email")} className=" flex items-center gap-2 ">
                                            Email <span>{getSortIcon("email")}</span>
                                        </button>
                                    </th>

                                    <th className=" px-6 py-4 text-left text-sm font-semibold text-gray-800 ">
                                        <button type="button" onClick={() => handleSort("role")} className=" flex items-center gap-2 ">
                                            Role <span>{getSortIcon("role")}</span>
                                        </button>
                                    </th>

                                    <th className=" px-6 py-4 text-left text-sm font-semibold text-gray-800 "> Action </th>
                                </tr>
                            </thead>

                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className=" px-6 py-12 text-center text-gray-500 "> Loading users... </td>
                                    </tr>
                                ) : users.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className=" px-6 py-12 text-center text-gray-500 "> No users found. </td>
                                    </tr>
                                ) : (
                                    sortedUsers.map((user) => (
                                        <tr key={user.id} className=" border-b border-gray-200 last:border-b-0 hover:bg-gray-50 ">
                                            <td className=" px-6 py-5 text-sm text-gray-800 "> {user.id} </td>

                                            <td className=" px-6 py-5 text-sm font-medium text-gray-900 "> {user.name} </td>

                                            <td className=" px-6 py-5 text-sm text-gray-700 "> {user.email} </td>

                                            <td className=" px-6 py-5 ">
                                                <span className="  px-6 py-5 text-sm font-medium text-gray-900 ">
                                                    {roleLabels[user.role] || user.role}
                                                </span>
                                            </td>

                                            <td className=" px-6 py-5 ">
                                                <button type="button" onClick={() => { setSelectedUser(user); }} className=" rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 ">
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>

                        </table>
                    </div>

                </div>

            </div>


            {/* User details modal */}
            {selectedUser && (
                <div className=" fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 ">
                    <div className=" w-full max-w-2xl rounded-lg bg-white shadow-xl ">

                        <div className=" flex items-start justify-between border-b border-gray-200 px-6 py-5 ">
                            <div>
                                <h2 className=" text-xl font-bold text-gray-900 "> User Details </h2>

                                <p className=" mt-1 text-sm text-gray-500 "> {selectedUser.email} </p>
                            </div>

                            <button type="button" onClick={() => { setSelectedUser(null); }} className=" rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ">
                                Close
                            </button>
                        </div>


                        <div className=" grid grid-cols-1 gap-5 px-6 py-6 sm:grid-cols-2 ">

                            <div>
                                <p className=" text-xs font-semibold uppercase text-gray-500 "> Name </p>

                                <p className=" mt-1 text-sm font-medium text-gray-900 "> {selectedUser.name} </p>
                            </div>

                            <div>
                                <p className=" text-xs font-semibold uppercase text-gray-500 "> Role </p>

                                <p className=" mt-1 text-sm font-medium text-gray-900 "> {roleLabels[selectedUser.role] || selectedUser.role} </p>
                            </div>

                            <div className=" sm:col-span-2 ">
                                <p className=" text-xs font-semibold uppercase text-gray-500 "> Address </p>

                                <p className=" mt-1 text-sm leading-6 text-gray-800 "> {selectedUser.address} </p>
                            </div>


                            {selectedUser.role === "STORE_OWNER" && (
                                <>
                                    <div>
                                        <p className=" text-xs font-semibold uppercase text-gray-500 "> Store Rating </p>

                                        <p className=" mt-1 text-sm font-medium text-gray-900 "> {getStoreRating(selectedUser)} </p>
                                    </div>

                                    <div>
                                        <p className=" text-xs font-semibold uppercase text-gray-500 "> Total Ratings </p>

                                        <p className=" mt-1 text-sm font-medium text-gray-900 "> {selectedUser.total_ratings || 0} </p>
                                    </div>

                                    <div className=" sm:col-span-2 ">
                                        <p className=" text-xs font-semibold uppercase text-gray-500 "> Store Name </p>

                                        <p className=" mt-1 text-sm leading-6 text-gray-800 "> {selectedUser.store_names || "No store assigned"} </p>
                                    </div>
                                </>
                            )}

                        </div>

                    </div>
                </div>
            )}

        </div>

    );

};


export default AdminUsers;
