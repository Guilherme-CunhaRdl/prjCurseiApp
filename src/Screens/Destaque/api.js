import axios from 'axios';
import host from '../../global';

const api = axios.create({
  baseURL: `http://${host}:8000/api`,
});

export const DestaqueService = {
  // Buscar stories do usuário
  getStories: async (userId) => {
    return axios.get(`http://${host}:8000/api/stories/${userId}`);
  },

  // Buscar destaques do usuário
  async getDestaques(id_user) {
    const response = await api.get(`/destaques/${id_user}`);
    return response.data;
  },

  // Buscar um destaque específico pelo ID
  async getDestaqueById(id) {
    try {
      const response = await api.get(`/destaqueEspecifico/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar destaque:', error);
      throw error;
    }
  },

  // Excluir destaque
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
  try {
    const formData = new FormData();
    
    // Adicionar stories como array
    stories.forEach(id => {
      formData.append('stories[]', parseInt(id));
    });
    
    formData.append('titulo_destaque', titulo_destaque);
    formData.append('id_user', parseInt(id_user));

    // URL específica para atualização
    const url = modoEdicao 
      ? `/destaques/${destaqueId}/stories` // Rota de atualização
      : `/destaques/${id_user}`; // Rota de criação

    // Sempre usar POST (conforme sua rota definida)
    const method = 'POST';

    // Adicionar imagem apenas se fornecida e não for URL
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

    const response = await api.request({
      method,
      url,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json',
      },
    });

    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      const errorMessage = response.data.message || 
                           response.data.error || 
                           `Erro ${response.status} ao ${modoEdicao ? 'atualizar' : 'criar'} destaque`;
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error('Erro no saveDestaque:', {
      message: error.message,
      requestData: { modoEdicao, id_user, destaqueId, stories, titulo_destaque, imageUri }
    });
    
    if (error.response?.data?.errors) {
      const validationErrors = Object.values(error.response.data.errors).flat().join('\n');
      throw new Error(validationErrors);
    }
    
    throw error;
  }
}
};