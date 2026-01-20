<script lang="ts">
  import { type Snippet } from "svelte";
  import * as Table from "$lib/components/ui/table";
  import { Input } from "$lib/components/ui/input";
  import { Button } from "$lib/components/ui/button";
  import { ArrowUpDown, Loader2 } from "@lucide/svelte";

  /**
   * Extrai os campos possíveis do where.conditions
   */
  export type WhereField<T> = T extends { conditions: (infer C)[] }
    ? C extends { field: infer F }
      ? F
      : C extends { conditions: { field: infer F }[] }
        ? F
        : never
    : never;

  /**
   * Coluna tipada pelo campo válido do WHERE
   */
  type BaseColumn = {
    label: string;
    operator: "ilike" | "=" | ">" | "<" | ">=" | "<=";
    valueType: "string" | "number" | "date";
  };

  type ActiveColumn<Field extends string> = BaseColumn & {
    field: Field;
    sortable?: true;
    filterable?: true;
  };

  type PassiveColumn = BaseColumn & {
    field?: string;
    sortable: false;
    filterable: false;
  };

  export type Column<Field extends string> = ActiveColumn<Field> | PassiveColumn;

  /**
   * Props genéricas da DataTable
   */
  type DataTableProps<Field extends string, W, S> = {
    columns: Column<Field>[];
    data: any[];
    loading: boolean;
    onQueryChange: (params: { where: W; sort: S }) => void;
    children: Snippet;
  };

  /**
   * ⚠️ IMPORTANTE:
   * Aqui o componente continua genérico.
   * Quem usa ele é que injeta W e S concretos
   */
  let { columns, data, loading, onQueryChange, children }: DataTableProps<string, any, any> = $props();

  let filters = $state<Record<string, string>>({});
  let sortField = $state<string | null>(null);
  let sortDirection = $state<"asc" | "desc">("asc");

  function emitQuery() {
    const conditions = Object.entries(filters)
      .filter(([_, value]) => value !== "" && value !== undefined)
      .map(([field, value]) => {
        const col = columns.find((c) => c.field === field);
        if (!col) return null;

        let finalValue: any = value;

        // Casting por tipo
        if (col.valueType === "number") {
          finalValue = Number(value);
          if (isNaN(finalValue)) return null;
        }

        // Wildcard para ilike
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
      where: {
        conditions: conditions.length ? conditions : [],
      },
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
        <Table.Head class="text-right">Ações</Table.Head>
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
</div>
