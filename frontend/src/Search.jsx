import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import Api from "./api"
import { faL } from "@fortawesome/free-solid-svg-icons"

export default function Search(){
    const[users,SetUsers] = useState([])
    const[query,Setquery] = useState("")
    const[showDropDown,setShowDropDown] = useState(false)
    const navigate = useNavigate()
    const dropdownRef = useRef()
    useEffect(()=>{
        const fetchUser = async () =>{
            if(query.length<2){
                SetUsers([])
                return;
            }
            try{
                const res = await Api.get(`/search-users/?q=${query}`)
                SetUsers(res.data)
                setShowDropDown(true)
            }
            catch(err){
                console.log('failed to fetch',err)
                SetUsers([])
            }
        }
        const delayDebounce = setTimeout(() =>{
            fetchUser()
        },250)
        return () => clearTimeout(delayDebounce)
    },[query])

    const handleSelectUser = (username) =>{
        navigate(`/profile/${username}`)
        setShowDropDown(false);
        Setquery('')
    }
    useEffect(()=>{
        const HandleClickOutside = (e) =>{
            if(dropdownRef.current && !dropdownRef.current.contains(e.target)){
                setShowDropDown(false)
            }
        }
        document.addEventListener('mousedown',HandleClickOutside)
        return(() =>{document.removeEventListener('mousedown',HandleClickOutside)})
    },[])
    return(
        <div className='relative' ref={dropdownRef}>
            <input placeholder="Search User..." 
                type="text"
                value={query}
                onChange={(e) =>Setquery(e.target.value)} 
                className="border rounded-2xl w-100 h-10 pl-1 hover:ring-violet-600 hover:ring-3 duration-350 font-mono border-violet-400 text-white"></input>
        
            {showDropDown && users.length>0 &&(
                <ul className="absolute bg-[rgba(42,10,70)] border border-violet-300 text-white w-full mt-1 rounded-2xl shadow-lg max-h-60 overflow-y-auto ">
                    {users.map((user) =>(
                        <li key={user.id}
                            onClick={() => handleSelectUser(user.username)}
                            className="flex gap-2 items-center px-4 py-2 hover:bg-[#4b2f65] cursor-pointer text-white duration-400 border-t-1 border-violet-300"
                            >
                            <img 
                                className="h-8 w-8 rounded-full object-cover "
                                src={`http://localhost:8000/${user.avatar}`}
                            />
                            
                            {user.username}
                        </li>
                    ))}

                </ul>
            )}
        </div>
    )
}