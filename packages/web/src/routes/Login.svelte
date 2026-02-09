<script lang="ts">
  import { Eye, EyeOff } from "@lucide/svelte";
  import { router } from "tinro";
  import { Button } from "$lib/components/ui/button";
  import * as Card from "$lib/components/ui/card";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";

  import { authStore } from "$lib/auth/auth.store";
  import { authRequests } from "$lib/services/api-requests/auth";

  let email = $state("");
  let password = $state("");

  let forgotPassword = $state(false);
  let resetEmail = $state("");
  let resetLoading = $state(false);
  let resetMessage = $state("");
  let resetStatus = $state<"idle" | "error" | "success">("idle");

  let showPassword = $state(false);

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

      authStore.setCredentials({ credentials, user });
      email = "";
      password = "";

      router.goto("/");
    } catch (err) {
      console.error(err);
      error = err instanceof Error ? err.message : "Erro ao fazer login. Tente novamente.";
    } finally {
      loading = false;
    }
  };

  const handlePasswordReset = async (e: Event) => {
    e.preventDefault();
    resetLoading = true;
    resetMessage = "";
    resetStatus = "idle";

    try {
      if (!resetEmail.trim()) {
        resetMessage = "Informe seu e-mail para continuar.";
        resetStatus = "error";
        return;
      }

      await authRequests.sendPasswordResetLink(resetEmail);

      resetMessage = "Se este e-mail existir, enviaremos um link para redefinir sua senha. Verifique também o spam.";
      resetStatus = "success";
    } catch (err) {
      console.error(err);
      resetMessage = "Erro ao solicitar redefinição de senha.";
      resetStatus = "error";
    } finally {
      resetLoading = false;
    }
  };

  const backToLogin = () => {
    forgotPassword = false;
    resetEmail = "";
    resetMessage = "";
    resetLoading = false;
  };
</script>

<div class="flex h-screen w-full items-center justify-center bg-background">
  <Card.Root class="w-full max-w-md">
    {#if forgotPassword}
      <Card.Header>
        <Card.Title class="text-2xl text-center">Esqueceu sua senha?</Card.Title>
        <Card.Description class="text-center">Informe seu e-mail para receber o link de redefinição</Card.Description>
      </Card.Header>

      <Card.Content>
        <form onsubmit={handlePasswordReset} novalidate class="grid gap-4">
          {#if resetMessage}
            <div
              class="text-sm p-3 rounded-md
              {resetStatus === 'error' ? 'bg-destructive/15 text-destructive' : 'bg-muted'}"
              role="alert"
            >
              {resetMessage}
            </div>
          {/if}

          <div class="grid gap-2">
            <Label for="resetEmail">E-mail</Label>
            <Input
              id="resetEmail"
              type="email"
              bind:value={resetEmail}
              placeholder="admin@empresa.com"
              disabled={resetLoading || resetStatus === "success"}
            />
          </div>

          <Button type="submit" class="w-full" disabled={resetLoading || resetStatus === "success"}>
            {resetLoading ? "Enviando..." : "Enviar link de redefinição"}
          </Button>

          <Button type="button" variant="ghost" class="w-full" onclick={backToLogin}>Voltar para login</Button>
        </form>
      </Card.Content>
    {:else}
      <Card.Header>
        <Card.Title class="text-2xl text-center">Login</Card.Title>
        <Card.Description class="text-center">Entre com suas credenciais</Card.Description>
      </Card.Header>

      <Card.Content>
        <form onsubmit={handleLogin} novalidate class="grid gap-4">
          {#if error}
            <div class="bg-destructive/15 text-destructive text-sm p-3 rounded-md" role="alert">
              {error}
            </div>
          {/if}

          <div class="grid gap-2">
            <Label for="email">E-mail</Label>
            <Input id="email" type="email" bind:value={email} placeholder="admin@empresa.com" disabled={loading} />
          </div>

          <div class="grid gap-2">
            <Label for="password">Senha</Label>
            <div class="relative">
              <Input id="password" type={showPassword ? "text" : "password"} bind:value={password} disabled={loading} class="pr-10" />
              <button
                type="button"
                onclick={() => (showPassword = !showPassword)}
                class="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                disabled={loading}
              >
                {#if showPassword}
                  <EyeOff class="h-4 w-4" />
                {:else}
                  <Eye class="h-4 w-4" />
                {/if}
              </button>
            </div>
          </div>

          <div class="text-right">
            <button type="button" class="text-sm text-muted-foreground hover:underline" onclick={() => (forgotPassword = true)} disabled={loading}>
              Esqueci minha senha
            </button>
          </div>

          <Button type="submit" class="w-full mt-2" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </Card.Content>
    {/if}
  </Card.Root>
</div>
