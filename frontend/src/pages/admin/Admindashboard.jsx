import { useEffect, useState } from "react";

import api from "../../services/api";

import AddUserForm from "./forms/AddUserForm";

import AddStoreForm from "./forms/AddStoreForm";


const Admindashboard = () => {

    const [dashboardData, setDashboardData] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    const [selectedForm, setSelectedForm] = useState( "user" );


    const fetchDashboardData = async () => {

        const token = localStorage.getItem("token");


        try {

            const response = await api.get( "/admin/dashboard",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );


            setDashboardData(response.data);

        }

        catch (error) {
              console.error( "Admin dashboard error", error );

                setError( error.response?.data?.message || "Failed to load admin dashboard" );

        }

        finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchDashboardData();

    }, []);


    return (

        <div className=" min-h-screen bg-white p-8 ">
            <div className=" mx-auto max-w-6xl ">

                
                <div className=" mb-6 ">

                    <h1 className=" text-3xl font-bold text-gray-900 "> Admin Dashboard </h1>

                </div>



                {loading && ( <p className=" text-gray-700 "> Loading dashboard... </p> )}


                {error && ( <p className=" text-red-600 "> {error} </p> )}


                    {dashboardData && ( <div className=" grid gap-4 sm:grid-cols-2 lg:grid-cols-5 ">

                        {/* Total Users */}

                        <div className=" rounded-xl bg-white p-5 shadow-sm border border-gray-100 ">
                            <p className=" text-sm font-semibold text-gray-500 "> Total Users </p>

                            <h2 className=" mt-2 text-3xl font-bold text-gray-900 "> {dashboardData.totalUsers} </h2>
                        </div>



                        {/* Store Owners */}

                        <div className=" rounded-xl bg-white p-5 shadow-sm border border-gray-100 ">

                            <p className=" text-sm font-semibold text-gray-500 "> Store Owners </p>

                            <h2 className=" mt-2 text-3xl font-bold text-gray-900 "> {dashboardData.totalStoreOwners} </h2>

                        </div>



                        {/* Normal Users */}

                        <div className=" rounded-xl bg-white p-5 shadow-sm border border-gray-100 ">
                            <p className=" text-sm font-semibold text-gray-500 "> Normal Users </p>

                            <h2 className=" mt-2 text-3xl font-bold text-gray-900 "> {dashboardData.totalNormalUsers} </h2>
                        </div>



                        {/* Stores */}

                        <div className=" rounded-xl bg-white p-5 shadow-sm border border-gray-100 ">

                            <p className=" text-sm font-semibold text-gray-500 "> Stores </p>

                            <h2 className=" mt-2 text-3xl font-bold text-gray-900 "> {dashboardData.totalStores} </h2>

                        </div>



                        {/* Ratings */}

                        <div className=" rounded-xl bg-white p-5 shadow-sm border border-gray-100 ">

                            <p className=" text-sm font-semibold text-gray-500 "> Ratings </p>

                            <h2 className=" mt-2 text-3xl font-bold text-gray-900 "> {dashboardData.totalRatings} </h2>
                        </div>

                    </div>

                )}



                
                <div className=" mt-8 ">
                    <p className=" mb-4 text-gray-500 "> Manage users and stores from here. </p>



                    {/* Buttons */}

                    <div className=" flex items-center gap-3 ">


                        {/* Add User */}

                        <button onClick={() => { setSelectedForm("user"); }} 
                         className={` px-8 py-3 rounded-lg font-medium transition ${ selectedForm === "user" ? ` bg-blue-600 text-white shadow-sm ` : ` bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 ` } `} >
                           Add User </button>


                        {/* Add Store */}

                        <button onClick={() => { setSelectedForm("store"); }}

                            className={` px-8 py-3 rounded-lg font-medium transition ${ selectedForm === "store" ? ` bg-blue-600 text-white shadow-sm ` : ` bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 ` } `} >
                            Add Store
                        </button>

                    </div>

                </div>



            <div className=" mt-8 flex justify-center w-full ">

                      <div className=" w-full max-w-3xl ">

                        {/* Add User Form */}
                        {selectedForm === "user" && ( <AddUserForm onSuccess={ fetchDashboardData } /> )}


                        {/* Add Store Form */}

                        {selectedForm === "store" && ( <AddStoreForm onSuccess={ fetchDashboardData } /> )}

                    </div>

                </div>


            </div>

        </div>

    );

};


export default Admindashboard;