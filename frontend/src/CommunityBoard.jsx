import { useEffect, useState } from "react"
import Api from "./api"
import { Link } from "react-router-dom"

function CommunityBoard(){
    const [communities,SetCommunities] = useState([])

    useEffect(()=>{
        Api.get('/communityboard').then(res =>{
            SetCommunities(res.data)
        })
    },[])
    return(
        <div className="bg-[#2a2e4a61] rounded-2xl w-70">
            <h2 className="flex justify-center mb-3 text-lg ">Top Communities</h2>
            <ul>
                {communities.map(c => 
                    
                    <li key={c.id} className="border-t border-gray-700 hover:bg-[#494c5ed0] transition duration-[0.40s] py-3 first:border-t-0">
                        <Link to={`/communities/${c.id}`}>    
                            <div className="flex items-center space-x-3 pl-2">
                                <img
                                src={c.image} 
                                className="rounded-full h-8 w-8 object-cover border border-white bg-blue-300"
                                />
                                <p className="text-gray-300">{c.name}</p>
                            </div>
                        </Link>
                    </li>
                )}
                
            </ul>
        </div>
    )

}
export default CommunityBoard