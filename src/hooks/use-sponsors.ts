import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Sponsor {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useSponsors(activeOnly = true) {
  return useQuery({
    queryKey: ["sponsors", activeOnly],
    queryFn: async () => {
      let query = supabase.from("sponsors").select("*");
      
      if (activeOnly) {
        query = query.eq("is_active", true);
      }
      
      const { data, error } = await query.order("order_index", { ascending: true });

      if (error) throw error;
      return data as Sponsor[];
    },
  });
}

export function useCreateSponsor() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (sponsor: Omit<Sponsor, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("sponsors")
        .insert(sponsor)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sponsors"] });
    },
  });
}

export function useUpdateSponsor() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...sponsor }: Partial<Sponsor> & { id: string }) => {
      const { data, error } = await supabase
        .from("sponsors")
        .update(sponsor)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sponsors"] });
    },
  });
}

export function useDeleteSponsor() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("sponsors")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sponsors"] });
    },
  });
}
