<script lang="ts">
    import { router } from "tinro";
    import { Button } from "$lib/components/ui/button";
    import * as Card from "$lib/components/ui/card";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";

    import { authStore } from "$lib/stores/auth";
    import { authRequests } from "$lib/services/api-requests/auth";

    let email = $state("");
    let password = $state("");
    let loading = $state(false);
    let error = $state("");

    const handleLogin = async (e: Event) => {
        e.preventDefault();
        loading = true;
        error = "";

        try {
            if (!email || !password) {
                error = "Credenciais inválidas";
                return;
            }

            const { user, credentials } = await authRequests.login({ email, password });

            authStore.setAuth({ user, credentials });

            router.goto("/");
        } catch (err) {
            console.error(err);
            error = "Erro ao fazer login. Tente novamente.";
        } finally {
            loading = false;
        }
    };
</script>

<div class="flex h-screen w-full items-center justify-center bg-background">
    <Card.Root class="w-full max-w-md">
        <Card.Header>
            <Card.Title class="text-2xl text-center">Login</Card.Title>
            <Card.Description class="text-center">
                Entre com suas credenciais
            </Card.Description>
        </Card.Header>

        <Card.Content>
            <form onsubmit={handleLogin} class="grid gap-4">
                {#if error}
                    <div
                        class="bg-destructive/15 text-destructive text-sm p-3 rounded-md"
                    >
                        {error}
                    </div>
                {/if}

                <div class="grid gap-2">
                    <Label for="email">E-mail</Label>
                    <Input
                        id="email"
                        type="email"
                        bind:value={email}
                        placeholder="admin@empresa.com"
                        disabled={loading}
                        required
                    />
                </div>

                <div class="grid gap-2">
                    <Label for="password">Senha</Label>
                    <Input
                        id="password"
                        type="password"
                        bind:value={password}
                        disabled={loading}
                        required
                    />
                </div>

                <Button type="submit" class="w-full mt-2" disabled={loading}>
                    {loading ? "Entrando..." : "Entrar"}
                </Button>
            </form>
        </Card.Content>
    </Card.Root>
</div>
