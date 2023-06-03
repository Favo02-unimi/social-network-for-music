import type { FC, ReactElement } from "react"
import { useCallback, useEffect, useRef, useState } from "react"

const Sidebar : FC<{sideContent : ReactElement, content : ReactElement}> = ({ sideContent, content }) => {

  const sidebarRef = useRef<HTMLDivElement>(null)
  const [isResizing, setIsResizing] = useState<boolean>(false)
  const [sidebarWidth, setSidebarWidth] = useState<number>(268)

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
        className="grow-0 shrink-0 min-w-[150px] max-w-[600px] flex flex-row border-r-2 border-gray-300 shadow-md"
        style={{ width: sidebarWidth }}
        onMouseDown={(e) => e.preventDefault()}
      >
        <div className="grow shrink">
          {sideContent}
        </div>
        <div className="grow-0 shrink-0 basis-1 justify-self-end cursor-col-resize resize-x hover:w-1 bg-gray-300" onMouseDown={startResizing} />
      </div>
      <div className="grow shrink flex flex-col h-screen shadow-md">
        {content}
      </div>
    </div>
  )
}

export default Sidebar
