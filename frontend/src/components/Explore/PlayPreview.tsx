import type { FC } from "react"
import { useEffect, useState } from "react"
import { FaPause, FaPlay } from "react-icons/fa"

const PlayPreview : FC<{url : string, customClasses ?: string}> = ({ url, customClasses }) => {

  const [audio, setAudio] = useState<HTMLAudioElement>()
  const [playing, setPlaying] = useState<boolean>(false)

  useEffect(() => {
    setAudio(new Audio(url))
  }, [url])

  const play = () => {
    if (audio) {
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

  return (
    <div
      onClick={() => playing ? pause() : play()}
      className={`rounded-full border border-spotify-greendark mt-1 group-hover:bg-spotify-green/20 cursor-pointer transition-all duration-700 ${customClasses}`}
    >
      {playing
        ? <FaPause className="inline mb-1 h-3 text-spotify-greendark" />
        : <FaPlay className="inline mb-1 h-3 text-spotify-greendark" />
      }
    </div>
  )
}

export default PlayPreview
