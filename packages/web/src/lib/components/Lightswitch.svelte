<script lang="ts">
  import { Switch } from "@skeletonlabs/skeleton-svelte";
  import { Sun, Moon } from "@lucide/svelte";

  let checked = $state(false);

  $effect(() => {
    const mode = localStorage.getItem("mode") || "light";
    checked = mode === "dark";
    if (checked) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  });

  const onCheckedChange = (event: { checked: boolean }) => {
    const mode = event.checked ? "dark" : "light";
    if (event.checked) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("mode", mode);
    checked = event.checked;
  };
</script>

<svelte:head>
  <script>
    const mode = localStorage.getItem("mode") || "light";
    if (mode === "dark") {
      document.documentElement.classList.add("dark");
    }
  </script>
</svelte:head>

<Switch {checked} {onCheckedChange}>
  <Switch.Control class="relative">
    <Switch.Thumb class="flex items-center justify-center">
      {#if checked}
        <Moon class="h-3 w-3" />
      {:else}
        <Sun class="h-3 w-3" />
      {/if}
    </Switch.Thumb>
  </Switch.Control>
  <Switch.HiddenInput />
</Switch>
