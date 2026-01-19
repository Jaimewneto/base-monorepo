<script lang="ts">
import { Button } from "$lib/components/ui/button";
import * as Table from "$lib/components/ui/table";

// Exemplo de dados que viriam da sua API
const users = $state([
    { id: 1, name: "Teclado Mecânico", stock: 15, price: "R$ 350,00" },
    { id: 2, name: "Monitor 4K", stock: 5, price: "R$ 2.100,00" },
]);
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <h2 class="text-3xl font-bold tracking-tight">Usuários</h2>
    <Button size="sm">Novo Usuário</Button>
  </div>

  <div class="rounded-md border bg-card">
    <Table.Root>
      <Table.Header>
        <Table.Row>
          <Table.Head>Nome</Table.Head>
          <Table.Head>Email</Table.Head>
          <Table.Head>Cadastro</Table.Head>
          <Table.Head>Última tualização</Table.Head>
          <Table.Head class="text-right pr-5">Ações</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {#each users as user}
          <Table.Row>
            <Table.Cell class="font-medium">{user.name}</Table.Cell>
            <Table.Cell>{user.stock}</Table.Cell>
            <Table.Cell>{user.price}</Table.Cell>
            <Table.Cell>{user.price}</Table.Cell>
            <Table.Cell class="text-right">
              <Button variant="ghost" size="sm">Editar</Button>
            </Table.Cell>
          </Table.Row>
        {/each}
      </Table.Body>
    </Table.Root>
  </div>
</div>
