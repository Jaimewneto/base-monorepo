<script lang="ts">
  import { onMount } from "svelte";
  import { toast } from "svelte-sonner";
  import { Loader2, Pencil, Save, Trash2, PackagePlus, Warehouse, X } from "@lucide/svelte";

  import { Button } from "$lib/components/ui/button";
  import * as Table from "$lib/components/ui/table";
  import * as Sheet from "$lib/components/ui/sheet";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import DataTable from "$lib/components/DataTable.svelte";
  import * as AlertDialog from "$lib/components/ui/alert-dialog";

  import { productRequests } from "$lib/services/api-requests/product";
  import { inventoryRequests } from "$lib/services/api-requests/inventory";

  import type { Product, ProductWithInventories } from "$lib/types/api-returns/product";
  import type { ProductFindManySortArgs, ProductFindManyWhereArgs } from "$lib/types/findManyArgs";
  import type { Column, SortField, WhereField } from "$lib/types/components/DataTable";

  import ProductImagePicker, { type ImageItem } from "$lib/components/ProductImagePicker.svelte";
  import { uploadImage } from "$lib/services/image.uploader";
  import type { ProductImageInsertMany } from "$lib/types/productImage";
  import { productImageRequests } from "$lib/services/api-requests/productImage";
  import MoneyInput from "$lib/components/MoneyInput.svelte";
  import { numericToBrazilianCurrency } from "$lib/utils";

  // Estados da Lista
  let totalRecords = $state(0);
  let currentPage = $state(1);
  let pageLimit = $state(10);
  let products = $state<ProductWithInventories[]>([]);
  let loading = $state(true);

  // Definição das colunas para o seu DataTable
  const columns = [
    { label: "SKU", field: "product.sku", operator: "ilike", valueType: "string", sortable: true, filterable: true },
    { label: "Descrição", field: "product.description", operator: "ilike", valueType: "string", sortable: true, filterable: true },
    { label: "Cód. fabricante", field: "product.mpn", operator: "ilike", valueType: "string", sortable: true, filterable: true },
    { label: "Cód. barras", field: "product.gtin", operator: "ilike", valueType: "string", sortable: true, filterable: true },
    { label: "NCM", field: "product.ncm", operator: "ilike", valueType: "string", sortable: true, filterable: true },
    { label: "Preço", field: "product.default_price", operator: "=", valueType: "number", sortable: true, filterable: true },
    { label: "Unidade", field: "product.unit_of_measure", operator: "ilike", valueType: "string", sortable: true, filterable: true },
    { label: "Total em estoque", field: "product.total_in_inventories", operator: "=", valueType: "number", sortable: false, filterable: false },
    { label: "Observações", field: "product.observations", operator: "ilike", valueType: "string", sortable: true, filterable: true },
  ] satisfies Column<WhereField<NonNullable<ProductFindManyWhereArgs>>, SortField<ProductFindManySortArgs>>[];

  // Estado para armazenar a query atual
  let currentQuery = $state({
    where: { conditions: [] } as ProductFindManyWhereArgs,
    sort: [{ field: "product.description", direction: "asc" }] as ProductFindManySortArgs,
  });

  // Estados do Formulário (Modal)
  let open = $state(false);
  let saving = $state(false);
  let productToEdit = $state<Product | null>(null);

  // Campos do Form
  let formData = $state({
    sku: "",
    description: "",
    gtin: null as string | null,
    mpn: null as string | null,
    ncm: null as string | null,
    default_price: 0,
    unit_of_measure: "",
    observations: null as string | null,
  });

  // Modal de confimação de exclusão
  let deleteDialogOpen = $state(false);
  let productToDelete = $state<Product | null>(null);
  let deleting = $state(false);

  // Estados para Visualização de Estoque Detalhado
  let inventorySheetOpen = $state(false);
  let selectedProductInventories = $state<ProductWithInventories | null>(null);

  // Estados pra alteração de quantidade em estoque
  let editingInventoryId = $state<string | null>(null); // ID do warehouse que está sendo editado
  let newAmount = $state<number>(0);
  let updatingInventory = $state(false);

  // Imagens
  let productImagefiles = $state<File[]>([]);
  let productImages = $state<ProductImageInsertMany>([]);
  let renderedImages = $state<ImageItem[]>([]);

  function openInventoryDetails(product: ProductWithInventories) {
    selectedProductInventories = product;
    inventorySheetOpen = true;
  }

  async function loadProducts() {
    loading = true;
    try {
      const { data, meta } = await productRequests.findMany({
        page: currentPage,
        limit: pageLimit,
        where: currentQuery.where,
        sort: currentQuery.sort,
      });
      products = data;
      totalRecords = meta.total_registers ?? 0;
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("Erro ao carregar produtos");
    } finally {
      loading = false;
    }
  }

  function handleQueryChange(params: { page: number; limit: number; where: ProductFindManyWhereArgs; sort: ProductFindManySortArgs }) {
    currentPage = params.page;
    pageLimit = params.limit;
    currentQuery = { where: params.where, sort: params.sort };
    loadProducts();
  }

  function openCreate() {
    productToEdit = null;
    formData = { sku: "", description: "", gtin: null, mpn: null, ncm: null, default_price: 0, unit_of_measure: "", observations: null };
    productImages = [];
    productImagefiles = [];
    open = true;
  }

  function openEdit(product: ProductWithInventories) {
    productToEdit = product;
    formData = {
      sku: product.sku,
      description: product.description,
      gtin: product.gtin,
      mpn: product.mpn,
      ncm: product.ncm,
      default_price: product.default_price,
      unit_of_measure: product.unit_of_measure,
      observations: product.observations as string | null,
    };
    productImages = product.images;
    productImagefiles = [];
    renderedImages = product.images.map((img) => ({ type: "url", url: img.url, id: img.id, isMain: img.main }));
    open = true;
  }

  async function handleUpdateInventory(warehouseId: string, productId: string) {
    updatingInventory = true;
    try {
      await inventoryRequests.create({
        warehouse_id: warehouseId,
        product_id: productId,
        amount: newAmount,
      });

      toast.success("Estoque atualizado!");
      editingInventoryId = null;

      // Recarrega os produtos para atualizar os números na tabela principal e no Sheet
      await loadProducts();

      // Atualiza o objeto selecionado para o Sheet refletir a mudança imediatamente
      if (selectedProductInventories) {
        selectedProductInventories = products.find((p) => p.id === selectedProductInventories?.id) || null;
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao atualizar estoque");
    } finally {
      updatingInventory = false;
    }
  }

  function startEditing(warehouseId: string, currentAmount: number) {
    editingInventoryId = warehouseId;
    newAmount = currentAmount;
  }

  function confirmDelete(product: Product) {
    productToDelete = product;
    deleteDialogOpen = true;
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    saving = true;

    try {
      let newProduct: Product | undefined;

      if (productToEdit) {
        await productRequests.updateOneById({ id: productToEdit.id, ...formData });
        newProduct = productToEdit;
      } else {
        newProduct = await productRequests.create(formData);
      }

      // Upload de arquivos novos
      const uploadedUrls: string[] = [];
      for (const file of productImagefiles) {
        const url = await uploadImage({ file, bucket: "product-images" });
        uploadedUrls.push(url);
      }

      const hasMainSelected = renderedImages.some((img) => img.isMain);

      // Construir objeto final de imagens para inserir no backend
      const finalImages: ProductImageInsertMany = [
        // imagens já existentes (URL)
        ...renderedImages
          .filter((img) => img.type === "url")
          .map((img) => ({
            id: img.id,
            tenant_id: newProduct.tenant_id,
            product_id: newProduct.id,
            url: img.url,
            main: !!img.isMain,
          })),

        // imagens novas (upload)
        ...uploadedUrls.map((url, index) => ({
          tenant_id: newProduct.tenant_id,
          product_id: newProduct.id,
          url,

          // regra de main
          main: hasMainSelected
            ? false // se já existe main, uploads nunca viram main automaticamente
            : index === 0 && renderedImages.length === 0, // fallback absoluto
        })),
      ];

      if (finalImages.length > 0) await productImageRequests.insertMany(finalImages);

      toast.success("Produto salvo com sucesso!");
      open = false;
      await loadProducts();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao salvar produto");
    } finally {
      saving = false;
    }
  }

  async function handleDelete() {
    if (!productToDelete) return;
    deleting = true;
    try {
      await productRequests.deleteOneById(productToDelete.id);

      deleteDialogOpen = false;

      await loadProducts();

      productToDelete = null;

      toast.success("Produto excluido com sucesso");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao excluir produto");
    } finally {
      deleting = false;
    }
  }

  function onImagesChange(files: File[]) {
    productImagefiles = files;
  }

  onMount(loadProducts);
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <h2 class="text-3xl font-bold tracking-tight">Produtos</h2>
    <Button size="sm" onclick={openCreate}>
      <PackagePlus class="mr-2 h-4 w-4" /> Novo produto
    </Button>
  </div>

  <DataTable {columns} data={products} {loading} onQueryChange={handleQueryChange} page={currentPage} limit={pageLimit} total={totalRecords}>
    {#each products as product}
      <Table.Row>
        <Table.Cell>{product.sku}</Table.Cell>
        <Table.Cell>{product.description}</Table.Cell>
        <Table.Cell>{product.mpn}</Table.Cell>
        <Table.Cell>{product.gtin}</Table.Cell>
        <Table.Cell>{product.ncm}</Table.Cell>
        <Table.Cell>R$ {numericToBrazilianCurrency({ value: product.default_price })}</Table.Cell>
        <Table.Cell>{product.unit_of_measure}</Table.Cell>
        <Table.Cell>
          <div class="flex items-center gap-2">
            <span class="font-medium">{product.total_in_inventories}</span>
            <Button variant="outline" size="icon" class="h-7 w-7" onclick={() => openInventoryDetails(product)} title="Ver distribuição por depósito">
              <Warehouse class="h-3.5 w-3.5" />
            </Button>
          </div>
        </Table.Cell>
        <Table.Cell>{product.observations ?? "-"}</Table.Cell>
        <Table.Cell class="text-right">
          <div class="flex justify-end gap-2">
            <Button variant="ghost" size="icon" onclick={() => openEdit(product)}>
              <Pencil class="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" class="hover:text-destructive" onclick={() => confirmDelete(product)}>
              <Trash2 class="h-4 w-4" />
            </Button>
          </div>
        </Table.Cell>
      </Table.Row>
    {/each}
  </DataTable>
</div>

<Sheet.Root bind:open>
  <Sheet.Content side="right" class="w-[400px] sm:w-[540px] h-screen flex flex-col">
    <Sheet.Header class="shrink-0">
      <Sheet.Title>{productToEdit ? "Editar produto" : "Novo produto"}</Sheet.Title>
      <Sheet.Description>
        {productToEdit ? "Altere as informações do produto selecionado." : "Preencha os dados para cadastrar um novo produto."}
      </Sheet.Description>
    </Sheet.Header>

    <div class="flex-1 overflow-y-auto">
      <form onsubmit={handleSubmit} class="grid gap-4 py-6 px-1">
        <div class="grid gap-2">
          <Label for="description">Descrição</Label>
          <Input id="description" bind:value={formData.description} placeholder="Descrição do produto" required />
        </div>

        <div class="grid gap-2">
          <Label for="sku">SKU</Label>
          <Input id="sku" bind:value={formData.sku} required />
        </div>

        <div class="grid gap-2">
          <Label for="sku">Cód. fabricante</Label>
          <Input id="sku" bind:value={formData.mpn} />
        </div>

        <div class="grid gap-2">
          <Label for="sku">Cód. barras</Label>
          <Input id="sku" bind:value={formData.gtin} />
        </div>

        <div class="grid gap-2">
          <Label for="sku">NCM</Label>
          <Input id="sku" bind:value={formData.ncm} />
        </div>

        <MoneyInput id="price" label="Preço" bind:value={formData.default_price} required />

        <div class="grid gap-2">
          <Label for="price">Unidade</Label>
          <Input id="price" bind:value={formData.unit_of_measure} placeholder="UN, KG, L, CX..." required />
        </div>

        <div class="grid gap-2">
          <Label for="observations">Observações</Label>
          <Input id="observations" bind:value={formData.observations} placeholder="Observações sobre o produto" />
        </div>

        <div class="grid gap-2">
          <Label>Imagens do produto</Label>

          <ProductImagePicker
            images={renderedImages}
            enableMainImage
            onChange={(newImages: ImageItem[]) => {
              renderedImages = newImages;
              // Mantém apenas arquivos locais em productImagefiles para upload
              productImagefiles = newImages.filter((i) => i.type === "file").map((i) => i.file);
            }}
          />
        </div>

        <div class="sticky bottom-0 bg-background pt-4">
          <div class="flex justify-end gap-3">
            <Button variant="outline" type="button" onclick={() => (open = false)}>Cancelar</Button>

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
        </div>
      </form>
    </div>
  </Sheet.Content>
</Sheet.Root>

<Sheet.Root bind:open={inventorySheetOpen}>
  <Sheet.Content side="right" class="w-[400px] sm:w-[540px] h-screen flex flex-col">
    <Sheet.Header class="shrink-0">
      <Sheet.Title>Distribuição em Estoque</Sheet.Title>
      <Sheet.Description>
        Ajuste o saldo do produto <span class="font-bold text-foreground">{selectedProductInventories?.description}</span>.
      </Sheet.Description>
    </Sheet.Header>

    <div class="py-6">
      <div class="rounded-md border">
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.Head>Estoque</Table.Head>
              <Table.Head class="text-right w-[150px]">Qtd</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {#if selectedProductInventories?.inventories && selectedProductInventories.inventories.length > 0}
              {#each selectedProductInventories.inventories as inventory}
                <Table.Row>
                  <Table.Cell class="font-medium">{inventory.warehouse_description}</Table.Cell>
                  <Table.Cell class="text-right py-2">
                    <div class="flex items-center justify-end gap-1">
                      <div class="flex items-center justify-end w-[72px]">
                        {#if editingInventoryId === inventory.warehouse_id}
                          <div class="flex items-center gap-0.5">
                            <Button
                              size="icon"
                              variant="ghost"
                              class="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                              onclick={() => (editingInventoryId = null)}
                              disabled={updatingInventory}
                            >
                              <X class="h-4 w-4" />
                            </Button>

                            <Button
                              size="icon"
                              variant="ghost"
                              class="h-8 w-8 text-primary hover:bg-primary/10"
                              onclick={() => handleUpdateInventory(inventory.warehouse_id, selectedProductInventories!.id)}
                              disabled={updatingInventory}
                            >
                              {#if updatingInventory}
                                <Loader2 class="h-4 w-4 animate-spin" />
                              {:else}
                                <Save class="h-4 w-4" />
                              {/if}
                            </Button>
                          </div>
                        {:else}
                          <Button
                            variant="ghost"
                            size="icon"
                            class="h-8 w-8 text-muted-foreground/60 hover:text-primary hover:bg-primary/10 transition-colors"
                            onclick={() => startEditing(inventory.warehouse_id, inventory.amount)}
                          >
                            <Pencil class="h-3.5 w-3.5" />
                          </Button>
                        {/if}
                      </div>

                      <div class="relative w-20">
                        {#if editingInventoryId === inventory.warehouse_id}
                          <Input
                            type="number"
                            inputmode="numeric"
                            pattern="[0-9]*"
                            bind:value={newAmount}
                            selectOnFocus={true}
                            disabled={updatingInventory}
                            onkeydown={(e) => {
                              if (e.key === "Enter") handleUpdateInventory(inventory.warehouse_id, selectedProductInventories!.id);
                              if (e.key === "Escape") editingInventoryId = null;
                            }}
                            class="h-8 w-full text-right font-mono border-primary/50 bg-background focus-visible:ring-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                        {:else}
                          <Input
                            type="number"
                            value={inventory.amount}
                            readonly
                            class="h-8 w-full text-right font-mono border-transparent bg-transparent shadow-none focus-visible:ring-0 cursor-default [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                        {/if}
                      </div>
                    </div>
                  </Table.Cell>
                </Table.Row>
              {/each}
              <Table.Row class="bg-muted/50 font-bold">
                <Table.Cell>Total Geral</Table.Cell>
                <Table.Cell class="text-right">{selectedProductInventories.total_in_inventories}</Table.Cell>
              </Table.Row>
            {:else}{/if}
          </Table.Body>
        </Table.Root>
      </div>
    </div>
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
      <AlertDialog.Action onclick={handleDelete} class="bg-destructive text-destructive-foreground hover:bg-destructive/90" disabled={deleting}>
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
