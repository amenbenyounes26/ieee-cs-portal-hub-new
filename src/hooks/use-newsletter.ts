import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface NewsletterSubscriber {
  id: string;
  email: string;
  created_at: string;
}

export function useNewsletterSubscribers() {
  return useQuery({
    queryKey: ["newsletter-subscribers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("newsletter_subscribers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as NewsletterSubscriber[];
    },
  });
}

export function useSubscribeToNewsletter() {
  return useMutation({
    mutationFn: async (email: string) => {
      const { data, error } = await supabase
        .from("newsletter_subscribers")
        .insert({ email })
        .select()
        .single();

      if (error) {
        if (error.code === "23505") {
          throw new Error("This email is already subscribed.");
        }
        throw error;
      }
      return data;
    },
  });
}

export function useDeleteNewsletterSubscriber() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["newsletter-subscribers"] });
    },
  });
}
