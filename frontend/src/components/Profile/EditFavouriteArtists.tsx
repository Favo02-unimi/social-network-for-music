import type { FC } from "react"
import { useState } from "react"
import { FaSearch } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import { components, type SingleValue } from "react-select"
import AsyncSelect from "react-select/async"
import { toast } from "react-toastify"
import debounce from "debounce"

import spotifyService from "../../services/spotify"
import checkTokenExpiration from "../../utils/checkTokenExpiration"
import REGEX from "../../utils/regex"

interface Option {
  label : string,
  value : string
}

const EditFavourites : FC<{handleAdd : (o : Option) => void}> = ({ handleAdd }) => {

  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isInvalid, setIsInvalid] = useState<boolean>(false)

  const [list, setList] = useState<Option[]>([])
  const [selected, setSelected] = useState<SingleValue<Option>>()

  const handleSearch = async (query : string) => {

    if (query.length < 2) {
      setIsInvalid(false)
      setList([])
      return
    }

    setIsLoading(true)

    if (!REGEX.query.test(query)) {
      setIsLoading(false)
      setIsInvalid(true)
      return
    }
    else {
      setIsInvalid(false)
    }

    try {
      const { valid, message } = checkTokenExpiration()
      if (!valid) {
        toast.error(message)
        navigate("/login",  { replace: true })
        return
      }

      const res = await spotifyService.artists(query)

      setList(res.artists.items.map(
        (a : {name : string, id : string}) => ({ label: a.name, value: a.id })
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

  const loadOptions = (
    inputValue : string,
    callback : (options : Option[]) => void
  ) => {
    handleSearch(inputValue)
    callback(list)
  }

  const debouncedLoadOptions = debounce(loadOptions, 300)

  return (
    <div className="mt-4 flex flex-col justify-center items-center text-center">

      {isInvalid && <h3 className="max-w-[700px] text-center text-red-700">Invalid search query. Please use the following format: {REGEX.queryDesc}.</h3>}

      <div className="flex">
        <AsyncSelect
          loadOptions={debouncedLoadOptions}
          value={selected}
          onChange={(selected) => setSelected(selected)}
          isLoading={isLoading}
          unstyled
          isClearable
          placeholder="Search for artists..."
          noOptionsMessage={() => "No artists found, keep typing"}
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
