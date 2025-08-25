import { useState,useRef, useEffect } from "react"

import Api from "./api"

function Community(){
  const [communities,SetCommunities] = useState([]);
  const [name,SetName] = useState('');

  useEffect (() =>{
    Api.get('/communities/').then(res => SetCommunities(res.data))
  },[])
  
  const CreateCommunities =() =>{
    Api.post('/communities/',{name}).then(res =>{
      SetCommunities([...communities,res.data]);
      SetName('');
    });
  }
  console.log(communities)
  return(
    <div className="min-h-screen bg-[#1c1e2a] text-white px-4 py-6">
      <div className="max-w-2xl mx-auto">
        <ul className="space-y-4">
          {communities.map(c =>(
            <li key={c.id} className="bg-[#2a2e4a61] p-4 rounded-lg shadow hover:bg-[#2a2e4ad0] transition duration-[0.25s]">
              {c.name}
            </li>
          ))}
        </ul>
        <div className="mt-10 bg-[#2a2e4a61] hover:bg-[#2a2e4ad0] p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Create New Community</h2>
          <input value={name} placeholder="input Community Name..."  className="w-full bg-[#1c1e2a] p-2 rounded mb-3 text-white placeholder-gray-400"
          onChange={e => SetName(e.target.value)}/>
          <button onClick={CreateCommunities} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white font-semibold">
            Submit
            </button> 
        </div>
       
      </div>

    </div>
  )
}

export default Community