import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type MessageStatus = "unread" | "read";

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: MessageStatus;
  created_at: string;
}

export function useContactMessages() {
  return useQuery({
    queryKey: ["contact-messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as ContactMessage[];
    },
  });
}

export function useUnreadMessagesCount() {
  return useQuery({
    queryKey: ["unread-messages-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("contact_messages")
        .select("*", { count: "exact", head: true })
        .eq("status", "unread");

      if (error) throw error;
      return count ?? 0;
    },
  });
}

export function useSubmitContactMessage() {
  return useMutation({
    mutationFn: async (message: Omit<ContactMessage, "id" | "status" | "created_at">) => {
      const { data, error } = await supabase
        .from("contact_messages")
        .insert({ ...message, status: "unread" })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
  });
}

export function useUpdateMessageStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: MessageStatus }) => {
      const { data, error } = await supabase
        .from("contact_messages")
        .update({ status })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-messages"] });
      queryClient.invalidateQueries({ queryKey: ["unread-messages-count"] });
    },
  });
}

export function useDeleteContactMessage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("contact_messages")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-messages"] });
      queryClient.invalidateQueries({ queryKey: ["unread-messages-count"] });
    },
  });
}
