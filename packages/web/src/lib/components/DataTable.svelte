<script lang="ts">
  import { type Snippet } from "svelte";
  import * as Table from "$lib/components/ui/table";
  import { Input } from "$lib/components/ui/input";
  import { Button } from "$lib/components/ui/button";
  import { ArrowUpDown, Loader2 } from "@lucide/svelte";

  export interface Column {
    label: string;
    field: string;
    operator: "ilike" | "=" | ">" | "<" | ">=" | "<=";
    valueType: "string" | "number" | "date";
    sortable?: boolean;
    filterable?: boolean;
  }

  let { columns, data, loading, onQueryChange, children } = $props<{
    columns: Column[];
    data: any[];
    loading: boolean;
    onQueryChange: (params: { where: any; sort: any }) => void;
    children: Snippet;
  }>();

  let filters = $state<Record<string, string>>({});
  let sortField = $state<string | null>(null);
  let sortDirection = $state<"asc" | "desc">("asc");

  function emitQuery() {
    const conditions = Object.entries(filters)
      .filter(([_, value]) => value !== "" && value !== undefined)
      .map(([field, value]) => {
        // Encontra a configuração da coluna para saber o operador e o tipo
        const col = columns.find((c: Column) => c.field === field);
        if (!col) return null;

        let finalValue: any = value;

        // Tratamento de Tipo (Casting)
        if (col.valueType === "number") {
          finalValue = Number(value);
          if (isNaN(finalValue)) return null; // Aborta se não for número válido
        }

        // Tratamento de Operador (Wildcards)
        if (col.operator === "ilike") {
          finalValue = `%${value}%`;
        }

        return {
          field: col.field,
          operator: col.operator,
          value: finalValue,
        };
      })
      .filter(Boolean); // Remove os nulos

    onQueryChange({
      where: { conditions: conditions.length > 0 ? conditions : [] },
      sort: sortField ? [{ field: sortField, direction: sortDirection }] : [],
    });
  }

  let timeout: any;
  function handleFilterInput(field: string, value: string) {
    filters[field] = value;
    clearTimeout(timeout);
    timeout = setTimeout(emitQuery, 500);
  }

  function handleSort(field: string) {
    if (sortField === field) {
      sortDirection = sortDirection === "asc" ? "desc" : "asc";
    } else {
      sortField = field;
      sortDirection = "asc";
    }
    emitQuery();
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
                  {sortDirection === "asc" ? "↑" : "↓"}
                {:else}
                  <ArrowUpDown class="ml-2 h-4 w-4 opacity-50" />
                {/if}
              </Button>
            {:else}
              {col.label}
            {/if}
          </Table.Head>
        {/each}
        <Table.Head class="-ml-3 h-8 data-[active=true]:text-primary font-bold text-right">Ações</Table.Head>
      </Table.Row>

      <Table.Row class="bg-muted/50 border-t">
        {#each columns as col}
          <Table.Head class="p-2">
            {#if col.filterable}
              <Input
                type={col.valueType === "number" ? "number" : col.valueType === "date" ? "date" : "text"}
                placeholder={col.operator === "ilike" ? "Contém..." : "Igual a..."}
                class="h-8 text-xs bg-background"
                oninput={(e) => handleFilterInput(col.field, e.currentTarget.value)}
              />
            {/if}
          </Table.Head>
        {/each}
        <Table.Head></Table.Head>
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
</div>
