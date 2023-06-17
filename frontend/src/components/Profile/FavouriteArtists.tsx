import type { FC } from "react"
import { confirmAlert } from "react-confirm-alert"
import { ImBin2 } from "react-icons/im"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

import type Artist from "../../interfaces/Artist"
import type User from "../../interfaces/User"
import usersService from "../../services/users"
import checkTokenExpiration from "../../utils/checkTokenExpiration"

import EditFavouriteArtists from "./EditFavouriteArtists"

interface Option {
  label : string,
  value : string
}

const FavouriteArtists : FC<{
  list : Artist[],
  setUser : (u : User) => void
  setIsLoading : (l : boolean) => void
}> = ({ list, setUser, setIsLoading }) => {

  const navigate = useNavigate()

  const handleAdd = (selected : Option) => {
    const newList = list.slice()
    newList.push({ id: selected.value, name: selected.label })

    updateFavourites(newList, `${selected.label} added to favourites`)
  }

  const confirmRemove = (id : string, name : string) => {
    confirmAlert({
      title: "Confirm deletion",
      message: `Are you sure to remove ${name} from favourites?`,
      buttons: [
        {
          label: "Cancel"
        },
        {
          label: "Remove",
          className: "remove",
          onClick: () => handleRemove(id, name)
        }
      ]
    })
  }

  const handleRemove = (id : string, name : string) => {
    const newList = list.filter(i => i.id !== id)

    updateFavourites(newList, `${name} removed from favourites`)
  }

  const updateFavourites = async (newList : Artist[], feedback : string) => {
    try {
      const { valid, message } = checkTokenExpiration()
      if (!valid) {
        toast.error(message)
        navigate("/login")
        return
      }

      const res = await usersService.artists(newList)
      setUser(res)
      toast.success(feedback)
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

  if (list.length === 0) {
    return (
      <div className="flex flex-col items-center">
        <h2 className="text-xl font-bold text-center">Favourite <span className="text-spotify-green">artists</span></h2>
        <h3 className="mt-2 text-white/80">No favourite artists found</h3>
        <EditFavouriteArtists handleAdd={handleAdd} />
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-bold text-center">Favourite <span className="text-spotify-green">artists</span></h2>

      {/* TODO: link artists/genre to search for that artist/genre */}
      <div className="w-2/3 mt-2 flex flex-wrap justify-center items-center">
        {list.map(a =>
          <div key={a.id} className="ml-0.5 bg-gray-300/30 px-2 py-0.5 rounded m-0.5">
            {a.name}
            <ImBin2
              onClick={() => confirmRemove(a.id, a.name)}
              title="Remove"
              className="inline ml-1 -mt-1 text-red-700/70 cursor-pointer hover:text-red-700"
            />
          </div>
        )}
      </div>

      <EditFavouriteArtists handleAdd={handleAdd} />
    </div>
  )
}

export default FavouriteArtists
