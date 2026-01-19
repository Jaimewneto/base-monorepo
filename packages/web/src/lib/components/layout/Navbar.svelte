<script lang="ts">
    import { LogOut, Moon, Sun } from "@lucide/svelte";
    import { router } from "tinro";
    import { Button } from "$lib/components/ui/button";
    import { auth } from "$lib/stores/auth";

    interface Props {
        toggleTheme: () => void;
        isDark: boolean;
    }

    const { toggleTheme, isDark }: Props = $props();

    const handleLogout = () => {
        auth.clear();
        router.goto("/login");
    };
</script>

<nav class="border-b">
    <div class="container mx-auto px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-6">
            <a href="/" class="text-xl font-bold">MeuApp</a>
            <div class="flex gap-4">
                <a href="/" class="hover:underline">Home</a>
                <a href="/users" class="hover:underline">Usuários</a>
                <a href="/products" class="hover:underline">Produtos</a>
            </div>
        </div>

        <div class="flex items-center gap-2">
            <Button variant="ghost" size="icon" onclick={toggleTheme}>
                {#if isDark}
                    <Sun class="h-5 w-5" />
                {:else}
                    <Moon class="h-5 w-5" />
                {/if}
            </Button>

            <Button variant="ghost" size="icon" onclick={handleLogout}>
                <LogOut class="h-5 w-5" />
            </Button>
        </div>
    </div>
</nav>
