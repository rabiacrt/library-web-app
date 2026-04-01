import axios from "axios";
//api servisi için

const BASE_URL = 'https://gutendex.com';

const apiClient = axios.create({
    baseURL: BASE_URL,
    //timeout: 20000,
});

export const bookService = {
    getAllBooks: async (url = '/books') => {
        try {
            const targetUrl = url.startsWith('http') ? url : url;
            
            const response = await apiClient.get(targetUrl);
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

