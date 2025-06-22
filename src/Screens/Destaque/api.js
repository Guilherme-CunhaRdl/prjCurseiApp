// Função atualizada para enviar imagem corretamente (estilo do upload de story)
import axios from 'axios';
import host from '../../global';

const api = axios.create({
  baseURL: `http://${host}:8000/api`,
});

export const DestaqueService = {
  getStories: async (userId) => {
    return axios.get(`http://${host}:8000/api/stories/${userId}`);
  },

  async getDestaques(id_user) {
    const response = await api.get(`/destaques/${id_user}`);
    return response.data;
  },

  async createDestaque(id_user, stories, titulo_destaque) {
    const response = await api.post(`/destaques/${id_user}`, {
      stories,
      titulo_destaque
    });
    return response.data;
  },

  async atualizarDestaque(id_destaque, stories) {
    const response = await api.put(`/destaques/${id_destaque}/stories`, { stories });
    return response.data;
  },

  async deleteDestaque(id_user, id) {
    const response = await api.delete(`/destaques/${id_user}/${id}`);
    return response.data;
  },

  async createDestaqueWithImage(id_user, stories, titulo_destaque, imageUri) {
    if (!imageUri || typeof imageUri !== 'string') {
      throw new Error('URI da imagem inválida');
    }

    const formData = new FormData();
    stories.forEach(id => formData.append('stories[]', id));
    formData.append('titulo_destaque', titulo_destaque);

    const uriParts = imageUri.split('.');
    const extension = uriParts[uriParts.length - 1].split('?')[0].toLowerCase();
    const type = extension === 'jpg' ? 'jpeg' : extension;

    formData.append('foto_destaque', {
      uri: imageUri,
      name: `capa_${Date.now()}.${extension}`,
      type: `image/${type}`,
    });

    const response = await fetch(`http://${host}:8000/api/destaques/${id_user}`, {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Erro ao criar destaque');
    }

    return result;
  },
};