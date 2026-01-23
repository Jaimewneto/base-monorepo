<script lang="ts">
  import { ArrowUpDown, Loader2, ChevronLeft, ChevronRight } from "@lucide/svelte";
  import type { DataTableProps } from "$lib/types/components/DataTable";

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

  let filters = $state<Record<string, string>>({});
  let sortField = $state<string | null>(null);
  let sortDirection = $state<"asc" | "desc">("asc");
  const limits = [5, 10, 20, 50, 100];
  const totalPages = $derived(Math.ceil(total / limit));

  function emitQuery(newPage?: number, newLimit?: number) {
    const conditions = Object.entries(filters)
      .filter(([_, v]) => v !== "")
      .map(([field, value]) => {
        const col = columns.find((c) => c.field === field);
        if (!col) return null;
        let finalValue: any = value;
        if (col.valueType === "number") finalValue = Number(value);
        if (col.operator === "ilike") finalValue = `%${value}%`;
        return { field: col.field, operator: col.operator, value: finalValue };
      })
      .filter(Boolean);

    onQueryChange({
      page: newPage ?? 1,
      limit: newLimit ?? limit,
      where: { conditions: conditions as any },
      sort: sortField ? [{ field: sortField, direction: sortDirection }] : [],
    });
  }

  let timeout: any;
  function handleFilter(field: string, value: string) {
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
</script>

<div class="card overflow-hidden border border-surface-500/20 bg-surface-50-950 shadow-sm relative">
  {#if loading}
    <div class="absolute inset-0 z-10 flex items-center justify-center bg-surface-50/30 dark:bg-surface-950/30 backdrop-blur-[2px] transition-all">
      <Loader2 class="animate-spin size-8 text-primary-500" />
    </div>
  {/if}

  <div class="table-container">
    <table class="table table-hover table-compact w-full table-fixed overflow-hidden">
      <thead class="bg-surface-100-899 border-b border-surface-500/20">
        <tr>
          {#each columns as col}
            <th class="!py-4">
              {#if col.sortable}
                <button
                  class="flex items-center gap-2 font-bold text-xs uppercase tracking-wider hover:text-primary-500 transition-colors"
                  onclick={() => handleSort(col.field)}
                >
                  {col.label}
                  {#if sortField === col.field}
                    <span class="text-primary-500">{sortDirection === "asc" ? "↑" : "↓"}</span>
                  {:else}
                    <ArrowUpDown class="size-3 opacity-30" />
                  {/if}
                </button>
              {:else}
                <span class="text-xs uppercase tracking-wider opacity-60 font-bold">{col.label}</span>
              {/if}
            </th>
          {/each}
          <th class="text-right text-xs uppercase tracking-wider opacity-60 font-bold">Ações</th>
        </tr>

        <tr class="bg-surface-200/50 dark:bg-surface-800/50">
          {#each columns as col}
            <td class="p-2">
              {#if col.filterable}
                <input
                  type="text"
                  placeholder="Filtrar..."
                  class="input input-sm border-transparent bg-surface-50-950/50 focus:preset-outlined-primary-500 transition-all"
                  oninput={(e) => handleFilter(col.field, e.currentTarget.value)}
                />
              {/if}
            </td>
          {/each}
          <td></td>
        </tr>
      </thead>

      <tbody class="divide-y divide-surface-500/10">
        {#if data.length === 0 && !loading}
          <tr>
            <td colspan={columns.length + 1} class="text-center py-12 text-surface-500 italic"> Nenhum registro encontrado. </td>
          </tr>
        {:else}
          {@render children()}
        {/if}
      </tbody>
    </table>
  </div>

  <footer class="p-4 border-t border-surface-500/20 bg-surface-50-950 flex flex-col sm:flex-row justify-between items-center gap-4">
    <div class="flex items-center gap-4 text-sm">
      <p class="opacity-70">Total de <span class="text-surface-900 dark:text-surface-50 font-bold">{total}</span> registros</p>

      <div class="flex items-center gap-2">
        <span class="opacity-70">Ver:</span>
        <select class="select select-sm py-1 w-20" value={limit} onchange={(e) => emitQuery(1, Number(e.currentTarget.value))}>
          {#each limits as l}
            <option value={l}>{l}</option>
          {/each}
        </select>
      </div>
    </div>

    <div class="flex items-center gap-4">
      <span class="text-xs font-medium opacity-70">Pág. {page} / {totalPages || 1}</span>
      <div class="flex border border-surface-500/20 rounded-lg overflow-hidden">
        <button
          class="p-2 hover:bg-primary-500/10 disabled:opacity-30 transition-colors border-r border-surface-500/20"
          disabled={page <= 1 || loading}
          onclick={() => emitQuery(page - 1)}
        >
          <ChevronLeft class="size-4" />
        </button>
        <button
          class="p-2 hover:bg-primary-500/10 disabled:opacity-30 transition-colors"
          disabled={page >= totalPages || loading}
          onclick={() => emitQuery(page + 1)}
        >
          <ChevronRight class="size-4" />
        </button>
      </div>
    </div>
  </footer>
</div>
