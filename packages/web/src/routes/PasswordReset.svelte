<script lang="ts">
  import { Eye, EyeOff } from "@lucide/svelte";
  import { meta, router } from "tinro";
  import { Button } from "$lib/components/ui/button";
  import * as Card from "$lib/components/ui/card";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { authRequests } from "$lib/services/api-requests/auth";

  let password = $state("");
  let passwordConfirm = $state("");
  let showPassword = $state(false);
  let showPasswordConfirm = $state(false);
  let loading = $state(false);
  let error = $state("");

  const routeMeta = meta();
  let passwordResetToken = $derived($routeMeta.query.passwordResetToken);

  // Validação em tempo real
  let passwordsMatch = $derived(password && passwordConfirm && password === passwordConfirm);
  let passwordTooShort = $derived(password.length > 0 && password.length < 8);

  const handlePasswordReset = async (e: Event) => {
    e.preventDefault();
    loading = true;
    error = "";

    try {
      if (!password || !passwordConfirm) {
        error = "Preencha todos os campos";
        return;
      }

      if (password.length < 8) {
        error = "A senha deve ter no mínimo 8 caracteres";
        return;
      }

      if (password !== passwordConfirm) {
        error = "As senhas não coincidem";
        return;
      }

      if (!passwordResetToken) {
        error = "Token de redefinição inválido";
        return;
      }

      await authRequests.resetPassword({ passwordResetToken, password });

      // Feedback de sucesso antes de redirecionar
      password = "";
      passwordConfirm = "";

      router.goto("/login");
    } catch (err) {
      console.error(err);
      error = err instanceof Error ? err.message : "Erro ao redefinir senha. Tente novamente.";
    } finally {
      loading = false;
    }
  };
</script>

<div class="flex h-screen w-full items-center justify-center bg-background">
  <Card.Root class="w-full max-w-md">
    <Card.Header>
      <Card.Title class="text-2xl text-center">Redefinir senha</Card.Title>
      <Card.Description class="text-center">Digite sua nova senha</Card.Description>
    </Card.Header>

    <Card.Content>
      <form onsubmit={handlePasswordReset} novalidate class="grid gap-4">
        {#if error}
          <div class="bg-destructive/15 text-destructive text-sm p-3 rounded-md" role="alert">
            {error}
          </div>
        {/if}

        <div class="grid gap-2">
          <Label for="password">Nova senha</Label>
          <div class="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              bind:value={password}
              disabled={loading}
              class="pr-10"
              autocomplete="new-password"
              placeholder="Mínimo 8 caracteres"
            />
            <button
              type="button"
              onclick={() => (showPassword = !showPassword)}
              class="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              disabled={loading}
              tabindex="-1"
            >
              {#if showPassword}
                <EyeOff class="h-4 w-4" />
              {:else}
                <Eye class="h-4 w-4" />
              {/if}
            </button>
          </div>
          {#if passwordTooShort}
            <p class="text-xs text-muted-foreground">A senha deve ter no mínimo 8 caracteres</p>
          {/if}
        </div>

        <div class="grid gap-2">
          <Label for="passwordConfirm">Confirmar nova senha</Label>
          <div class="relative">
            <Input
              id="passwordConfirm"
              type={showPasswordConfirm ? "text" : "password"}
              bind:value={passwordConfirm}
              disabled={loading}
              class="pr-10"
              autocomplete="new-password"
            />
            <button
              type="button"
              onclick={() => (showPasswordConfirm = !showPasswordConfirm)}
              class="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPasswordConfirm ? "Ocultar senha" : "Mostrar senha"}
              disabled={loading}
              tabindex="-1"
            >
              {#if showPasswordConfirm}
                <EyeOff class="h-4 w-4" />
              {:else}
                <Eye class="h-4 w-4" />
              {/if}
            </button>
          </div>
          {#if passwordConfirm && !passwordsMatch}
            <p class="text-xs text-destructive">As senhas não coincidem</p>
          {:else if passwordConfirm && passwordsMatch}
            <p class="text-xs text-green-600">As senhas coincidem ✓</p>
          {/if}
        </div>

        <Button type="submit" class="w-full mt-2" disabled={loading || !passwordsMatch || passwordTooShort}>
          {loading ? "Redefinindo senha..." : "Redefinir senha"}
        </Button>

        <Button type="button" variant="ghost" class="w-full" onclick={() => router.goto("/login")} disabled={loading}>Voltar para login</Button>
      </form>
    </Card.Content>
  </Card.Root>
</div>
