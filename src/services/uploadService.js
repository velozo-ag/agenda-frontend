import axiosClient from '../api/axiosClient';

export const uploadService = {
  uploadImage: async (file, type = 'general') => {
    const formData = new FormData();
    formData.append('file', file);

    return await axiosClient.post(`/upload/image?type=${encodeURIComponent(type)}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default uploadService;
