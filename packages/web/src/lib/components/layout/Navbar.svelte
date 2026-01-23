<script lang="ts">
  import { LogOut, Moon, Sun, Package, Users, Warehouse, Menu } from "@lucide/svelte";
  import { router, active } from "tinro";
  import { Menu as MenuComponent, Portal } from "@skeletonlabs/skeleton-svelte";
  import { authStore } from "$lib/auth/auth.store";

  const handleLogout = () => {
    authStore.logout();
    router.goto("/login");
  };

  const navLinks = [
    { href: "/products", label: "Produtos", icon: Package },
    { href: "/warehouses", label: "Estoques", icon: Warehouse },
    { href: "/users", label: "Usuários", icon: Users },
  ];

  // Dark mode toggle usando color-scheme
  let isDark = $state(false);

  $effect(() => {
    const mode = localStorage.getItem("mode") || "light";
    isDark = mode === "dark";
    document.documentElement.style.colorScheme = mode;
  });

  const toggleTheme = () => {
    isDark = !isDark;
    const mode = isDark ? "dark" : "light";
    document.documentElement.style.colorScheme = mode;
    localStorage.setItem("mode", mode);
  };
</script>

<svelte:head>
  <script>
    const mode = localStorage.getItem("mode") || "light";
    document.documentElement.style.colorScheme = mode;
  </script>
</svelte:head>

<header class="sticky top-0 z-50 w-full border-b border-surface-200-800 bg-surface-50-950/95 backdrop-blur">
  <div class="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
    <div class="flex items-center gap-4 md:gap-8">
      <!-- Mobile Menu -->
      <div class="md:hidden">
        <MenuComponent positioning={{ placement: "bottom-start" }}>
          <MenuComponent.Trigger class="btn-icon btn-icon-sm preset-tonal-surface-500">
            <Menu class="h-6 w-6" />
          </MenuComponent.Trigger>
          <Portal>
            <MenuComponent.Content class="card preset-outlined-surface-500 p-2 w-48 shadow-xl">
              {#each navLinks as link}
                <MenuComponent.Item
                  value={link.href}
                  class="flex items-center gap-2 px-4 py-2 rounded hover:preset-filled-surface-500 cursor-pointer"
                  onclick={() => router.goto(link.href)}
                >
                  <link.icon class="h-4 w-4" />
                  <span>{link.label}</span>
                </MenuComponent.Item>
              {/each}
            </MenuComponent.Content>
          </Portal>
        </MenuComponent>
      </div>

      <!-- Logo -->
      <a href="/" class="flex items-center gap-2 font-bold text-lg md:text-xl tracking-tighter shrink-0">
        <div class="preset-filled-primary-500 p-1 rounded">
          <Package class="h-5 w-5" />
        </div>
        <span class="block truncate max-w-[150px] sm:max-w-none">Gestão de estoque</span>
      </a>

      <!-- Desktop Navigation -->
      <nav class="hidden md:flex items-center space-x-1">
        {#each navLinks as link}
          <a
            href={link.href}
            use:active
            class="group inline-flex h-9 w-max items-center justify-center gap-2 rounded-md bg-surface-50-950 px-4 py-2 text-sm font-medium transition-colors hover:preset-tonal-surface-500 data-[active]:preset-filled-surface-500"
          >
            <link.icon class="h-4 w-4" />
            <span>{link.label}</span>
          </a>
        {/each}
      </nav>
    </div>

    <!-- Right side actions -->
    <div class="flex items-center gap-2 md:gap-4">
      <!-- Theme Toggle -->
      <button type="button" class="btn-icon btn-icon-sm preset-tonal-surface-500 rounded-full" onclick={toggleTheme} aria-label="Alternar tema">
        {#if isDark}
          <Sun class="h-5 w-5" />
        {:else}
          <Moon class="h-5 w-5" />
        {/if}
      </button>

      <!-- Logout Button -->
      <div class="flex items-center ml-2">
        <!-- Desktop Logout -->
        <button type="button" class="btn preset-outlined-error-500 btn-sm gap-2 hidden sm:flex" onclick={handleLogout}>
          <LogOut class="h-4 w-4" />
          <span>Sair</span>
        </button>

        <!-- Mobile Logout -->
        <button type="button" class="btn-icon btn-icon-sm preset-tonal-error-500 sm:hidden" onclick={handleLogout} aria-label="Sair">
          <LogOut class="h-5 w-5" />
        </button>
      </div>
    </div>
  </div>
</header>
