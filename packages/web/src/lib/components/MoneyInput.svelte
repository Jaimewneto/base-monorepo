<script lang="ts">
  import Input from "./ui/input/input.svelte";
  import Label from "./ui/label/label.svelte";
  import { onMount } from "svelte";

  let {
    value = $bindable<number>(),
    label,
    required = false,
    id = crypto.randomUUID(),
  } = $props<{
    value: number;
    label: string;
    required?: boolean;
    id?: string;
  }>();

  let cents = $state(0);

  function formatFromCents(c: number) {
    return new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(c / 100);
  }

  function normalizeFromValue(v: number) {
    const normalized = Math.round(Number(v) * 100);
    cents = normalized;
    value = normalized / 100; // forces numeric
  }

  function onInput(e: Event) {
    const input = e.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, "");

    cents = digits ? Number(digits) : 0;
    value = cents / 100;

    input.value = formatFromCents(cents);
  }

  // On mount cause the value needs to be imediately normalized
  onMount(() => {
    normalizeFromValue(value);
  });

  // sync when value changes
  $effect(() => {
    normalizeFromValue(value);
  });
</script>

<div class="grid gap-2">
  <Label for={id}>{label}</Label>

  <div class="relative">
    <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono"> R$ </span>

    <Input {id} type="text" inputmode="numeric" class="pl-10 text-right font-mono" value={formatFromCents(cents)} oninput={onInput} {required} />
  </div>
</div>
