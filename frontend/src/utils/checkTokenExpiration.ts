/**
 * Check expiration date of current token.
 * The expiration date saved in localStorage can be easily manipulated,
 * this is just a check to display a decent error message if the token is expired.
 * The token will still be validated by backend (/api/verify) to access resources
 * @returns {boolean, string, string} validity of token (only checking expiration), type of error, message of error
 */
const checkTokenExpiration = () => {

  const expires = localStorage.getItem("expires")

  if (!expires) {
    localStorage.removeItem("token")
    return { valid: false, type: "missing", message: "Login to access this page" }
  }

  const expirationDate = new Date(expires)

  if (new Date() >= expirationDate) {
    localStorage.removeItem("expires")
    localStorage.removeItem("token")
    return { valid: false, type: "expired", message: "Login session expired, please login again" }
  }

  return { valid: true }
}

export default checkTokenExpiration
