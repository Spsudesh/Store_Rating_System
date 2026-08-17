import { Link  , useNavigate} from "react-router-dom";


const AdminSidebar = () => {

    const navigate = useNavigate();

    const handleLogout = () => {

    localStorage.removeItem("token");

    navigate("/");

};

    return (

        <div className="w-64 min-h-screen bg-gray-900 text-white">

            {/* Logo */}
            <div className="p-6">

                <h1 className="text-2xl font-bold"> Rating System </h1>
                
                <p className="text-sm text-gray-400 mt-1"> Admin Panel </p>

            </div>


            <nav className="px-4 space-y-2">

                <Link to="/admin" className="block px-4 py-3 rounded-lg hover:bg-gray-800" > Dashboard </Link>

                <Link to="/admin/users" className="block px-4 py-3 rounded-lg hover:bg-gray-800" > Users </Link>

                <Link to="/admin/stores" className="block px-4 py-3 rounded-lg hover:bg-gray-800" > Stores </Link>

                <Link to="/admin/ratings" className="block px-4 py-3 rounded-lg hover:bg-gray-800" > Ratings </Link>

                <Link to = "/admin/update_password" className="block px-4 py-3 rounded-lg hover:bg-gray-800">Update Password </Link>

            </nav>


            {/* Logout */}

            <div className="px-4 mt-10">

                <button className=" w-full px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 " onClick={handleLogout} > Logout </button>

            </div>

        </div>

    );

};


export default AdminSidebar;