<script lang="ts">
  import { onMount } from "svelte";
  import { toast } from "svelte-sonner";
  import { Loader2, UserPlus, Pencil, Save, X } from "@lucide/svelte";
  import { Dialog, Portal } from "@skeletonlabs/skeleton-svelte";

  import DataTable from "$lib/components/DataTable.svelte";

  import { userRequests } from "$lib/services/api-requests/user";

  import type { User } from "$lib/types/api-returns/user";
  import type { Column, WhereField, SortField } from "$lib/types/components/DataTable";
  import type { UserFindManyWhereArgs, UserFindManySortArgs } from "$lib/types/findManyArgs";

  let dialogOpen = $state(false);

  let totalRecords = $state(0);
  let currentPage = $state(1);
  let pageLimit = $state(10);
  let users = $state<User[]>([]);
  let loading = $state(true);

  const columns = [
    {
      label: "Nome",
      field: "user.name",
      operator: "ilike",
      valueType: "string",
      sortable: true,
      filterable: true,
    },
    {
      label: "Email",
      field: "user.email",
      operator: "ilike",
      valueType: "string",
      sortable: true,
      filterable: true,
    },
  ] satisfies Column<WhereField<NonNullable<UserFindManyWhereArgs>>, SortField<UserFindManySortArgs>>[];

  let currentQuery = $state({
    where: { conditions: [] } as UserFindManyWhereArgs,
    sort: [{ field: "user.name", direction: "asc" }] as UserFindManySortArgs,
  });

  async function loadUsers() {
    loading = true;
    try {
      const { data, meta } = await userRequests.findMany({
        page: currentPage,
        limit: pageLimit,
        where: currentQuery.where,
        sort: currentQuery.sort,
      });
      users = data;
      totalRecords = meta.total_registers ?? 0;
    } catch (err) {
      toast.error("Erro ao carregar usuários");
    } finally {
      loading = false;
    }
  }

  function handleQueryChange(params: { page: number; limit: number; where: UserFindManyWhereArgs; sort: UserFindManySortArgs }) {
    currentPage = params.page;
    pageLimit = params.limit;
    currentQuery = { where: params.where, sort: params.sort };
    loadUsers();
  }

  let saving = $state(false);
  let userToEdit = $state<User | null>(null);

  let formData = $state({
    name: "",
    email: "",
    password: "",
  });

  function openCreate() {
    userToEdit = null;
    formData = { name: "", email: "", password: "" };
    dialogOpen = true;
  }

  function openEdit(user: User) {
    userToEdit = user;
    formData = { name: user.name, email: user.email, password: "" };
    dialogOpen = true;
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    saving = true;
    try {
      if (userToEdit) {
        await userRequests.updateOneById({
          id: userToEdit.id,
          name: formData.name,
        });
      } else {
        await userRequests.create(formData);
      }
      dialogOpen = false;
      await loadUsers();
      toast.success("Usuário salvo com sucesso");
    } catch (err) {
      toast.error("Erro ao salvar usuário");
    } finally {
      saving = false;
    }
  }

  onMount(loadUsers);
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <h2 class="text-3xl font-bold tracking-tight">Usuários</h2>
    <button type="button" class="btn preset-filled-primary-500" onclick={openCreate}>
      <UserPlus class="mr-2 h-4 w-4" />
      <span>Novo usuário</span>
    </button>
  </div>

  <DataTable {columns} data={users} {loading} onQueryChange={handleQueryChange} page={currentPage} limit={pageLimit} total={totalRecords}>
    {#snippet children()}
      {#each users as user}
        <tr class="hover:bg-primary-500/5 transition-colors">
          <td class="!align-middle">{user.name}</td>
          <td class="!align-middle">{user.email}</td>
          <td class="text-right !align-middle">
            <div class="flex justify-end gap-2">
              <button
                type="button"
                class="btn-icon btn-icon-sm preset-tonal-surface-500 hover:preset-filled-primary-500"
                onclick={() => openEdit(user)}
              >
                <Pencil class="size-4" />
              </button>
            </div>
          </td>
        </tr>
      {/each}
    {/snippet}
  </DataTable>
</div>

<!-- Dialog Form -->
<Dialog open={dialogOpen} onOpenChange={(e) => (dialogOpen = e.open)}>
  <Portal>
    <Dialog.Backdrop class="fixed inset-0 z-50 bg-surface-50-950/50" />
    <Dialog.Positioner class="fixed inset-0 z-50 flex justify-end items-start">
      <Dialog.Content class="bg-surface-100-900 w-full sm:w-[540px] h-full p-6 space-y-6 shadow-xl overflow-y-auto">
        <header class="space-y-2">
          <Dialog.Title class="h3">{userToEdit ? "Editar usuário" : "Novo usuário"}</Dialog.Title>
          <Dialog.Description class="text-surface-600-300">
            {userToEdit ? "Altere as informações do usuário selecionado." : "Preencha os dados para cadastrar um novo usuário."}
          </Dialog.Description>
        </header>

        <form onsubmit={handleSubmit} class="space-y-4">
          <label class="label">
            <span class="label-text">Nome</span>
            <input class="input" type="text" bind:value={formData.name} required placeholder="Nome do usuário" />
          </label>

          <label class="label">
            <span class="label-text">Email</span>
            <input class="input" type="email" bind:value={formData.email} disabled={!!userToEdit} required placeholder="email@exemplo.com" />
          </label>

          {#if !userToEdit}
            <label class="label">
              <span class="label-text">Senha inicial</span>
              <input class="input" type="password" bind:value={formData.password} required placeholder="••••••••" />
            </label>
          {/if}

          <div class="flex justify-end gap-3 pt-4">
            <button type="button" class="btn preset-outlined-surface-500" onclick={() => (dialogOpen = false)}> Cancelar </button>
            <button type="submit" class="btn preset-filled-primary-500" disabled={saving}>
              {#if saving}
                <Loader2 class="mr-2 h-4 w-4 animate-spin" />
                <span>Salvando...</span>
              {:else}
                <Save class="mr-2 h-4 w-4" />
                <span>Salvar</span>
              {/if}
            </button>
          </div>
        </form>
      </Dialog.Content>
    </Dialog.Positioner>
  </Portal>
</Dialog>
