import type { FC } from "react"
import { useEffect, useState } from "react"
import { FaPause, FaPlay } from "react-icons/fa"

const PlayPreview : FC<{url : string}> = ({ url }) => {

  const [audio, setAudio] = useState<HTMLAudioElement>()
  const [playing, setPlaying] = useState<boolean>(false)

  useEffect(() => {
    if (url) {
      setAudio(new Audio(url))
    }

    // on component unmount stop playing
    return pause()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url])

  const play = () => {
    if (url && audio) {
      audio.volume = 0.1
      audio.play()
      setPlaying(true)
    }
  }

  const pause = () => {
    if (audio) {
      audio.pause()
      setPlaying(false)
    }
  }

  const toggle = () => {
    if (playing) pause()
    else play()
  }

  if (!url) {
    return (
      <h4 className="mt-4 uppercase font-bold text-white/30 text-sm inline mr-1">Preview not available</h4>
    )
  }

  return (
    <div onClick={() => toggle()} className="mt-4 cursor-pointer group">
      <h4 className="uppercase font-bold text-white/80 text-sm inline mr-1">Listen to the preview:</h4>
      <div className="rounded-full border border-spotify-greendark mt-1 group-hover:bg-spotify-green/20 transition-all duration-700">
        {playing
          ? <FaPause className="inline mb-1 h-3 text-spotify-greendark" />
          : <FaPlay className="inline mb-1 h-3 text-spotify-greendark" />
        }
      </div>
    </div>
  )
}

export default PlayPreview
