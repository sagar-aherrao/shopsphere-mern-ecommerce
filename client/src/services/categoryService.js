import api from "./api";

export const getCategories = async () => {
  const response = await api.get("/categories");

  return response.data;
};

export const getCategory = async (id) => {
  const response = await api.get(`/categories/${id}`);

  return response.data;
};

export const createCategory = async (formData) => {
  const response = await api.post("/categories", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const updateCategory = async (id, formData) => {
  const response = await api.put(`/categories/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await api.delete(`/categories/${id}`);

  return response.data;
};