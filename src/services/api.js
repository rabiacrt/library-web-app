import axios from "axios";


const BASE_URL = 'https://gutendex.com/books/';

const apiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
});

export const bookService = {
    getAllBooks: async (url = '/books') => {
        try {
            const response = await apiClient.get(url);
            return response.data;
        }catch (error) {
            console.error("Kitaplar yüklenirken hata oluştu:", error);
            throw error;
        };
    },

    searchBooks: async (query) => {
        try {
            const response = await apiClient.get(`/books?search=${encodeURIComponent(query)}`);
            return response.data;
          } catch (error) {
            console.error("Arama sırasında hata oluştu:", error);
            throw error;
          }
        },

        getBookDetails: async (id) => {
            try {
              const response = await apiClient.get(`/books/${id}`);
              return response.data;
            } catch (error) {
              console.error("Kitap detayı alınamadı:", error);
              throw error;
            }
          }


};

