<script lang="ts">
  import { onMount } from "svelte";
  import { toast } from "svelte-sonner";
  import { Loader2, UserPlus, Pencil, Save, Trash2 } from "@lucide/svelte";

  import { Button } from "$lib/components/ui/button";
  import * as Table from "$lib/components/ui/table";
  import * as Sheet from "$lib/components/ui/sheet";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import DataTable from "$lib/components/DataTable.svelte";

  import { userRequests } from "$lib/services/api-requests/user";

  import type { User } from "$lib/types/api-returns/user";
  import type { Column, WhereField, SortField } from "$lib/types/components/DataTable";
  import type { UserFindManyWhereArgs, UserFindManySortArgs } from "$lib/types/findManyArgs";

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

  let open = $state(false);
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
    open = true;
  }

  function openEdit(user: User) {
    userToEdit = user;
    formData = { name: user.name, email: user.email, password: "" };
    open = true;
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
      open = false;
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
    <Button size="sm" onclick={openCreate}>
      <UserPlus class="mr-2 h-4 w-4" /> Novo usuário
    </Button>
  </div>

  <DataTable {columns} data={users} {loading} onQueryChange={handleQueryChange} page={currentPage} limit={pageLimit} total={totalRecords}>
    {#each users as user}
      <Table.Row>
        <Table.Cell>{user.name}</Table.Cell>
        <Table.Cell>{user.email}</Table.Cell>
        <Table.Cell class="text-right">
          <div class="flex justify-end gap-2">
            <Button variant="ghost" size="icon" onclick={() => openEdit(user)}>
              <Pencil class="h-4 w-4" />
            </Button>
          </div>
        </Table.Cell>
      </Table.Row>
    {/each}
  </DataTable>
</div>

<!-- Sheet -->
<Sheet.Root bind:open>
  <Sheet.Content side="right" class="w-[400px] sm:w-[540px]">
    <Sheet.Header>
      <Sheet.Title>{userToEdit ? "Editar usuário" : "Novo usuário"}</Sheet.Title>
      <Sheet.Description>
        {userToEdit ? "Altere as informações do usuário selecionado." : "Preencha os dados para cadastrar um novo usuário."}
      </Sheet.Description>
    </Sheet.Header>

    <form onsubmit={handleSubmit} class="grid gap-4 py-6">
      <div class="grid gap-2">
        <Label for="name">Nome</Label>
        <Input id="name" bind:value={formData.name} required />
      </div>

      <div class="grid gap-2">
        <Label for="email">Email</Label>
        <Input id="email" type="email" bind:value={formData.email} disabled={!!userToEdit} required />
      </div>

      {#if !userToEdit}
        <div class="grid gap-2">
          <Label for="password">Senha inicial</Label>
          <Input id="password" type="password" bind:value={formData.password} required />
        </div>
      {/if}

      <div class="flex justify-end gap-3 mt-4">
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
    </form>
  </Sheet.Content>
</Sheet.Root>
