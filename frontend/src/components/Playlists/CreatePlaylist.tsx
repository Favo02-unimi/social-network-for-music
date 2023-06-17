import type { FC, FormEvent } from "react"
import { useState } from "react"
import { BsFillTagsFill } from "react-icons/bs"
import { FaLock } from "react-icons/fa"
import { ImTextColor } from "react-icons/im"
import { IoIosArrowBack } from "react-icons/io"
import { LuText } from "react-icons/lu"
import { MdPublic } from "react-icons/md"
import { Link, useNavigate } from "react-router-dom"
import Switch from "react-switch"
import { TagsInput } from "react-tag-input-component"
import { toast } from "react-toastify"

import playlistsService from "../../services/playlists"
import checkTokenExpiration from "../../utils/checkTokenExpiration"
import REGEX from "../../utils/regex"
import Loading from "../Loading"

import "../../assets/styles/tagsComponent.css"

const CreatePlaylist : FC = () => {

  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [title, setTitle] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [isPublic, setIsPublic] = useState<boolean>(true)
  const [tags, setTags] = useState<string[]>([])

  const handleSubmit = async (e : FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setIsLoading(true)

    if (!REGEX.title.test(title)) {
      toast.error("Invalid title")
      setIsLoading(false)
      return
    }
    if (!REGEX.description.test(description)) {
      toast.error("Invalid description")
      setIsLoading(false)
      return
    }
    if (tags) {
      tags.forEach((t, i) => {
        if (!REGEX.tag.test(t)) {
          toast.error(`Invalid ${i+1}° tag`)
          setIsLoading(false)
          return
        }
      })
    }

    try {
      const { valid, message } = checkTokenExpiration()
      if (!valid) {
        toast.error(message)
        navigate("/login")
        return
      }

      const createdPlaylist = await playlistsService.create(title, description, isPublic, tags)

      toast.success("Playlist created successfully.")

      navigate(`/playlists/${createdPlaylist._id}`, { replace: true })
    }
    catch(e) {
      if (e?.response?.data?.error) {
        toast.error(e.response.data.error)
      } else {
        toast.error("Generic error, please try again")
      }
    }
    finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative w-full h-full border border-white/20 rounded-md p-6 flex justify-center items-center">

      {isLoading && <Loading small />}

      <Link to="/playlists" className=" absolute top-6 left-5 uppercase italic hover:text-white/80">
        <IoIosArrowBack className="inline text-2xl -mt-1" />My playlists
      </Link>

      <form onSubmit={handleSubmit} className="w-10/12 max-w-md mb-20">

        <div className="text-center mb-5">
          <h1 className="text-4xl font-bold mb-2 text-spotify-green">New playlist</h1>
          <p className="text-lg text-white">Create a new <span className="text-spotify-green">playlist</span> and share your favourite tracks.</p>
        </div>

        <div className="mb-5">
          <label className="inline-block text-sm mb-1"><ImTextColor className="inline -mt-1 mr-1" />Title</label>
          <input
            type="text"
            placeholder="Smurfs GVNG Music"
            value={title}
            onChange={({ target }) => { setTitle(target.value) }}
            className="w-full text-spotify-black bg-white border-2 border-gray-300 py-2 px-3 rounded-md leading-tight outline-none placeholder:text-gray-400 focus-within:border-spotify-green transition-all duration-700 peer" />
          <div className="text-sm font-light mt-1 text-center max-h-0 overflow-hidden peer-focus-within:max-h-10 transition-all duration-700">{REGEX.titleDesc}</div>
        </div>

        <div className="mb-4">
          <label className="inline-block text-sm mb-1"><LuText className="inline -mt-1 mr-1" />Description</label>
          <textarea
            placeholder="A playlist for smurfs."
            value={description}
            onChange={({ target }) => { setDescription(target.value) }}
            className="w-full text-spotify-black bg-white border-2 border-gray-300 py-2 px-3 rounded-md leading-tight outline-none placeholder:text-gray-400 focus-within:border-spotify-green transition-colors min-h-[40px] max-h-[300px] duration-700 peer" />
          <div className="text-sm font-light mt-1 text-center max-h-0 overflow-hidden peer-focus-within:max-h-10 transition-all duration-700">{REGEX.descriptionDesc}</div>
        </div>

        <div className="mb-5">
          <label className="inline-block text-sm mb-1"><BsFillTagsFill className="inline -mt-1 mr-1" />Tags</label>
          <div className="peer">
            <TagsInput
              value={tags}
              onChange={setTags}
              placeHolder="Smurfs"
            />
          </div>
          <div className="text-sm font-light mt-1 text-center max-h-0 overflow-hidden peer-focus-within:max-h-10 transition-all duration-700">Press enter to add a tag: {REGEX.tagDesc}</div>
        </div>

        <div className="mb-8 flex flex-col items-center">
          <label className="inline-block text-sm mb-1">
            {isPublic ? <MdPublic className="inline -mt-1 mr-1" /> : <FaLock className="inline -mt-1 mr-1" />}
            {isPublic ? "Public" : "Private"} playlist</label>
          <Switch
            onChange={(checked) => setIsPublic(checked)}
            checked={isPublic}
            checkedIcon={<MdPublic className="inline ml-1.5 text-xl" />}
            uncheckedIcon={<FaLock className="inline ml-1.5" />}
            onColor="#19823E"
            offColor="#64748b"
            activeBoxShadow="none"
          />
        </div>

        <div className="mb-5">
          <button className={`${isLoading ? "bg-spotify-greendark" : "bg-spotify-green"} text-white shadow-md text-xl px-4 py-2 rounded-md leading-tight hover:bg-spotify-greendark hover:font-bold w-full transition-all duration-700`}>{isLoading ? "Loading..." : "Create playlist"}</button>
        </div>

      </form>
    </div>
  )
}

export default CreatePlaylist
