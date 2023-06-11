import type { FC, ReactElement } from "react"
import { useCallback, useEffect, useRef, useState } from "react"
import { MdDragHandle } from "react-icons/md"

const Sidebar : FC<{sideContent : ReactElement, children ?: ReactElement}> = ({ sideContent, children }) => {

  const sidebarRef = useRef<HTMLDivElement>(null)
  const [isResizing, setIsResizing] = useState<boolean>(false)
  const [sidebarWidth, setSidebarWidth] = useState<number>(300)

  const startResizing = useCallback(() => {
    setIsResizing(true)
  }, [])

  const stopResizing = useCallback(() => {
    setIsResizing(false)
  }, [])

  const resize = useCallback((mouseMoveEvent : MouseEvent) => {
    if (isResizing && sidebarRef.current) {
      setSidebarWidth(mouseMoveEvent.clientX - sidebarRef.current.getBoundingClientRect().left)
    }
  }, [isResizing])

  useEffect(() => {
    window.addEventListener("mousemove", resize)
    window.addEventListener("mouseup", stopResizing)
    return () => {
      window.removeEventListener("mousemove", resize)
      window.removeEventListener("mouseup", stopResizing)
    }
  }, [resize, stopResizing])

  return (
    <div className="h-screen flex flex-row">
      <div
        ref={sidebarRef}
        className="grow-0 shrink-0 min-w-[255px] max-w-[600px] flex flex-row shadow-md"
        style={{ width: sidebarWidth }}
        onMouseDown={(e) => e.preventDefault()}
      >
        <div className="grow shrink p-4">
          {sideContent}
        </div>
        <div className="relative grow-0 shrink-0 basis-1 justify-self-end cursor-col-resize resize-x hover:w-1 bg-spotify-greendark rounded my-4" onMouseDown={startResizing}>
          <MdDragHandle className="rotate-90 absolute top-1/2 -translate-y-1/2 -left-[10px] text-2xl text-gray-300 opacity-40" />
        </div>
      </div>
      <div className="grow shrink h-screen p-4">
        {children}
      </div>
    </div>
  )
}

export default Sidebar
