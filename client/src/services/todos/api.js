import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/api";

export const useTodosByCategory = (categoryId) =>
  useQuery({
    queryKey: ["todos", categoryId],
    queryFn: async () =>
      (await api.get(`/api/categories/${categoryId}/tasks`)).data,
    enabled: !!categoryId,
  });

export const useCreateTodo = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ categoryId, title, priority }) =>
      (
        await api.post(`/api/categories/${categoryId}/tasks`, {
          title,
          priority,
        })
      ).data,
    onSuccess: (_, { categoryId }) =>
      qc.invalidateQueries({ queryKey: ["todos", categoryId] }),
  });
};

export const useUpdateTodo = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ categoryId, taskId, updates }) =>
      (
        await api.patch(
          `/api/categories/${categoryId}/tasks/${taskId}`,
          updates
        )
      ).data,
    onSuccess: (_, { categoryId }) =>
      qc.invalidateQueries({ queryKey: ["todos", categoryId] }),
  });
};

export const useDeleteTodo = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ categoryId, taskId }) =>
      (await api.delete(`/api/categories/${categoryId}/tasks/${taskId}`)).data,
    onSuccess: (_, { categoryId }) =>
      qc.invalidateQueries({ queryKey: ["todos", categoryId] }),
  });
};

export const useToggleTodo = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ categoryId, taskId, completed }) =>
      (
        await api.patch(`/api/categories/${categoryId}/tasks/${taskId}`, {
          completed,
        })
      ).data,
    onSuccess: (_data, { categoryId }) => {
      qc.invalidateQueries({ queryKey: ["todos", categoryId] });
    },
  });
};