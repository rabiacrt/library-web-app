const STORAGE_KEY = 'library_favs'

const getAllFavs = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export const getFavorites = (userId) => {
  if (!userId) return []
  const all = getAllFavs()
  const userEntry = all.find(u => u.user === userId)
  return userEntry ? userEntry.favorite_books : []
}

export const toggleFavorite = (book, userId) => {
  if (!userId) return []
  const all = getAllFavs()
  const userIndex = all.findIndex(u => u.user === userId)

  if (userIndex === -1) {
    all.push({
      user: userId,
      favorite_books: [{ ...book, addedAt: new Date().toISOString() }]
    })
  } else {
    const favBooks = all[userIndex].favorite_books
    const bookIndex = favBooks.findIndex(b => b.id === book.id)

    if (bookIndex === -1) {
      all[userIndex].favorite_books.push({ ...book, addedAt: new Date().toISOString() })
    } else {
      all[userIndex].favorite_books.splice(bookIndex, 1)
    }
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
  return getFavorites(userId)
}