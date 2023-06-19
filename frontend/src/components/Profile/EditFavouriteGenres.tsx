import type { FC } from "react"
import { useEffect, useState } from "react"
import { FaSearch } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import { components, type SingleValue } from "react-select"
import Select from "react-select"
import { toast } from "react-toastify"

import spotifyService from "../../services/spotify"
import checkTokenExpiration from "../../utils/checkTokenExpiration"

interface Option {
  label : string,
  value : string
}

const EditFavourites : FC<{handleAdd : (o : Option) => void}> = ({ handleAdd }) => {

  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [list, setList] = useState<Option[]>([])
  const [selected, setSelected] = useState<SingleValue<Option>>()

  useEffect(() => {
    const fetchData = async () => {

      setIsLoading(true)

      try {
        const { valid, message } = checkTokenExpiration()
        if (!valid) {
          toast.error(message)
          navigate("/login", { replace: true })
          return
        }

        const res = await spotifyService.genres()

        setList(res.genres.map(
          (g : string) => ({ label: g, value: g })
        ))
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

    fetchData()
  }, [navigate])

  return (
    <div className="mt-4 flex flex-col justify-center items-center text-center">

      <div className="flex">
        <Select
          options={list}
          value={selected}
          onChange={(selected) => setSelected(selected)}
          isLoading={isLoading}
          unstyled
          isClearable
          placeholder="Search for genres..."
          noOptionsMessage={() => "No genres found, keep typing"}
          classNames={{
            container: () => "w-60",
            menu: () => "border border-t-0 border-spotify-greendark rounded-b-md bg-spotify-black",
            control: () => "border border-spotify-greendark rounded-md pr-4 pl-4 text-white",
            placeholder: () => "text-white/30",
            option: ({ isDisabled }) => isDisabled
              ? "py-2 border-b border-spotify-greendark/20 text-white/30"
              : "py-2 border-b border-spotify-greendark/20 hover:bg-spotify-greendark/20",
            noOptionsMessage: () => "py-2 text-white/30",
            dropdownIndicator: () => "text-white/30",
            clearIndicator: () => "text-white/30 cursor-pointer mr-2",
            loadingIndicator: () => "text-white",
            loadingMessage: () => "text-white/30 py-2",
            singleValue: () => "text-spotify-green font-bold"
          }}
          components={{ DropdownIndicator: (props) => (
            <components.DropdownIndicator {...props}>
              <FaSearch />
            </components.DropdownIndicator>
          ) }}
        />

        <div
          onClick={() => {if (selected) handleAdd(selected)}}
          className={`inline bg-spotify-greendark ml-2 px-3 py-1.5 rounded-lg ${selected ? " hover:bg-spotify-green" : "opacity-40"} font-bold cursor-pointer transition-all duration-700`}
        >Add</div>
      </div>
    </div>
  )
}

export default EditFavourites
