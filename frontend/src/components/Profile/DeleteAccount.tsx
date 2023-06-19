import type { FC } from "react"
import { useState } from "react"
import { confirmAlert } from "react-confirm-alert"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

import usersService from "../../services/users"
import checkTokenExpiration from "../../utils/checkTokenExpiration"
import REGEX from "../../utils/regex"

const DeleteAccount : FC<{
  setIsLoading : (loading : boolean) => void,
  handleLogout : () => void
}> = ({ setIsLoading, handleLogout }) => {

  const navigate = useNavigate()

  const [open, setOpen] = useState<boolean>(false)
  const [password, setPassword] = useState<string>("")

  const handleDeleteAccount = () => {
    if (!open) {
      setOpen(true)
      return
    }

    if (!REGEX.password.test(password)) {
      toast.error("Invalid current password")
      return
    }

    confirmAlert({
      title: "Confirm deletion",
      message: "Are you sure to delete your account? This action is irreversible",
      buttons: [
        {
          label: "Cancel"
        },
        {
          label: "Delete",
          className: "remove",
          onClick: deleteAccount
        }
      ]
    })
  }

  const deleteAccount = async () => {

    setIsLoading(true)

    try {
      const { valid, message } = checkTokenExpiration()
      if (!valid) {
        toast.error(message)
        navigate("/login",  { replace: true })
        return
      }

      await usersService.deletee(password)

      toast.success("Deleted account")

      handleLogout()
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

  return (
    <>
      <div onClick={handleDeleteAccount} className="mt-4 bg-red-800 px-3 py-1 rounded-lg hover:bg-red-600 font-bold cursor-pointer transition-all duration-700">Delete account</div>
      {open &&
        <div className="text-center mt-1">
          <h3 className="text-lg text-red-700 font-semibold">Insert current password</h3>
          <input
            type="password"
            placeholder="Pas$w0rD"
            value={password}
            onChange={({ target }) => { setPassword(target.value) }}
            className="text-spotify-black bg-white border-2 border-red-700 py-2 px-3 rounded-md leading-tight outline-none placeholder:text-gray-400 transition-all duration-700" />
        </div>
      }
    </>
  )
}

export default DeleteAccount
