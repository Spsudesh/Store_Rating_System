import { useEffect, useState } from "react";

import api from "../services/api";



const Update_password = () => {

    const [userData, setUserData] = useState(null);

    const [currentPassword, setCurrentPassword] = useState("");

    const [newPassword, setNewPassword] = useState("");

    const [loading, setLoading] = useState(true);

    const [message, setMessage] =  useState("");


    const [error, setError] =  useState("");


    // Get logged-in user

    const fetchUser = async () => {

        const token =
            localStorage.getItem("token");

        try {

            const response = await api.get( "/users/me",
                { 
                    headers: {

                        Authorization:
                            `Bearer ${token}`

                    }

                }

            );

            setUserData(
                response.data.user
            );

        }


        catch (error) { 
            console.error( "Fetch user error:", error );

            setError( error.response?.data?.message ||  "Failed to load user information");

        }

        finally {
            setLoading(false);
        }

    };



    useEffect(() => {
        fetchUser();

    }, []);



    // Update password
    const handleSubmit = async (e) => {

        e.preventDefault();
        setMessage("");
        setError("");

        const passwordRegex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

        if (!passwordRegex.test(newPassword)) {
            setError("New password must be 8-16 characters with 1 uppercase and 1 special character.");
            return;
        }

        try {

            const token =
                localStorage.getItem("token");

            const response = await api.put("/users/update-password",
                {
                    currentPassword: currentPassword,
                      newPassword: newPassword
                },

                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }

                }

            );


            setMessage(
                response.data.message
            );


            setCurrentPassword("");

            setNewPassword("");

        }


        catch (error) {

            console.error(
                "Update password error:",
                error
            );


            setError(  error.response?.data?.message || "Failed to update password" );

        }

    };



    if (loading) {

        return (

            <div className="flex min-h-[calc(100vh-8rem)] w-full items-center justify-center p-4">
                <p className="text-gray-600">

                    Loading user information...

                </p>

            </div>

        );

    }



    return (

        <div className=" flex min-h-[calc(100vh-8rem)] w-full items-center justify-center p-4 ">

            <div className=" w-full max-w-xl bg-white border border-gray-200 rounded-xl p-6 ">

            {/* Heading */}
            <h2 className=" text-2xl font-semibold text-gray-900 ">
                Update Password
            </h2>


            <p className=" mt-2 text-sm text-gray-500 ">
                Update your account password.
            </p>



            {/* User Information */}
            <div className=" mt-6 space-y-5 ">
                {/* Name */}

                <div>

                    <label className=" block text-sm font-medium text-gray-700 mb-2 "> Name </label>

                    <input type="text" value={ userData?.name || "" } readOnly
                     className=" w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 outline-none " />

                </div>



                {/* Email */}
                <div>

                    <label className=" block text-sm font-medium text-gray-700 mb-2 "> Email </label>

                    <input type="email" value={ userData?.email || "" } readOnly
                     className=" w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 outline-none " />

                </div>



                {/* Current Password */}

                <div>

                    <label className=" block text-sm font-medium text-gray-700 mb-2 "> Current Password </label>

                     <input type="password" value={ currentPassword } onChange={(e) => { setCurrentPassword( e.target.value ); }}
                        placeholder="Enter current password" className=" w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 " />
                </div>


                {/* New Password */}
                <div>
                  <label className=" block text-sm font-medium text-gray-700 mb-2 "> New Password </label>

                   <input type="password" value={ newPassword } onChange={(e) => { setNewPassword( e.target.value ); }} 
                      placeholder="Enter new password" className=" w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 " />

                   <p className=" mt-1 text-xs text-gray-500 "> 8-16 characters, 1 uppercase, 1 special character </p>

                </div>


                {/* Error */}

                {error && ( <p className=" text-sm text-red-600 "> {error} </p> )}


                {/* Success */}

                {message && ( <p className=" text-sm text-green-600 "> {message} </p> )}


                {/* Submit */}

                <button type="button" onClick={handleSubmit} className=" w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition " > Update Password </button>
            </div>

            </div>

        </div>

    );

};


export default Update_password;
