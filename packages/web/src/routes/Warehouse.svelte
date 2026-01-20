<script lang="ts">
  import { onMount } from "svelte";
  import { toast } from "svelte-sonner";
  import { Loader2, Pencil, Save, Trash2, WarehouseIcon } from "@lucide/svelte";

  import { Button } from "$lib/components/ui/button";
  import * as Table from "$lib/components/ui/table";
  import * as Sheet from "$lib/components/ui/sheet";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import * as AlertDialog from "$lib/components/ui/alert-dialog";
  import DataTable from "$lib/components/DataTable.svelte";

  import { warehouseRequests } from "$lib/services/api-requests/warehouse";

  import type { Warehouse } from "$lib/types/api-returns/warehouse";
  import type { Column, SortField, WhereField } from "$lib/types/components/DataTable";
  import type { WarehouseFindManySortArgs, WarehouseFindManyWhereArgs } from "$lib/types/findManyArgs";

  // Estados da Lista
  let warehouses = $state<Warehouse[]>([]);
  let loading = $state(true);

  // Definição das colunas para o seu DataTable
  const columns = [
    { label: "Descrição", field: "warehouse.description", operator: "ilike", valueType: "string", sortable: true, filterable: true },
    { label: "Observações", field: "warehouse.observations", operator: "ilike", valueType: "string", sortable: true, filterable: true },
  ] satisfies Column<WhereField<NonNullable<WarehouseFindManyWhereArgs>>, SortField<WarehouseFindManySortArgs>>[];

  // Estado para armazenar a query atual
  let currentQuery = $state({
    where: { conditions: [] } as WarehouseFindManyWhereArgs,
    sort: [{ field: "warehouse.description", direction: "asc" }] as WarehouseFindManySortArgs,
  });

  // Estados do Formulário (Modal)
  let open = $state(false);
  let saving = $state(false);
  let warehouseToEdit = $state<Warehouse | null>(null);

  // Campos do Form
  let formData = $state({ description: "", observations: null as string | null });

  // Modal de confimação de exclusão
  let deleteDialogOpen = $state(false);
  let warehouseToDelete = $state<Warehouse | null>(null);
  let deleting = $state(false);

  async function loadWarehouses() {
    loading = true;
    try {
      const { data } = await warehouseRequests.findMany({
        page: 1,
        limit: 100,
        where: currentQuery.where,
        sort: currentQuery.sort,
      });
      warehouses = data;
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("Erro ao carregar estoques");
    } finally {
      loading = false;
    }
  }

  function handleQueryChange(params: { where: WarehouseFindManyWhereArgs; sort: WarehouseFindManySortArgs }) {
    currentQuery = params;
    loadWarehouses();
  }

  function openCreate() {
    warehouseToEdit = null;
    formData = { description: "", observations: null };
    open = true;
  }

  function openEdit(warehouse: Warehouse) {
    warehouseToEdit = warehouse;
    formData = {
      description: warehouse.description,
      observations: warehouse.observations as string | null,
    };
    open = true;
  }

  function confirmDelete(warehouse: Warehouse) {
    warehouseToDelete = warehouse;
    deleteDialogOpen = true;
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    saving = true;
    try {
      if (warehouseToEdit) {
        await warehouseRequests.updateOneById({ id: warehouseToEdit.id, ...formData });
      } else {
        await warehouseRequests.create(formData);
      }
      open = false;
      await loadWarehouses();
      toast.success("Estoque salvo com sucesso");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao salvar estoque");
    } finally {
      saving = false;
    }
  }

  async function handleDelete() {
    if (!warehouseToDelete) return;
    deleting = true;
    try {
      await warehouseRequests.deleteOneById(warehouseToDelete.id);
      deleteDialogOpen = false;
      await loadWarehouses();
      toast.success("Estoque excluido com sucesso");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao excluir estoque");
    } finally {
      deleting = false;
      warehouseToDelete = null;
    }
  }

  onMount(loadWarehouses);
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <h2 class="text-3xl font-bold tracking-tight">Estoques</h2>
    <Button size="sm" onclick={openCreate}>
      <WarehouseIcon class="mr-2 h-4 w-4" /> Novo estoque
    </Button>
  </div>

  <DataTable {columns} data={warehouses} {loading} onQueryChange={handleQueryChange}>
    {#each warehouses as warehouse}
      <Table.Row>
        <Table.Cell>{warehouse.description}</Table.Cell>
        <Table.Cell>{warehouse.observations ?? "-"}</Table.Cell>
        <Table.Cell class="text-right">
          <div class="flex justify-end gap-2">
            <Button variant="ghost" size="icon" onclick={() => openEdit(warehouse)}>
              <Pencil class="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" class="hover:text-destructive" onclick={() => confirmDelete(warehouse)}>
              <Trash2 class="h-4 w-4" />
            </Button>
          </div>
        </Table.Cell>
      </Table.Row>
    {/each}
  </DataTable>
</div>

<Sheet.Root bind:open>
  <Sheet.Content side="right" class="w-[400px] sm:w-[540px]">
    <Sheet.Header>
      <Sheet.Title>{warehouseToEdit ? "Editar estoque" : "Novo estoque"}</Sheet.Title>
      <Sheet.Description>
        {warehouseToEdit ? "Altere as informações do estoque selecionado." : "Preencha os dados para cadastrar um novo estoque."}
      </Sheet.Description>
    </Sheet.Header>

    <form onsubmit={handleSubmit} class="grid gap-4 py-6">
      <div class="grid gap-2">
        <Label for="description">Descrição</Label>
        <Input id="description" bind:value={formData.description} placeholder="Descrição do estoque" required />
      </div>

      <div class="grid gap-2">
        <Label for="observations">Observações</Label>
        <Input id="observations" bind:value={formData.observations} placeholder="Observações sobre o estoque" />
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
        Esta ação não pode ser desfeita. Isso excluirá permanentemente o estoque
        <span class="font-bold text-foreground">{warehouseToDelete?.description}</span>
        e removerá os dados de nossos servidores.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel disabled={deleting}>Cancelar</AlertDialog.Cancel>
      <AlertDialog.Action onclick={handleDelete} class="bg-destructive text-destructive-foreground hover:bg-destructive/90" disabled={deleting}>
        {#if deleting}
          <Loader2 class="mr-2 h-4 w-4 animate-spin" />
          Excluindo...
        {:else}
          Sim, excluir estoque
        {/if}
      </AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
