import axios from 'axios';

// Cria uma instância do Axios com a URL base da API exigida no trabalho
export const api = axios.create({
    baseURL: 'https://dummyjson.com',
});