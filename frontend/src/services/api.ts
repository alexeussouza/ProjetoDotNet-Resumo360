// Importa a biblioteca Axios, que será usada para fazer requisições HTTP
import axios from "axios";

// Cria uma instância do Axios com uma URL base definida em variável de ambiente (.env)
// Ex: VITE_API_URL=http://localhost/api
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

// Intercepta todas as requisições feitas com essa instância de Axios
// Serve para adicionar o token JWT automaticamente no cabeçalho Authorization
api.interceptors.request.use((config) => {
  // Busca o token salvo no localStorage após login
  const token = localStorage.getItem("token");
  console.log("🔐 api.ts Usando token:", token);

  // Se houver token, injeta o cabeçalho Authorization
  if (token) {
    // Garante que o objeto headers exista antes de usá-lo
    config.headers = config.headers ?? {};
    
    // Define o cabeçalho Authorization com esquema Bearer (padrão JWT)
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Retorna a configuração atualizada, que será usada na requisição
  return config;
});

export default api;

