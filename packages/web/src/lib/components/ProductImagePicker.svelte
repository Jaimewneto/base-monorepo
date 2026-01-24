<script lang="ts">
  import ImageCropModal from "./ImageCropModal.svelte";
  import { X, Plus } from "@lucide/svelte";

  export type ImageItem =
    | { type: "url"; url: string; id: string } // imagem já existente
    | { type: "file"; file: File }; // imagem nova (preview)

  interface Props {
    images?: ImageItem[];
    onChange: (images: ImageItem[]) => void;
  }

  let { images = $bindable([]), onChange }: Props = $props();

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
    images = [...images, { type: "file", file }];

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
</script>

<div class="grid grid-cols-4 gap-3">
  {#each images as image, i}
    <div class="relative group aspect-square rounded-md border overflow-hidden">
      <img src={getSrc(image)} class="h-full w-full object-cover" alt="Imagem do produto" />
      <button type="button" class="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition" onclick={() => removeImage(i)}>
        <X class="h-4 w-4 text-white drop-shadow" />
      </button>
    </div>
  {/each}

  <!-- Botão adicionar -->
  <label class="aspect-square rounded-md border border-dashed flex items-center justify-center cursor-pointer hover:bg-muted">
    <Plus class="h-6 w-6 text-muted-foreground" />
    <input type="file" accept="image/*" class="hidden" onchange={selectImage} />
  </label>
</div>

{#if tempSrc}
  <ImageCropModal bind:open={cropOpen} src={tempSrc} onConfirm={confirmImage} onCancel={cancelCrop} />
{/if}
