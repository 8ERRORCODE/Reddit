import { useState } from "react"
import Api from "./api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

function CreatePost({communityid, onPostCreate}){
    const [form,Setform] = useState({title:'',body:'',community:communityid || ""})
    const [image,Setimage] = useState(null);
    const [isopen,SetisOpen] = useState(false);

    const handleImageChange = (e) => {
        Setimage(e.target.files[0]);
    };

    const createPost = async ()=>{
        const formData = new FormData()
        formData.append("title",form.title)
        formData.append('body',form.body)
        formData.append('community',communityid)
        if(image){
            formData.append('image',image)
        }

        try{
            const res = Api.post('/posts/',formData,{
                headers: { "Content-Type": "multipart/form-data" },
            }) 
            
            if (createPost) {
                onPostCreate(res.data);
            }
            Setform({title:'',body:'',community:communityid || ""})
            Setimage(null)
        }catch(error){
            alert('Post Creation Field')
        }
    }
    return(
        <>
        <button
            onClick={() =>{SetisOpen(true)}}
            className="flex items-center justify-center space-x-2 bg-[#1c1e2a] hover:ring-1 hover:bg-blue-800 rounded-2xl w-full duration-[0.3s] mt-4 cursor-pointer"
        >
            <FontAwesomeIcon icon={faPlus} className="text-[20px] "/>
            <p>Create Post</p>
        </button>
        {(isopen) && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div
                    className="absolute inset-0 backdrop-blur-xl bg-opacity-50"
                    onClick={() => SetisOpen(false)}
                ></div>
                <div className="relative mt-10 bg-[#2a2e4ad0] p-6 rounded-lg shadow w-160 h-80">
                    <h2 className="text-xl font-bold mb-4">Create New Post</h2>
                    <input
                    placeholder="Post Title"
                    value={form.title}
                    onChange={(e) => Setform({ ...form, title: e.target.value })}
                    className="w-full bg-[#1c1e2a] p-2 rounded mb-3 text-white placeholder-gray-400"
                    />
                    <textarea
                    placeholder="Post Body"
                    value={form.body}
                    onChange={(e) => Setform({ ...form, body: e.target.value })}
                    className="w-full bg-[#1c1e2a] p-2 rounded mb-3 text-white placeholder-gray-400"
                    />
                    <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block mb-4 text-sm"
                    />
                    <button
                    onClick={createPost}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white font-semibold"
                    >
                    Submit
                    </button>
                </div>
            </div>
        )}
        </>
    )
}

export default CreatePost