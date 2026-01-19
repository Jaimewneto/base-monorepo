<script lang="ts">
  import { onMount } from "svelte";
  import { Button } from "$lib/components/ui/button";
  import * as Table from "$lib/components/ui/table";
  import * as Sheet from "$lib/components/ui/sheet";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { toast } from "svelte-sonner";
  import * as AlertDialog from "$lib/components/ui/alert-dialog";
  import { productRequests } from "$lib/services/api-requests/product";
  import { Loader2, UserPlus, Pencil, Save, Trash2 } from "@lucide/svelte";
  import type { Product } from "$lib/types/api-returns/product";

  // Estados da Lista
  let products = $state<Product[]>([]);
  let loading = $state(true);

  // Estados do Formulário (Modal)
  let open = $state(false);
  let saving = $state(false);
  let productToEdit = $state<Product | null>(null); // Se null, é criação. Se tem objeto, é edição.

  // Campos do Form
  let formData = $state({ description: "", internal_code: "", sku: "", observations: null as string | null });

  // Modal de confimação de exclusão
  let deleteDialogOpen = $state(false);
  let productToDelete = $state<Product | null>(null);
  let deleting = $state(false);

  async function loadProducts() {
    loading = true;
    try {
      const { data } = await productRequests.findMany({ page: 1, limit: 100 });
      products = data;
    } finally {
      loading = false;
    }
  }

  function openCreate() {
    productToEdit = null;
    formData = { description: "", internal_code: "", sku: "", observations: null };
    open = true;
  }

  function openEdit(product: Product) {
    productToEdit = product;
    formData = { description: product.description, internal_code: product.internal_code, sku: product.sku, observations: product.observations as string | null }; // Senha vazia na edição
    open = true;
  }

  function confirmDelete(product: Product) {
    productToDelete = product;
    deleteDialogOpen = true;
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    saving = true;
    try {
      if (productToEdit) {
        // Modo Edição
        await productRequests.updateOneById({ id: productToEdit.id, ...formData });
      } else {
        // Modo Criação
        await productRequests.create(formData);
      }

      open = false;
      await loadProducts(); // Recarrega a lista

      toast.success("Produto salvo com sucesso");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao salvar produto");
    } finally {
      saving = false;
    }
  }

  // Ação real de deletar (Backend Call)
  async function handleDelete() {
    if (!productToDelete) return;
    deleting = true;
    try {
      await productRequests.deleteOneById(productToDelete.id);
      deleteDialogOpen = false;
      await loadProducts(); // Recarrega a lista
      toast.success("Produto excluido com sucesso");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao excluir produto");
    } finally {
      deleting = false;
      productToDelete = null;
    }
  }

  onMount(loadProducts);
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <h2 class="text-3xl font-bold tracking-tight">Produtos</h2>
    <Button size="sm" onclick={openCreate}>
      <UserPlus class="mr-2 h-4 w-4" /> Novo produto
    </Button>
  </div>

  <div class="rounded-md border bg-card">
    <Table.Root>
      <Table.Header>
        <Table.Row>
          <Table.Head>Descrição</Table.Head>
          <Table.Head>Código interno</Table.Head>
          <Table.Head>SKU</Table.Head>
          <Table.Head>Observações</Table.Head>
          <Table.Head class="text-right">Ações</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {#each products as product}
          <Table.Row>
            <Table.Cell>{product.description}</Table.Cell>
            <Table.Cell>{product.internal_code}</Table.Cell>
            <Table.Cell>{product.sku}</Table.Cell>
            <Table.Cell>{product.observations}</Table.Cell>
            <Table.Cell class="text-right">
              <Button variant="ghost" size="icon" onclick={() => openEdit(product)}>
                <Pencil class="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" class="hover:text-destructive" onclick={() => confirmDelete(product)}>
                <Trash2 class="h-4 w-4" />
              </Button>
            </Table.Cell>
          </Table.Row>
        {/each}
      </Table.Body>
    </Table.Root>
  </div>
</div>

<Sheet.Root bind:open>
  <Sheet.Content side="right" class="w-[400px] sm:w-[540px]">
    <Sheet.Header>
      <Sheet.Title>{productToEdit ? "Editar produto" : "Novo produto"}</Sheet.Title>
      <Sheet.Description>
        {productToEdit ? "Altere as informações do produto selecionado." : "Preencha os dados para cadastrar um novo produto."}
      </Sheet.Description>
    </Sheet.Header>

    <form onsubmit={handleSubmit} class="grid gap-4 py-6">
      <div class="grid gap-2">
        <Label for="description">Descrição</Label>
        <Input id="description" bind:value={formData.description} placeholder="Descrição do produto" required />
      </div>

      <div class="grid gap-2">
        <Label for="internal_code">Código interno</Label>
        <Input id="internal_code" type="internal_code" bind:value={formData.internal_code} disabled={!!productToEdit} placeholder="Ex: 000001" required />
      </div>

      <div class="grid gap-2">
        <Label for="sku">SKU</Label>
        <Input id="sku" type="sku" bind:value={formData.sku} required />
      </div>

      <div class="grid gap-2">
        <Label for="observations">Observações</Label>
        <Input id="observations" type="observations" bind:value={formData.observations} placeholder="Observações sobre o produto" />
      </div>

      <div class="flex justify-end gap-3 mt-4">
        <Button variant="outline" onclick={() => (open = false)} type="button">Cancelar</Button>
        <Button type="submit" disabled={saving}>
          {#if saving}
            <Loader2 class="mr-2 h-4 w-4 animate-spin" />
            Salvando...
          {:else}
            <Save class="mr-2 h-4 w-4" />
            Salvar
          {/if}
        </Button>
      </div>
    </form>
  </Sheet.Content>
</Sheet.Root>

<AlertDialog.Root bind:open={deleteDialogOpen}>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Você tem certeza?</AlertDialog.Title>
      <AlertDialog.Description>
        Esta ação não pode ser desfeita. Isso excluirá permanentemente o produto
        <span class="font-bold text-foreground">{productToDelete?.description}</span> 
        e removerá os dados de nossos servidores.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel disabled={deleting}>Cancelar</AlertDialog.Cancel>
      <AlertDialog.Action 
        onclick={handleDelete} 
        class="bg-destructive text-destructive-foreground hover:bg-destructive/90"
        disabled={deleting}
      >
        {#if deleting}
          <Loader2 class="mr-2 h-4 w-4 animate-spin" />
          Excluindo...
        {:else}
          Sim, excluir produto
        {/if}
      </AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
