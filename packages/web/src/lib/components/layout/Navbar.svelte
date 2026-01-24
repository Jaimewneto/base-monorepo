<script lang="ts">
  import { LogOut, Moon, Sun, Package, Users, Warehouse, Menu } from "@lucide/svelte";
  import { router, active } from "tinro";
  import { Button } from "$lib/components/ui/button";
  import { authStore } from "$lib/auth/auth.store";
  import * as NavigationMenu from "$lib/components/ui/navigation-menu";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";

  interface Props {
    toggleTheme: () => void;
    isDark: boolean;
  }
  let { toggleTheme, isDark }: Props = $props();
  const navLinks = [
    { href: "/products", label: "Produtos", icon: Package },
    { href: "/warehouses", label: "Estoques", icon: Warehouse },
    { href: "/users", label: "Usuários", icon: Users },
  ] as const;
  async function handleLogout() {
    authStore.logout();
    router.goto("/login");
  }
  function navigate(href: string) {
    router.goto(href);
  }
</script>

<header class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
  <div class="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
    <!-- Left -->
    <div class="flex items-center gap-4 md:gap-8">
      <!-- Mobile menu -->
      <div class="md:hidden">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <Button variant="ghost" size="icon" aria-label="Abrir menu">
              <Menu class="h-6 w-6" />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="start" class="w-48">
            {#each navLinks as link}
              <DropdownMenu.Item onSelect={() => navigate(link.href)} class="flex items-center gap-2">
                <link.icon class="h-4 w-4" />
                {link.label}
              </DropdownMenu.Item>
            {/each}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
      <!-- Logo -->
      <a
        href="/"
        onclick={(e) => {
          e.preventDefault();
          navigate("/");
        }}
        class="flex items-center gap-2 shrink-0 text-lg font-bold tracking-tighter md:text-xl"
      >
        <div class="rounded bg-primary p-1 text-primary-foreground"><Package class="h-5 w-5" /></div>
        <span class="truncate max-w-[150px] sm:max-w-none"> Gestão de estoque </span>
      </a>
      <!-- Desktop nav -->
      <NavigationMenu.Root class="hidden md:flex">
        <NavigationMenu.List class="flex items-center space-x-1">
          {#each navLinks as link}
            <NavigationMenu.Item value={link.href}>
              <a
                href={link.href}
                onclick={(e: MouseEvent) => {
                  e.preventDefault();
                  navigate(link.href);
                }}
                use:active
                class="group inline-flex h-9 items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground data-[active]:bg-accent/50 data-[active]:text-primary"
              >
                <link.icon class="mr-2 h-4 w-4" />
                {link.label}
              </a>
            </NavigationMenu.Item>
          {/each}
        </NavigationMenu.List>
      </NavigationMenu.Root>
    </div>
    <!-- Right -->
    <div class="flex items-center gap-2 md:gap-4">
      <!-- Theme toggle -->
      <Button variant="ghost" size="icon" class="rounded-full" onclick={toggleTheme} aria-label="Alternar tema">
        {#if isDark}
          <Sun class="h-5 w-5" />
        {:else}
          <Moon class="h-5 w-5" />
        {/if}
      </Button>
      <!-- Logout -->
      <Button
        variant="outline"
        size="sm"
        onclick={handleLogout}
        class="hidden gap-2 border-destructive/50 hover:bg-destructive hover:text-destructive-foreground sm:flex"
      >
        <LogOut class="h-4 w-4" /> Sair
      </Button>
      <Button variant="ghost" size="icon" onclick={handleLogout} class="sm:hidden text-destructive" aria-label="Sair">
        <LogOut class="h-5 w-5" />
      </Button>
    </div>
  </div>
</header>
