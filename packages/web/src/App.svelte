<script lang="ts">
    // import { onMount } from "svelte";
    import { Route, router } from "tinro";
    import Navbar from "$lib/components/layout/Navbar.svelte";
    import { auth } from "$lib/stores/auth";
    import Home from "./routes/Home.svelte";
    import Login from "./routes/Login.svelte";
    import Products from "./routes/Products.svelte";
    import Users from "./routes/Users.svelte";
    import "./app.css";

    let isDark = $state(true);
    /*
    onMount(() => {
        auth.init();
    });
    */

    // auth guard
    $effect(() => {
        const path = $router.path;
        const { user } = $auth;

        if (!path) return;

        if (user && path === "/login") {
            router.goto("/");
            return;
        }

        if (!user && path !== "/login") {
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

{#if $auth.user}
    <div class="min-h-screen bg-background text-foreground">
        <div class="flex flex-col min-h-screen">
            <Navbar {toggleTheme} {isDark} />
            <main class="container mx-auto p-6 flex-1">
                <!-- @ts-ignore -->
                <Route path="/"><Home /></Route>
                <!-- @ts-ignore -->
                <Route path="/users"><Users /></Route>
                <!-- @ts-ignore -->
                <Route path="/products"><Products /></Route>
            </main>
        </div>
    </div>
{:else}
    <Login />
{/if}
