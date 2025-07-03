import { materialsApi } from '../../utils/axiosConfig';

export const getMaterials = async () => {
  const response = await materialsApi.get('/materials');
  return response.data;
};

export const getMaterialById = async (id) => {
  const response = await materialsApi.get(`/material/${id}`);
  return response.data;
};

export const createMaterial = async (data) => {
  const response = await materialsApi.post('/material', data);
  return response.data;
};

export const updateMaterial = async (id, data) => {
  const response = await materialsApi.put(`/material/${id}`, data);
  return response.data;
};

export const deleteMaterial = async (id) => {
  const response = await materialsApi.delete(`/material/${id}`);
  return response.data;
};
