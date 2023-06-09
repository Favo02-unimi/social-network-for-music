import { type FC, useEffect,useState } from "react"
import { MdPlaylistAdd } from "react-icons/md"
import type { SingleValue } from "react-select"
import Select from "react-select"
import cogoToast from "cogo-toast"

import type Playlist from "../../interfaces/Playlist"
import type Track from "../../interfaces/Track"
import playlistsService from "../../services/playlists"

interface SelectPlaylistItem {
  value : string,
  label : string
}

const AddToPlaylist : FC<{track : Track}> = ({ track }) => {

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [playlists, setPlaylists] = useState<SelectPlaylistItem[]>()

  const [selectedPlaylist, setSelectedPlaylist] = useState<SingleValue<SelectPlaylistItem>>(null)

  useEffect(() => {

    const fetchPlaylists = async () => {
      setIsLoading(true)

      try {
        const res = await playlistsService.getAll()
        setPlaylists(res
          .filter((p : Playlist) => p.isCreator || p.isCollaborator)
          .map((p : Playlist) => ({ value: p._id, label: p.title }))
        )
      }
      catch(e) {
        if (e?.response?.data?.error) {
          cogoToast.error(e.response.data.error)
        } else {
          cogoToast.error("Generic error, please try again")
        }
      }
      finally {
        setIsLoading(false)
      }
    }

    fetchPlaylists()

  }, [])

  const handleAddToPlaylist = async () => {

    setIsLoading(true)

    if (!selectedPlaylist) {
      setIsLoading(false)
      cogoToast.error("Select a valid playlist")
      return
    }

    try {
      const addedPlaylist = await playlistsService.addTrack(selectedPlaylist.value, track)

      cogoToast.success(`Added to playlist ${addedPlaylist.title} successfully.`)

      setSelectedPlaylist(null)
    }
    catch(e) {
      if (e?.response?.data?.error) {
        cogoToast.error(e.response.data.error)
      } else {
        cogoToast.error("Generic error, please try again")
      }
    }
    finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative mt-4 w-full">

      <h4 className="uppercase font-bold text-white/80 text-sm inline mr-1">Add to playlist:</h4>

      <div className="relative w-10/12 mx-auto mt-1">
        <Select
          value={selectedPlaylist}
          options={playlists}
          onChange={(selected) => setSelectedPlaylist(selected)}
          isLoading={isLoading}
          unstyled
          menuPlacement="top"
          placeholder="Select playlist..."
          noOptionsMessage={() => "No playlists found"}
          classNames={{
            container: () => "w-full",
            menu: () => "border border-b-0 border-spotify-greendark rounded-t-md bg-spotify-black",
            control: () => "border border-spotify-greendark rounded-md pr-10 pl-4 text-white",
            placeholder: () => "text-white/30",
            option: () => "py-2 border-b border-spotify-greendark/20 hover:bg-spotify-greendark/20",
            noOptionsMessage: () => "py-2 text-white/30",
            dropdownIndicator: () => "text-white/30",
            loadingIndicator: () => "text-white"
          }}
        />

        <MdPlaylistAdd
          className={`${selectedPlaylist ? "text-spotify-green/80 hover:text-spotify-green cursor-pointer" : "text-spotify-green/40"} h-6 w-6 absolute top-1/2 -translate-y-1/2 right-2 transition-all duration-700`}
          onClick={() => { if (selectedPlaylist) handleAddToPlaylist() }}
        />
      </div>

    </div>
  )
}

export default AddToPlaylist
