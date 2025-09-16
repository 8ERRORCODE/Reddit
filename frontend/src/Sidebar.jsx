import { useState } from "react";
import { Link } from "react-router-dom";
import { Home, Users, Info, HelpCircle,AlertCircle,DollarSign,User2 ,Star } from "lucide-react";
const Sidebar = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed top-23 left-0 h-screen w-56 bg-[#2a2e4ad0] text-white  shadow-lg">
      <ul className="flex flex-col p-4 space-y-2">
        <Link
          to="/"
          className="flex items-center gap-2 hover:bg-[#3a3f63] cursor-pointer px-3 py-2 rounded-md transition duration-200"
        >
          
          <Home size={18} />
          Home
        </Link>
        <Link
          to="/Login"
          className="flex items-center gap-2 hover:bg-[#3a3f63] cursor-pointer px-3 py-2 rounded-md transition duration-200"
        >
          <User2  size={18} />
          Profile
        </Link>
        <Link
          to="/community"
          className="flex items-center gap-2 hover:bg-[#3a3f63] cursor-pointer px-3 py-2 rounded-md transition duration-200"
        >
          <Users size={18} />
          Communities
        </Link>
         <Link
          to="/adverties"
          className="flex items-center gap-2 hover:bg-[#3a3f63] cursor-pointer px-3 py-2 rounded-md transition duration-200 border-t border-zinc-700 pt-3 mt-2"
        >
          <DollarSign  size={18} />
          Adverties
        </Link>
        <Link
          to="/about"
          className="flex items-center gap-2 hover:bg-[#3a3f63] cursor-pointer px-3 py-2 rounded-md transition duration-200"
        >
          <Info  size={18} />
          About ChitChat
        </Link>
        <Link
          to="/help"
          className="flex items-center gap-2 hover:bg-[#3a3f63] cursor-pointer px-3 py-2 rounded-md transition duration-200"
        >
          <HelpCircle  size={18} />
          Help
        </Link>
        <Link
          to="/rule"
          className="flex items-center gap-2 hover:bg-[#3a3f63] cursor-pointer px-3 py-2 rounded-md transition duration-200"
        >
          <AlertCircle  size={18} />
          Rule
        </Link>
        
      </ul>
    </div>
  );
};

export default Sidebar;
