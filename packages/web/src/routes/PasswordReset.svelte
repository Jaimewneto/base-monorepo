<script lang="ts">
    import { meta, router } from "tinro";
    import { Button } from "$lib/components/ui/button";
    import * as Card from "$lib/components/ui/card";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";

    import { authRequests } from "$lib/services/api-requests/auth";

    let email = $state("");
    let password = $state("");
    let passwordConfirm = $state("");
    let loading = $state(false);
    let error = $state("");

    const routeMeta = meta();

    let passwordResetToken = $derived($routeMeta.query.passwordResetToken);

    const handlePasswordReset = async (e: Event) => {
        e.preventDefault();
        loading = true;
        error = "";

        try {
            if (!password || !passwordConfirm) {
                error = "Preencha todos os campos";
                return;
            }

            await authRequests.resetPassword({ passwordResetToken, password });

            router.goto("/login");
        } catch (err) {
            console.error(err);
            error = "Erro ao redefinir senha. Tente novamente.";
        } finally {
            loading = false;
        }
    };
</script>

<div class="flex h-screen w-full items-center justify-center bg-background">
    <Card.Root class="w-full max-w-md">
        <Card.Header>
            <Card.Title class="text-2xl text-center">Redefinir senha</Card.Title>
            <Card.Description class="text-center">
                Digite sua nova senha
            </Card.Description>
        </Card.Header>

        <Card.Content>
            <form onsubmit={handlePasswordReset} class="grid gap-4">
                {#if error}
                    <div
                        class="bg-destructive/15 text-destructive text-sm p-3 rounded-md"
                    >
                        {error}
                    </div>
                {/if}

                <div class="grid gap-2">
                    <Label for="password">Nova senha</Label>
                    <Input
                        id="password"
                        type="password"
                        bind:value={password}
                        disabled={loading}
                        required
                    />
                </div>

                <div class="grid gap-2">
                    <Label for="passwordConfirm">Confirmar senha</Label>
                    <Input
                        id="passwordConfirm"
                        type="password"
                        bind:value={passwordConfirm}
                        disabled={loading}
                        required
                    />
                </div>

                <Button type="submit" class="w-full mt-2" disabled={loading}>
                    {loading ? "Redefinindo senha..." : "Redefinir senha"}
                </Button>
            </form>
        </Card.Content>
    </Card.Root>
</div>
