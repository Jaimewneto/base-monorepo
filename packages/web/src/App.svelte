<script lang="ts">
  import { onMount } from "svelte";
  import { Route, router } from "tinro";
  import Navbar from "$lib/components/layout/Navbar.svelte";
  import { Toaster } from "$lib/components/ui/sonner";
  import Login from "./routes/Login.svelte";
  import Product from "./routes/Product.svelte";
  import User from "./routes/User.svelte";
  import Warehouse from "./routes/Warehouse.svelte";
  import "./app.css";
  import { authStore } from "$lib/auth/auth.store";

  let hydrated = $state(false);

  onMount(() => {
    authStore.hydrate();
    hydrated = true;
  });

  $effect(() => {
    const path = $router.path;
    const { user } = $authStore;
    if (!hydrated) return;
    if (user && path === "/login") {
      router.goto("/");
      return;
    }
    if (!user && path !== "/login") {
      router.goto("/login");
    }
  });
</script>

{#if hydrated && $authStore.user}
  <div class="min-h-screen bg-surface-50-950 text-surface-950-50">
    <div class="flex flex-col min-h-screen">
      <Navbar />
      <main class="container mx-auto p-6 flex-1">
        <Route path="/users"><User /></Route>
        <Route path="/products"><Product /></Route>
        <Route path="/warehouses"><Warehouse /></Route>
      </main>
    </div>
  </div>
{:else if hydrated}
  <Login />
{:else}
  <div class="flex items-center justify-center min-h-screen">Carregando...</div>
{/if}

<Toaster richColors position="top-right" />
