const parseRelease = (dateString : string) => {
  const date = new Date(dateString)
  return date.getFullYear()
}

const parseDuration = (durationMs : number) => {
  const minutes = Math.floor(durationMs / 60000)
  const seconds = Math.floor((durationMs % 60000) / 1000).toString().padStart(2, "0")
  return { minutes, seconds }
}

export default {
  parseRelease,
  parseDuration
}
