<script lang="ts">
  import { onMount } from "svelte";
  import { Route, router } from "tinro";

  import Navbar from "$lib/components/layout/Navbar.svelte";
  import { Toaster } from "$lib/components/ui/sonner";
  import Login from "./routes/Login.svelte";
  import PasswordReset from "./routes/PasswordReset.svelte";
  import Product from "./routes/Product.svelte";
  import User from "./routes/User.svelte";
  import Warehouse from "./routes/Warehouse.svelte";

  import "./app.css";
  import { authStore } from "$lib/auth/auth.store";

  let isDark = $state(true);
  let hydrated = $state(false);

  onMount(() => {
    authStore.hydrate();
    hydrated = true;
  });

  $effect(() => {
    const path = $router.path;
  
    const { user } = $authStore;

    if (!hydrated) return;

    if (user && (path === "/login" || path === "/password-reset")) {
      router.goto("/");
      return;
    }

    if (!user && (path !== "/login" && path !== "/password-reset")) {
      router.goto("/login");
    }
  });

  $effect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  });

  const toggleTheme = () => {
    isDark = !isDark;
  };
</script>

{#if hydrated && $authStore.user}
  <div class="min-h-screen bg-background text-foreground">
    <div class="flex flex-col min-h-screen">
      <Navbar {toggleTheme} {isDark} />
      <main class="container mx-auto p-6 flex-1">
        <Route path="/users"><User /></Route>
        <Route path="/products"><Product /></Route>
        <Route path="/warehouses"><Warehouse /></Route>
      </main>
    </div>
  </div>
{:else if hydrated}
  <Route path="/password-reset"><PasswordReset /></Route>
  <Route fallback><Login /></Route>
{:else}
  <div class="flex items-center justify-center min-h-screen">Carregando...</div>
{/if}

<Toaster richColors position="top-right" />
