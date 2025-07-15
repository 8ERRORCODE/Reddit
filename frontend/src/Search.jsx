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
                className="border rounded-2xl w-100 h-10 pl-1 hover:ring-purple-600 hover:ring-2 duration-300 font-mono border-purple-950 text-white"></input>
        
            {showDropDown && users.length>0 &&(
                <ul className="absolute bg-purple-400 border border-purple-600 text-black w-full mt-1 rounded-2xl shadow-lg max-h-60 overflow-y-auto ">
                    {users.map((user) =>(
                        <li key={user.id}
                            onClick={() => handleSelectUser(user.username)}
                            className="px-4 py-2 hover:bg-purple-600 cursor-pointer text-white duration-150"
                            >
                            {user.username}
                        </li>
                    ))}

                </ul>
            )}
        </div>
    )
}