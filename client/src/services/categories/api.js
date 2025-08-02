import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/api";

export const useCategories = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: async () => (await api.get("/api/categories")).data,
  });

export const useCreateCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload) =>
      (await api.post("/api/categories", payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
};

export const useUpdateCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    // updates: e.g. { name: "Work - urgent" }
    mutationFn: async ({ categoryId, updates }) =>
      (await api.patch(`/api/categories/${categoryId}`, updates)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export const useDeleteCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ categoryId }) =>
      (await api.delete(`/api/categories/${categoryId}`)).data,
    onMutate: async ({ categoryId }) => {
      // Cancel any outgoing refetches
      await qc.cancelQueries({ queryKey: ["categories"] });

      // Snapshot the previous value
      const previousCategories = qc.getQueryData(["categories"]);

      // Optimistically remove the category
      qc.setQueryData(
        ["categories"],
        (old) => old?.filter((cat) => cat._id !== categoryId) || []
      );

      return { previousCategories };
    },
    onError: (err, { categoryId }, context) => {
      // Rollback on error
      qc.setQueryData(["categories"], context.previousCategories);
    },
    onSettled: () => {
      // Always refetch after error or success
      qc.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};
