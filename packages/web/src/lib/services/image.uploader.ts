import { supabase } from "$lib/supabase/client";

export const STORAGE_BUCKETS = ["product-images"] as const;

type StorageBucket = (typeof STORAGE_BUCKETS)[number];

type UploadImageParams = {
    file: File;
    bucket: StorageBucket;
    folder?: string; // ex: productId, userId, etc
    filename?: string; // opcional, se quiser controlar
};

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png"];
const MAX_SIZE_MB = 5;

export async function uploadImage({
    file,
    bucket,
    folder,
    filename,
}: UploadImageParams): Promise<string> {
    if (!file) {
        throw new Error("Arquivo não informado");
    }

    // valida tipo
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        throw new Error("A imagem deve ser JPEG ou PNG");
    }

    // valida tamanho
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        throw new Error(`Imagem deve ter no máximo ${MAX_SIZE_MB}MB`);
    }

    const extension = file.type === "image/png" ? "png" : "jpg";

    const safeFilename = filename ?? `${crypto.randomUUID()}.${extension}`;

    const path = folder ? `${folder}/${safeFilename}` : safeFilename;

    const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
            upsert: false,
            contentType: file.type,
            cacheControl: "3600",
        });

    if (uploadError) {
        throw uploadError;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);

    if (!data?.publicUrl) {
        throw new Error("Não foi possível obter a URL pública");
    }

    return data.publicUrl;
}
