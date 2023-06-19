import type { FC, ReactElement } from "react"
import { useCallback, useEffect, useRef, useState } from "react"
import { IoMdClose } from "react-icons/io"
import { MdDragHandle } from "react-icons/md"

import MobileMenu from "./MobileMenu"

const Sidebar : FC<{sideContent : ReactElement, children ?: ReactElement}> = ({ sideContent, children }) => {

  const sidebarRef = useRef<HTMLDivElement>(null)
  const [isResizing, setIsResizing] = useState<boolean>(false)
  const [sidebarWidth, setSidebarWidth] = useState<number>(300)

  const [menuOpen, setMenuOpen] = useState<boolean>(false)

  const startResizing = useCallback(() => {
    setIsResizing(true)
  }, [])

  const stopResizing = useCallback(() => {
    setIsResizing(false)
  }, [])

  const resize = useCallback((mouseMoveEvent : MouseEvent) => {
    if (isResizing && sidebarRef.current) {
      const width = mouseMoveEvent.clientX - sidebarRef.current.getBoundingClientRect().left
      setSidebarWidth((width >= 255 && width <= 600) ? width : sidebarWidth)
    }
  }, [isResizing, sidebarWidth])

  useEffect(() => {
    window.addEventListener("mousemove", resize)
    window.addEventListener("mouseup", stopResizing)
    return () => {
      window.removeEventListener("mousemove", resize)
      window.removeEventListener("mouseup", stopResizing)
    }
  }, [resize, stopResizing])

  return (
    <div className={`${menuOpen ? "h-screen" : "h-full"} min-h-screen md:h-screen w-screen flex flex-row`}>
      {!menuOpen && <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />}
      <div
        ref={sidebarRef}
        className={`${menuOpen ? "flex" : "hidden"} md:flex grow-0 shrink-0 md:min-w-[255px] md:max-w-[600px] flex-row shadow-md`}
        style={{ width: menuOpen ? "100%" : sidebarWidth }}
        onMouseDown={(e) => e.preventDefault()}
      >
        <div className={`${menuOpen ? "block" : "hidden"} md:block grow shrink p-4`}>
          <IoMdClose
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden absolute top-16 left-6 -skew-y-3 text-3xl z-50"
          />
          {sideContent}
        </div>
        <div className="hidden md:block relative grow-0 shrink-0 basis-1 justify-self-end cursor-col-resize resize-x hover:w-1 bg-spotify-greendark rounded my-4" onMouseDown={startResizing}>
          <MdDragHandle className="rotate-90 absolute top-1/2 -translate-y-1/2 -left-[10px] text-2xl text-gray-300 opacity-40" />
        </div>
      </div>
      <div
        className={`${menuOpen ? "hidden" : "block"} md:block grow shrink h-full md:h-screen p-4 pt-10 md:pt-0`}
        style={{ width: `calc(100vw - ${sidebarWidth}px)` }}
      >
        {children}
      </div>
    </div>
  )
}

export default Sidebar
