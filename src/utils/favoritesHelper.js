//favorileme işlemini kolaylaştırmak için
export const getFavorites = () => {
    const favs = localStorage.getItem('library_favs');
    return favs ? JSON.parse(favs) : [];
  };
  
  export const toggleFavorite = (book) => {
    let favs = getFavorites();
    const isExist = favs.find(f => f.id === book.id);
  
    if (isExist) {
      favs = favs.filter(f => f.id !== book.id);
    } else {
      favs.push(book);
    }
  
    localStorage.setItem('library_favs', JSON.stringify(favs));
    return favs;
  };