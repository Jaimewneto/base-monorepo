<script lang="ts">
  import { LogOut, Moon, Sun, Package, Users, Warehouse, Menu } from "@lucide/svelte";
  import { router, active } from "tinro";
  import { Button } from "$lib/components/ui/button";
  import { authStore } from "$lib/stores/auth";
  import * as NavigationMenu from "$lib/components/ui/navigation-menu";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";

  interface Props {
    toggleTheme: () => void;
    isDark: boolean;
  }

  let { toggleTheme, isDark }: Props = $props();

  const handleLogout = () => {
    authStore.clear();
    router.goto("/login");
  };

  const navLinks = [
    { href: "/products", label: "Produtos", icon: Package },
    { href: "/warehouses", label: "Estoques", icon: Warehouse },
    { href: "/users", label: "Usuários", icon: Users },
  ];
</script>

<header class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
  <div class="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
    <div class="flex items-center gap-4 md:gap-8">
      <div class="md:hidden">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            {#snippet child({ props })}
              <Button {...props} variant="ghost" size="icon">
                <Menu class="h-6 w-6" />
              </Button>
            {/snippet}
          </DropdownMenu.Trigger>

          <DropdownMenu.Content align="start" class="w-48">
            {#each navLinks as link}
              <DropdownMenu.Item onSelect={() => router.goto(link.href)}>
                <link.icon class="mr-2 h-4 w-4" />
                {link.label}
              </DropdownMenu.Item>
            {/each}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>

      <a href="/" class="flex items-center gap-2 font-bold text-lg md:text-xl tracking-tighter shrink-0">
        <div class="bg-primary text-primary-foreground p-1 rounded">
          <Package class="h-5 w-5" />
        </div>
        <span class="block truncate max-w-[150px] sm:max-w-none"> Gestão de estoque </span>
      </a>

      <NavigationMenu.Root class="hidden md:flex">
        <NavigationMenu.List class="flex items-center space-x-1">
          {#each navLinks as link}
            <NavigationMenu.Item>
              <a
                href={link.href}
                use:active
                class="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground data-[active]:bg-accent/50 data-[active]:text-primary"
              >
                <link.icon class="mr-2 h-4 w-4" />
                {link.label}
              </a>
            </NavigationMenu.Item>
          {/each}
        </NavigationMenu.List>
      </NavigationMenu.Root>
    </div>

    <div class="flex items-center gap-2 md:gap-4">
      <Button variant="ghost" size="icon" onclick={toggleTheme} class="rounded-full">
        {#if isDark}
          <Sun class="h-5 w-5" />
        {:else}
          <Moon class="h-5 w-5" />
        {/if}
      </Button>

      <div class="flex items-center ml-2 text-primary">
        <Button
          variant="outline"
          size="sm"
          onclick={handleLogout}
          class="gap-2 border-destructive/50 hover:bg-destructive hover:text-destructive-foreground hidden sm:flex"
        >
          <LogOut class="h-4 w-4" /> Sair
        </Button>
        <Button variant="ghost" size="icon" onclick={handleLogout} class="sm:hidden text-destructive">
          <LogOut class="h-5 w-5" />
        </Button>
      </div>
    </div>
  </div>
</header>
