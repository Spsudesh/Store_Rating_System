import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';


const Loginpage = () => {

   const [logindata , setLoginData] = useState({
      email : "",
      password : ""
   });


   const handleLogin = async (e) => {
      e.preventDefault();
      console.log(logindata);

      if(!logindata.email || !logindata.password){
         alert("Please fill all the fields");
         return;
      }
      try {
            // endpoint to send data to backend
           const response = await api.post('/login', logindata);
           console.log(response.data);


           //store on local storage
           localStorage.setItem('token', response.data.token);
        //    localStorage.setItem('user', JSON.stringify(response.data.user));


        const token = response.data.token;

        const userresponse = await api.get( "/users/me",
            {
                headers :
                {
                    Authorization : `Bearer ${token}`
                }
            }
        );

        const user = userresponse.data.user;




        // Check role
        const role = user.role;


        if (role === "ADMIN") {

            window.location.href = "/admin";

        } else if (role === "STORE_OWNER") {

            window.location.href = "/owner";

        } else if (role === "USER") {

            window.location.href = "/user";

        }
      } 
      catch (error) {
        console.error("Login failed", error);
        
        alert(error.response?.data?.message || "Unable to login. Please make sure the backend server is running.");
      }

   }
return (
    <>
        <div className="
            min-h-screen
            flex
            items-center
            justify-center
            bg-slate-50
            px-4
        ">

            <div className="
                w-full
                max-w-md
                bg-white
                rounded-xl
                shadow-sm
                border
                border-slate-200
                p-8
            ">

                {/* Header */}
                <div className="mb-6">

                    <p className="
                        text-xs
                        font-semibold
                        tracking-widest
                        text-blue-700
                        uppercase
                        mb-2
                    ">
                        Store Management
                    </p>

                    <h2 className="
                        text-3xl
                        font-bold
                        text-slate-900
                        mb-2
                    ">
                        Welcome back
                    </h2>

                    <p className="text-sm text-slate-500">
                        Sign in to manage stores and ratings.
                    </p>

                </div>


                {/* Login Form */}
                <form onSubmit={handleLogin}>


                    {/* Email */}
                    <div className="mb-5">

                        <label
                            htmlFor="email"
                            className="
                                block
                                text-sm
                                font-semibold
                                text-slate-800
                                mb-2
                            "
                        >
                            Email
                        </label>

                        <input
                            type="email"
                            id="email"
                            placeholder="Email"
                            value={logindata.email}

                            onChange={(e) =>
                                setLoginData({
                                    ...logindata,
                                    email: e.target.value
                                })
                            }

                            className="
                                w-full
                                px-3
                                py-3
                                text-sm
                                text-slate-800
                                bg-slate-50
                                border
                                border-slate-300
                                rounded-lg
                                outline-none
                            "
                        />

                    </div>


                    {/* Password */}
                    <div className="mb-6">

                        <label
                            htmlFor="password"
                            className="
                                block
                                text-sm
                                font-semibold
                                text-slate-800
                                mb-2
                            "
                        >
                            Password
                        </label>

                        <input
                            type="password"
                            id="password"
                            placeholder="Password"
                            value={logindata.password}

                            onChange={(e) =>
                                setLoginData({
                                    ...logindata,
                                    password: e.target.value
                                })
                            }

                            className="
                                w-full
                                px-3
                                py-3
                                text-sm
                                text-slate-800
                                bg-slate-50
                                border
                                border-slate-300
                                rounded-lg
                                outline-none
                            "
                        />

                    </div>


                    {/* Sign In Button */}
                    <button
                        type="submit"
                        className="
                            w-full
                            bg-blue-600
                            hover:bg-blue-700
                            text-white
                            font-semibold
                            py-3
                            rounded-lg
                            transition
                            duration-200
                        "
                    >
                        Sign in
                    </button>

                </form>


                {/* Create Account */}
                <p className="
                    text-center
                    text-sm
                    text-slate-500
                    mt-5
                ">

                    New user?{" "}

                    <Link
                        to="/signup"
                        className="
                            text-blue-700
                            font-semibold
                            cursor-pointer
                            hover:text-blue-800
                        "
                    >
                        Create an account
                    </Link>

                </p>

            </div>

        </div>
    </>
);
}
export default Loginpage;
