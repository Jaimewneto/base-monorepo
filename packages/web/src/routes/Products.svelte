<script lang="ts">
import { Button } from "$lib/components/ui/button";
import * as Table from "$lib/components/ui/table";

// Exemplo de dados que viriam da sua API
const products = $state([
    { id: 1, name: "Teclado Mecânico", stock: 15, price: "R$ 350,00" },
    { id: 2, name: "Monitor 4K", stock: 5, price: "R$ 2.100,00" },
]);
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <h2 class="text-3xl font-bold tracking-tight">Produtos</h2>
    <Button size="sm">Novo Produto</Button>
  </div>

  <div class="rounded-md border bg-card">
    <Table.Root>
      <Table.Header>
        <Table.Row>
          <Table.Head>Nome</Table.Head>
          <Table.Head>Estoque</Table.Head>
          <Table.Head>Preço</Table.Head>
          <Table.Head class="text-right pr-5">Ações</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {#each products as product}
          <Table.Row>
            <Table.Cell class="font-medium">{product.name}</Table.Cell>
            <Table.Cell>{product.stock}</Table.Cell>
            <Table.Cell>{product.price}</Table.Cell>
            <Table.Cell class="text-right">
              <Button variant="ghost" size="sm">Editar</Button>
            </Table.Cell>
          </Table.Row>
        {/each}
      </Table.Body>
    </Table.Root>
  </div>
</div>
