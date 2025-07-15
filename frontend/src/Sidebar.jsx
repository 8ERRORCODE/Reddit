import { useState } from "react";
import { Link } from "react-router-dom";
const Sidebar = () => {
  const [open, setOpen] = useState(false);

return (
  <div className="fixed pr-2 top-25 bg-zinc-800 text-white rounded-2xl">
    <ul className="flex flex-col p-4">
      <a href='/community' className="hover:bg-zinc-600 cursor-pointer py-3 rounded transition duration-200 pl-2 border-b-1 border-zinc-700">Communities</a>
      <a href="/" className="hover:bg-zinc-600 cursor-pointer py-3 rounded transition duration-200 pl-2">Posts</a>
    </ul>
  </div>
);

};

export default Sidebar;
