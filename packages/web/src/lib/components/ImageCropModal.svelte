<script lang="ts">
  import { onMount } from "svelte";
  import { Button } from "$lib/components/ui/button";
  import * as Dialog from "$lib/components/ui/dialog";
  import { v7 as uuid } from "uuid";

  interface Props {
    open: boolean;
    src: string;
    onConfirm: (file: File) => void;
    onCancel: () => void;
  }

  let { open = $bindable(), src, onConfirm, onCancel }: Props = $props();

  let imageEl: HTMLImageElement | null = $state(null);
  let cropper: any = $state(null);
  let scriptsLoaded = $state(false);
  let currentSrc = $state<string | null>(null);

  // Carrega CSS e JS do Cropper localmente
  onMount(() => {
    if (typeof window !== "undefined" && !(window as any).Cropper) {
      // CSS
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "/cropper/cropper.css"; // arquivo local em public/cropper/
      document.head.appendChild(link);

      // JS
      const script = document.createElement("script");
      script.src = "/cropper/cropper.min.js"; // arquivo local em public/cropper/
      script.onload = () => {
        scriptsLoaded = true;
      };
      document.head.appendChild(script);
    } else {
      scriptsLoaded = true;
    }
  });

  // Inicializa o cropper quando src mudar
  $effect(() => {
    if (!open || !src || !imageEl || !scriptsLoaded) return;

    if (currentSrc === src && cropper) return;
    currentSrc = src;

    // destrói cropper antigo se existir
    if (cropper) {
      cropper.destroy();
      cropper = null;
    }

    const initCropper = () => {
      if (!imageEl || cropper) return;
      const CropperClass = (window as any).Cropper;
      if (!CropperClass) return;

      cropper = new CropperClass(imageEl, {
        aspectRatio: 1,
        viewMode: 1,
        autoCropArea: 1,
        responsive: true,
        background: false,
        guides: true,
        center: true,
        highlight: true,
        cropBoxResizable: true,
        cropBoxMovable: true,
        dragMode: "move",
      });
    };

    if (imageEl.complete) {
      setTimeout(initCropper, 100);
    } else {
      imageEl.addEventListener("load", initCropper, { once: true });
    }
  });

  async function confirmCrop() {
    if (!cropper) return;

    const canvas = cropper.getCroppedCanvas({
      width: 512,
      height: 512,
      imageSmoothingEnabled: true,
      imageSmoothingQuality: "high",
    });

    if (!canvas) return;

    canvas.toBlob(
      (blob: Blob | null) => {
        if (!blob) return;

        const file = new File([blob], uuid() + ".jpg", {
          type: "image/jpeg",
        });

        onConfirm(file);

        // limpa cropper
        cropper.destroy();
        cropper = null;
        currentSrc = null;
      },
      "image/jpeg",
      0.9,
    );
  }

  function handleCancel() {
    cropper?.destroy();
    cropper = null;
    currentSrc = null;
    onCancel();
  }
</script>

<Dialog.Root bind:open>
  <Dialog.Content class="max-w-4xl h-[80vh] flex flex-col">
    <Dialog.Header>
      <Dialog.Title>Recortar imagem</Dialog.Title>
    </Dialog.Header>

    <div class="flex-1 overflow-hidden rounded-md border bg-muted flex items-center justify-center">
      {#if src}
        <div class="w-full h-full flex items-center justify-center">
          <img bind:this={imageEl} {src} alt="Imagem para recortar" style="display: block; max-width: 100%;" />
        </div>
      {/if}
    </div>

    <div class="flex justify-end gap-3 pt-4">
      <Button variant="outline" onclick={handleCancel}>Cancelar</Button>
      <Button onclick={confirmCrop}>Confirmar recorte</Button>
    </div>
  </Dialog.Content>
</Dialog.Root>
