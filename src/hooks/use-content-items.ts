import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type ContentKind = "event" | "workshop" | "bootcamp";
export type ContentStatus = "draft" | "published";

export interface ContentItem {
  id: string;
  kind: ContentKind;
  title: string;
  slug: string;
  excerpt: string | null;
  start_at: string | null;
  end_at: string | null;
  location: string | null;
  format: string | null;
  cover_image_url: string | null;
  registration_url: string | null;
  description_md: string | null;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
}

export function useContentItems(kind?: ContentKind, status?: ContentStatus) {
  return useQuery({
    queryKey: ["content-items", kind, status],
    queryFn: async () => {
      let query = supabase.from("content_items").select("*");
      
      if (kind) {
        query = query.eq("kind", kind);
      }
      if (status) {
        query = query.eq("status", status);
      }
      
      const { data, error } = await query.order("start_at", { ascending: false });

      if (error) throw error;
      return data as ContentItem[];
    },
  });
}

export function useContentItem(kind: ContentKind, slug: string) {
  return useQuery({
    queryKey: ["content-item", kind, slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content_items")
        .select("*")
        .eq("kind", kind)
        .eq("slug", slug)
        .single();

      if (error) throw error;
      return data as ContentItem;
    },
    enabled: !!slug,
  });
}

export function useUpcomingContent(kind?: ContentKind, limit = 6) {
  return useQuery({
    queryKey: ["upcoming-content", kind, limit],
    queryFn: async () => {
      let query = supabase
        .from("content_items")
        .select("*")
        .eq("status", "published")
        .gte("start_at", new Date().toISOString());
      
      if (kind) {
        query = query.eq("kind", kind);
      }
      
      const { data, error } = await query
        .order("start_at", { ascending: true })
        .limit(limit);

      if (error) throw error;
      return data as ContentItem[];
    },
  });
}

export function useCreateContentItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (item: Omit<ContentItem, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("content_items")
        .insert(item)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content-items"] });
    },
  });
}

export function useUpdateContentItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...item }: Partial<ContentItem> & { id: string }) => {
      const { data, error } = await supabase
        .from("content_items")
        .update(item)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content-items"] });
      queryClient.invalidateQueries({ queryKey: ["content-item"] });
    },
  });
}

export function useDeleteContentItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("content_items")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content-items"] });
    },
  });
}
