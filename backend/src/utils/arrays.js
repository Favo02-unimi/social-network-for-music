/**
 * Shuffle an array
 * @param {any[]} arr input array
 * @returns {any[]} shuffled array
 */
const shuffleArray = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))

    let temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
  }
  return arr
}

export default shuffleArray
