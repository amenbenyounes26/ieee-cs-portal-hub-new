import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface BoardMember {
  id: string;
  full_name: string;
  position: string;
  bio: string | null;
  photo_url: string | null;
  linkedin_url: string | null;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useBoardMembers(activeOnly = true) {
  return useQuery({
    queryKey: ["board-members", activeOnly],
    queryFn: async () => {
      let query = supabase.from("board_members").select("*");
      
      if (activeOnly) {
        query = query.eq("is_active", true);
      }
      
      const { data, error } = await query.order("order_index", { ascending: true });

      if (error) throw error;
      return data as BoardMember[];
    },
  });
}

export function useCreateBoardMember() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (member: Omit<BoardMember, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("board_members")
        .insert(member)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["board-members"] });
    },
  });
}

export function useUpdateBoardMember() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...member }: Partial<BoardMember> & { id: string }) => {
      const { data, error } = await supabase
        .from("board_members")
        .update(member)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["board-members"] });
    },
  });
}

export function useDeleteBoardMember() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("board_members")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["board-members"] });
    },
  });
}
