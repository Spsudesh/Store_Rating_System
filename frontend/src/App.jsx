import './App.css'
import Signup from './pages/auth/Signup';
import Loginpage from './pages/auth/Loginpage';

import {  BrowserRouter, Routes, Route} from "react-router-dom";

import Admindashboard from './pages/admin/Admindashboard.jsx';
import AdminLayout from "./pages/admin/AdminLayout";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminStores from "./pages/admin/AdminStores";
import AdminRatings from "./pages/admin/AdminRatings";


import OwnerDashboard from "./pages/owner/OwnerDashboard";
import OwnerRatings from "./pages/owner/OwnerRatings.jsx";
import OwnerNavbar from "./pages/owner/OwnerNavbar.jsx";

import Userdashboard from './pages/user/Userdashboard.jsx';
import UserNavbar from './pages/user/UserNavbar.jsx';

import Protected_routes from './componants/Protected_routes';
import Update_password from './componants/Update_password';


function App() {
  return (
   <>
   
   <BrowserRouter>
        <Routes>

            <Route path="/" element= {
              
              <Loginpage />} />

            <Route path="/signup" element={<Signup />} />

            <Route path = "/admin" element= {
                <Protected_routes allowedRole = "ADMIN">
                <AdminLayout />         
                </Protected_routes>} 
              >

                  <Route
                      index
                      element={<Admindashboard />}
                  />

                  <Route
                      path="users"
                      element={<AdminUsers />}
                  />

                  <Route
                      path="stores"
                      element={<AdminStores />}
                  />

                  <Route
                      path="ratings"
                      element={<AdminRatings />}
                    />

                  <Route
                      path="update_password"
                      element={<Update_password />}
                    />
             </Route>

                    
                    <Route
                        path="/owner"
                        element={
                            <Protected_routes
                                allowedRole="STORE_OWNER"
                            >
                                <OwnerDashboard />
                            </Protected_routes>
                        }
                    />

                    <Route
                        path="/owner/dashboard"
                        element={
                            <Protected_routes
                                allowedRole="STORE_OWNER"
                            >
                                <OwnerDashboard />
                            </Protected_routes>
                        }
                    />

                    <Route
                        path="/store"
                        element={
                            <Protected_routes
                                allowedRole="STORE_OWNER"
                            >
                                <OwnerDashboard />
                            </Protected_routes>
                        }
                    />


                    <Route
                        path="/owner/ratings"
                        element={
                            <Protected_routes
                                allowedRole="STORE_OWNER"
                            >
                                <OwnerRatings />
                            </Protected_routes>
                        }
                    />

                    <Route
                        path="/owner/update_password"
                        element={
                            <Protected_routes
                                allowedRole="STORE_OWNER"
                            >
                                <div className="min-h-screen bg-gray-100">
                                    <OwnerNavbar />
                                    <div className="mx-auto max-w-6xl p-8">
                                        <Update_password />
                                    </div>
                                </div>
                            </Protected_routes>
                        }
                    />


                <Route path = "/user" element= {
                  <Protected_routes allowedRole = "USER">
                  <Userdashboard />
                  </Protected_routes>
                  } />

                <Route path = "/user/update_password" element= {
                  <Protected_routes allowedRole = "USER">
                    <div className="min-h-screen bg-gray-100">
                      <UserNavbar />
                      <div className="mx-auto max-w-6xl p-8">
                        <Update_password />
                      </div>
                    </div>
                  </Protected_routes>
                  } />

                <Route path = "/user/update-password" element= {
                  <Protected_routes allowedRole = "USER">
                    <div className="min-h-screen bg-gray-100">
                      <UserNavbar />
                      <div className="mx-auto max-w-6xl p-8">
                        <Update_password />
                      </div>
                    </div>
                  </Protected_routes>
                  } />
                  
        </Routes>
   
   
   </BrowserRouter>

  
       
   </>
  )
}

export default App;
