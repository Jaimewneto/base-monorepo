<script lang="ts">
  import { onMount } from "svelte";
  import { Button } from "$lib/components/ui/button";
  import * as Table from "$lib/components/ui/table";
  import * as Sheet from "$lib/components/ui/sheet";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { userRequests } from "$lib/services/api-requests/user";
  import { Loader2, UserPlus, Pencil, Save } from "@lucide/svelte";
  import type { User } from "$lib/types/api-returns/user";

  // Estados da Lista
  let users = $state<User[]>([]);
  let loading = $state(true);

  // Estados do Formulário (Modal)
  let open = $state(false);
  let saving = $state(false);
  let userToEdit = $state<User | null>(null); // Se null, é criação. Se tem objeto, é edição.

  // Campos do Form
  let formData = $state({ name: "", email: "", password: "" });

  async function loadUsers() {
    loading = true;
    try {
      const { data } = await userRequests.findMany({ page: 1, limit: 100 });
      users = data;
    } finally {
      loading = false;
    }
  }

  function openCreate() {
    userToEdit = null;
    formData = { name: "", email: "", password: "" };
    open = true;
  }

  function openEdit(user: User) {
    userToEdit = user;
    formData = { name: user.name, email: user.email, password: "" }; // Senha vazia na edição
    open = true;
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    saving = true;
    try {
      if (userToEdit) {
        // Modo Edição
        await userRequests.updateOneById({ id: userToEdit.id, name: formData.name });
      } else {
        // Modo Criação
        await userRequests.create(formData);
      }
      open = false;
      await loadUsers(); // Recarrega a lista
    } catch (err) {
      alert("Erro ao salvar usuário");
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
      <UserPlus class="mr-2 h-4 w-4" /> Novo Usuário
    </Button>
  </div>

  <div class="rounded-md border bg-card">
    <Table.Root>
      <Table.Header>
        <Table.Row>
          <Table.Head>Nome</Table.Head>
          <Table.Head>Email</Table.Head>
          <Table.Head class="text-right">Ações</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {#each users as user}
          <Table.Row>
            <Table.Cell>{user.name}</Table.Cell>
            <Table.Cell>{user.email}</Table.Cell>
            <Table.Cell class="text-right">
              <Button variant="ghost" size="icon" onclick={() => openEdit(user)}>
                <Pencil class="h-4 w-4" />
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
      <Sheet.Title>{userToEdit ? "Editar Usuário" : "Novo Usuário"}</Sheet.Title>
      <Sheet.Description>
        {userToEdit ? "Altere as informações do usuário selecionado." : "Preencha os dados para cadastrar um novo usuário."}
      </Sheet.Description>
    </Sheet.Header>

    <form onsubmit={handleSubmit} class="grid gap-4 py-6">
      <div class="grid gap-2">
        <Label for="name">Nome Completo</Label>
        <Input id="name" bind:value={formData.name} placeholder="Ex: João Silva" required />
      </div>

      <div class="grid gap-2">
        <Label for="email">E-mail</Label>
        <Input id="email" type="email" bind:value={formData.email} disabled={!!userToEdit} placeholder="joao@empresa.com" required />
      </div>

      {#if !userToEdit}
        <div class="grid gap-2">
          <Label for="password">Senha Inicial</Label>
          <Input id="password" type="password" bind:value={formData.password} required />
        </div>
      {/if}

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
