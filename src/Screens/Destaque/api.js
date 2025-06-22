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

  async deleteDestaque(id_user, id) {
    const response = await api.delete(`/destaques/${id_user}/${id}`);
    return response.data;
  },

  // Função unificada para criar/atualizar destaque com imagem
  async saveDestaque({ 
    modoEdicao = false, 
    id_user, 
    destaqueId, 
    stories, 
    titulo_destaque, 
    imageUri 
  }) {
    const formData = new FormData();
    stories.forEach(id => formData.append('stories[]', id));
    formData.append('titulo_destaque', titulo_destaque);

    // Determinar método e URL baseado no modo
    const method = modoEdicao ? 'POST' : 'POST';
    const url = modoEdicao 
      ? `/destaques/${destaqueId}/stories` 
      : `/destaques/${id_user}`;

    // Adicionar imagem se fornecida e não for URL (nova imagem)
    if (imageUri && !imageUri.startsWith('http')) {
      const uriParts = imageUri.split('.');
      const extension = uriParts[uriParts.length - 1].split('?')[0].toLowerCase();
      const type = extension === 'jpg' ? 'jpeg' : extension;

      formData.append('foto_destaque', {
        uri: imageUri,
        name: `capa_${Date.now()}.${extension}`,
        type: `image/${type}`,
      });
    }

    const response = await fetch(`http://${host}:8000/api${url}`, {
      method,
      body: formData,
      headers: {
        Accept: 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || `Erro ao ${modoEdicao ? 'atualizar' : 'criar'} destaque`);
    }

    return result;
  },
};