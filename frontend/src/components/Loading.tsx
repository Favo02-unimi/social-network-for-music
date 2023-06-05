import type { FC } from "react"

const Loading : FC<{small ?: boolean}> = ({ small }) => (
  <div className={`${small ? "absolute h-full w-full" : "absolute h-screen w-screen top-0 left-0"} z-10 flex justify-center align-middle items-center backdrop-blur-md`}>
    <div className="w-10 h-10 rounded-full absolute shadow-[0_0_10px_2px_inset] shadow-black" />
    <div className="w-10 h-10 rounded-full absolute shadow-[0_2px_0_inset] animate-spin shadow-spotify-green" />
  </div>
)

export default Loading
