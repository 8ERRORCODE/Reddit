import { useEffect, useState } from "react";
import Api from "./api";
import { useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { faClock ,faEarth,faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PostItem from "./PostItem";
import CreatePost from "./CreatePost";

function CommunityPosts(){
    const {id} = useParams()
    const [community,setCommunity] = useState({})
    const [posts,setPosts] = useState([])

    const isAuthenticated = !!localStorage.getItem('access')

    useEffect(()=>{
        Api.get(`/communities/${id}`).then(res => {
            setCommunity(res.data)
            setPosts(res.data.posts)
        })
        .catch((err) =>{
            console.error("Error fetching community:", err);   
        });
    },[id])

    const joinLeaveCommunity = () => {
    Api.post(`communities/${id}/join-leave`).then(res => {
        setCommunity(prev => ({
        ...prev,
        is_member: res.data.is_member,
        user_counter: res.data.user_counter
        }));
    });
    };
    return(
        <div className="min-h-screen text-white px-4 py-15">
            <div className="">
            </div>
            <div className="max-w-2xl mx-auto">
                <ul className="space-y-4">
                    {posts.map((p) => (
                        p ?
                    <PostItem key={p.id} post={p}/> : null
                    ))}
                </ul>

            </div>
            <div className="absolute bg-[#2a2e4a61] w-70 h-auto rounded-2xl right-15 top-35 px-4">
                <img
                    className="w-full h-30 rounded-2xl mt-4 border border-white object-cover"
                    src={community.image} 
                    alt="coomunity_image"
                />
                <h2 className="mt-3 mb-2 text-2xl">{community.name}</h2>
                <h3 className="text-gray-400">{community.description}</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-400 mt-3">
                    <FontAwesomeIcon icon={faClock}/>
                    {community.created_time ? (
                        <p>
                        {formatDistanceToNow(new Date(community.created_time), { addSuffix: true })}
                        </p>
                    ) : (
                        <p>Unknown</p>
                    )}
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <FontAwesomeIcon icon={faEarth}/>
                    <p>Public</p>
                </div>
                
                <h3 className="mt-3">{community.user_counter}</h3>
                <p className="text-sm text-gray-400">member</p>
                <div className="mt-8 mb-4">
                    {community.is_member ? 
                    (
                        <button className="bg-red-600 hover:bg-red-800 rounded-2xl w-full duration-[0.3s] cursor-pointer"
                            onClick={joinLeaveCommunity}
                        > 
                        <p>Leave</p> 
                        </button>
                        ): 
                        (
                        <button className="bg-blue-600 hover:bg-blue-800 rounded-2xl w-full duration-[0.3s] cursor-pointer"
                            onClick={joinLeaveCommunity}
                        >
                            <p>Join</p>
                        </button>
                        )}
                        <CreatePost communityid={community.id}
                        onPostCreate={(new_post) => setPosts([...posts,new_post])}/>                     
                </div>

            </div>
        </div>
    )
}
export default CommunityPosts;