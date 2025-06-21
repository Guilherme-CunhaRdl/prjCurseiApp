import axios from 'axios';
import host from '../../global';

const api = axios.create({
  baseURL: `http://${host}:8000/api`,
});

export const DestaqueService = {
  async getDestaques(id_user) {
    console.log('ID do usuário sendo usado na requisição:', id_user);
    try {
      const response = await api.get(`/destaques/${id_user}`);
      console.log('Resposta da API:', response.data); // Adicione este log
      return response.data;
    } catch (error) {
      console.error('Erro na requisição:', error.response?.data || error.message);
      throw error;
    }
  },
  // Criar novo destaque
  async createDestaque(id_user, stories, titulo_destaque) {
    try {
      const response = await api.post(`/destaques/${id_user}`, {
        stories,
        titulo_destaque // Adicionar o título aqui
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Sincronizar lista de stories
  async atualizarDestaque(id_destaque, stories) {
    const response = await api.put(`/destaques/${id_destaque}/stories`, { stories });
    return response.data;
  },

  // Excluir destaque
  async deleteDestaque(id_user, id) {
    const response = await api.delete(`/destaques/${id_user}/${id}`);
    return response.data;
  },
};