import { supabase } from "@/integrations/supabase/client";

/** Uploads an image to the journal media library and returns a long-lived link. */
export async function uploadImage(file: File, folder: "covers" | "team"): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Please choose an image file.");
  if (file.size > 10 * 1024 * 1024) throw new Error("Image must be under 10 MB.");
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("journal-media").upload(path, file, { contentType: file.type });
  if (error) throw new Error(error.message);
  const { data, error: e2 } = await supabase.storage.from("journal-media").createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
  if (e2 || !data) throw new Error(e2?.message ?? "Could not create image link.");
  return data.signedUrl;
}
