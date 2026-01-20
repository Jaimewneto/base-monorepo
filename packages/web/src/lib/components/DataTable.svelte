<script lang="ts">
  import * as Table from "$lib/components/ui/table";
  import { Input } from "$lib/components/ui/input";
  import { Button } from "$lib/components/ui/button";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import { ArrowUpDown, Loader2, ChevronLeft, ChevronRight, ChevronDown } from "@lucide/svelte";
  import type { DataTableProps } from "$lib/types/components/DataTable";

  // Props usando Svelte 5
  let {
    columns,
    data,
    loading,
    onQueryChange,
    children,
    page = 1,
    limit = 10,
    total = 0,
  }: DataTableProps<string, string, any, any> & {
    page?: number;
    limit?: number;
    total?: number;
  } = $props();

  // Estados internos
  let filters = $state<Record<string, string>>({});
  let sortField = $state<string | null>(null);
  let sortDirection = $state<"asc" | "desc">("asc");
  const limits = [5, 10, 20, 50, 100];

  // Cálculo derivado do total de páginas
  const totalPages = $derived(Math.ceil(total / limit));

  // Função centralizadora de disparos para a API
  function emitQuery(newPage?: number, newLimit?: number) {
    const conditions = Object.entries(filters)
      .filter(([_, value]) => value !== "" && value !== undefined)
      .map(([field, value]) => {
        const col = columns.find((c) => c.field === field);
        if (!col) return null;

        let finalValue: any = value;

        if (col.valueType === "number") {
          finalValue = Number(value);
          if (isNaN(finalValue)) return null;
        }

        if (col.operator === "ilike") {
          finalValue = `%${value}%`;
        }

        return {
          field: col.field,
          operator: col.operator,
          value: finalValue,
        };
      })
      .filter(Boolean);

    onQueryChange({
      page: newPage ?? 1,
      limit: newLimit ?? limit,
      where: {
        conditions: conditions.length ? (conditions as any) : [],
      },
      sort: sortField ? [{ field: sortField, direction: sortDirection }] : [],
    });
  }

  let timeout: any;

  function handleFilterInput(field: string, value: string) {
    filters[field] = value;
    clearTimeout(timeout);
    timeout = setTimeout(() => emitQuery(1), 500);
  }

  function handleSort(field: string) {
    if (sortField === field) {
      sortDirection = sortDirection === "asc" ? "desc" : "asc";
    } else {
      sortField = field;
      sortDirection = "asc";
    }
    emitQuery(1);
  }

  function changePage(delta: number) {
    const next = page + delta;
    if (next >= 1 && next <= totalPages) {
      emitQuery(next);
    }
  }

  function changeLimit(newLimit: number) {
    emitQuery(1, newLimit);
  }
</script>

<div class="rounded-md border bg-card relative">
  {#if loading}
    <div class="absolute inset-0 bg-background/50 z-10 flex items-center justify-center">
      <Loader2 class="animate-spin h-8 w-8 text-primary" />
    </div>
  {/if}

  <Table.Root>
    <Table.Header>
      <Table.Row>
        {#each columns as col}
          <Table.Head>
            {#if col.sortable}
              <Button
                variant="ghost"
                size="sm"
                class="-ml-3 h-8 data-[active=true]:text-primary font-bold"
                data-active={sortField === col.field}
                onclick={() => handleSort(col.field)}
              >
                {col.label}
                {#if sortField === col.field}
                  <span class="ml-2">{sortDirection === "asc" ? "↑" : "↓"}</span>
                {:else}
                  <ArrowUpDown class="ml-2 h-4 w-4 opacity-50" />
                {/if}
              </Button>
            {:else}
              {col.label}
            {/if}
          </Table.Head>
        {/each}
        <Table.Head class="text-right">Ações</Table.Head>
      </Table.Row>

      <Table.Row class="bg-muted/50 border-t">
        {#each columns as col}
          <Table.Head class="p-2">
            {#if col.filterable}
              <Input
                type={col.valueType === "number" ? "number" : "text"}
                placeholder="Filtrar..."
                class="h-8 text-xs bg-background"
                oninput={(e) => handleFilterInput(col.field, e.currentTarget.value)}
              />
            {/if}
          </Table.Head>
        {/each}
        <Table.Head />
      </Table.Row>
    </Table.Header>

    <Table.Body>
      {#if data.length === 0 && !loading}
        <Table.Row>
          <Table.Cell colspan={columns.length + 1} class="text-center h-24 text-muted-foreground italic">Nenhum registro encontrado.</Table.Cell>
        </Table.Row>
      {:else}
        {@render children()}
      {/if}
    </Table.Body>
  </Table.Root>

  <div class="flex items-center justify-between px-4 py-4 border-t bg-muted/20">
    <div class="flex items-center gap-4">
      <div class="text-xs text-muted-foreground font-medium">
        Total de <span class="text-foreground">{total}</span> registros
      </div>

      <div class="flex items-center gap-2 border-l pl-4">
        <span class="text-xs text-muted-foreground whitespace-nowrap">Linhas por página:</span>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            {#snippet child({ props })}
              <Button {...props} variant="outline" size="sm" class="h-8 gap-1 min-w-[60px]">
                {limit}
                <ChevronDown class="h-3 w-3 opacity-50" />
              </Button>
            {/snippet}
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="start">
            {#each limits as l}
              <DropdownMenu.Item onSelect={() => changeLimit(l)}>
                {l}
              </DropdownMenu.Item>
            {/each}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
    </div>

    <div class="flex items-center gap-6">
      <div class="flex items-center text-xs font-medium whitespace-nowrap">
        Página {page} de {totalPages || 1}
      </div>
      <div class="flex items-center gap-2">
        <Button variant="outline" size="icon" class="h-8 w-8" disabled={page <= 1 || loading} onclick={() => changePage(-1)}>
          <ChevronLeft class="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" class="h-8 w-8" disabled={page >= totalPages || loading} onclick={() => changePage(1)}>
          <ChevronRight class="h-4 w-4" />
        </Button>
      </div>
    </div>
  </div>
</div>
