<script lang="ts">
  import ImageCropModal from "./ImageCropModal.svelte";
  import { X, Plus, Star, Camera } from "@lucide/svelte";

  export type ImageItem = { type: "url"; url: string; id: string; isMain?: boolean } | { type: "file"; file: File; isMain?: boolean };

  interface Props {
    images?: ImageItem[];
    onChange: (images: ImageItem[]) => void;
    enableMainImage?: boolean;
  }

  let { images = $bindable([]), enableMainImage = false, onChange }: Props = $props();

  let cropOpen = $state(false);
  let tempSrc = $state<string | null>(null);

  function getSrc(image: ImageItem) {
    return image.type === "url" ? image.url : URL.createObjectURL(image.file);
  }

  function selectImage(e: Event) {
    const input = e.target as HTMLInputElement;
    if (!input.files?.[0]) return;

    tempSrc = URL.createObjectURL(input.files[0]);
    cropOpen = true;
  }

  function confirmImage(file: File) {
    images = [
      ...images,
      {
        type: "file",
        file,
        isMain: enableMainImage && images.length === 0,
      },
    ];

    onChange(images);
    cropOpen = false;
    tempSrc = null;
  }

  function removeImage(index: number) {
    images = images.filter((_, i) => i !== index);
    onChange(images);
  }

  function cancelCrop() {
    cropOpen = false;
    if (tempSrc) {
      URL.revokeObjectURL(tempSrc);
      tempSrc = null;
    }
  }

  function setMainImage(index: number) {
    if (!enableMainImage) return;

    images = images.map((img, i) => ({
      ...img,
      isMain: i === index,
    }));

    onChange(images);
  }
</script>

<div class="grid grid-cols-4 gap-3">
  {#each images as image, i}
    <div class="relative group aspect-square rounded-md border overflow-hidden">
      <img src={getSrc(image)} class="h-full w-full object-cover" alt="Imagem do produto" />

      <button type="button" class="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition" onclick={() => removeImage(i)}>
        <X class="h-4 w-4 text-white drop-shadow" />
      </button>

      {#if enableMainImage}
        <button type="button" class="absolute bottom-1 right-1 transition" onclick={() => setMainImage(i)}>
          <Star class={`h-4 w-4 drop-shadow ${image.isMain ? "text-yellow-400" : "text-white"}`} fill={image.isMain ? "currentColor" : "none"} />
        </button>
      {/if}
    </div>
  {/each}

  <label class="aspect-square rounded-md border border-dashed flex items-center justify-center cursor-pointer hover:bg-muted transition-colors">
    <Plus class="h-6 w-6 text-muted-foreground" />
    <input type="file" accept="image/*" class="hidden" onchange={selectImage} />
  </label>

  <label
    class="hidden max-md:flex aspect-square rounded-md border border-dashed items-center justify-center cursor-pointer hover:bg-muted transition-colors"
  >
    <Camera class="h-6 w-6 text-muted-foreground" />
    <input type="file" accept="image/*" capture="environment" class="hidden" onchange={selectImage} />
  </label>
</div>

{#if tempSrc}
  <ImageCropModal bind:open={cropOpen} src={tempSrc} onConfirm={confirmImage} onCancel={cancelCrop} />
{/if}
