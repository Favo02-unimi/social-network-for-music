import type { FC } from "react"
import { confirmAlert } from "react-confirm-alert"
import { ImBin2 } from "react-icons/im"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

import type User from "../../interfaces/User"
import usersService from "../../services/users"
import checkTokenExpiration from "../../utils/checkTokenExpiration"

import EditFavouriteGenres from "./EditFavouriteGenres"

interface Option {
  label : string,
  value : string
}

const FavouriteGenres : FC<{
  list : string[],
  setUser : (u : User) => void
  setIsLoading : (l : boolean) => void
}> = ({ list, setUser, setIsLoading }) => {

  const navigate = useNavigate()

  const handleAdd = async (selected : Option) => {
    const newList = list.slice()
    newList.push(selected.value)

    update(newList, `${selected.label} added to favourites`)
  }

  const confirmRemove = (title : string) => {
    confirmAlert({
      title: "Confirm deletion",
      message: `Are you sure to remove ${title} from favourites?`,
      buttons: [
        {
          label: "Cancel"
        },
        {
          label: "Remove",
          className: "remove",
          onClick: () => handleRemove(title)
        }
      ]
    })
  }

  const handleRemove = async (title : string) => {
    const newList = list.filter(i => i !== title)

    update(newList, `${title} removed from favourites`)
  }

  const update = async (newList : string[], feedback : string) => {
    try {
      const { valid, message } = checkTokenExpiration()
      if (!valid) {
        toast.error(message)
        navigate("/login",  { replace: true })
        return
      }

      const res = await usersService.genres(newList)
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
        <h2 className="text-xl font-bold text-center">Favourite <span className="text-spotify-green">genres</span></h2>
        <h3 className="mt-2 text-white/80">No favourite genres found</h3>
        <EditFavouriteGenres handleAdd={handleAdd} />
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-bold text-center">Favourite <span className="text-spotify-green">genres</span></h2>

      <div className="w-2/3 mt-2 flex flex-wrap justify-center items-center">
        {list.map(g =>
          <div key={g} className="ml-0.5 bg-gray-300/30 px-2 py-0.5 rounded m-0.5">
            <Link
              to="/explore/tracks"
              state={{ redirectGenre: g }}
              className="hover:underline"
            >
              {g}
            </Link>
            <ImBin2
              onClick={() => confirmRemove(g)}
              title="Remove"
              className="inline ml-1 -mt-1 text-red-700/70 cursor-pointer hover:text-red-700"
            />
          </div>
        )}
      </div>

      <EditFavouriteGenres handleAdd={handleAdd} />
    </div>
  )
}

export default FavouriteGenres
