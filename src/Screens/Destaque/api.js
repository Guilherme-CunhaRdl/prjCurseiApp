// api.js
import axios from 'axios';
import host from '../../global';

const api = axios.create({
  baseURL: `http://${host}:8000/api`,
});

export const DestaqueService = {
  // Listar destaques e stories
  async getDestaques(id_user) {
    const response = await api.get(`/destaques/${id_user}`);
    return response.data;
  },

  // Criar novo destaque
  async createDestaque(id_user, stories) {
    const response = await api.post(`/destaques/${id_user}`, { stories });
    return response.data;
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