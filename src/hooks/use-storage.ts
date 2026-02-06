import { supabase } from "@/integrations/supabase/client";

export type StorageFolder = "covers" | "board" | "sponsors";

export async function uploadFile(
  folder: StorageFolder,
  file: File
): Promise<string> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("public-assets")
    .upload(fileName, file);

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from("public-assets")
    .getPublicUrl(fileName);

  return data.publicUrl;
}

export async function deleteFile(url: string): Promise<void> {
  // Extract the path from the URL
  const urlObj = new URL(url);
  const path = urlObj.pathname.split("/public-assets/")[1];
  
  if (!path) return;

  const { error } = await supabase.storage
    .from("public-assets")
    .remove([path]);

  if (error) throw error;
}
