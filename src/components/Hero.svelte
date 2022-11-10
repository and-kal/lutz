<script>
  import { fade } from 'svelte/transition';
</script>

<h1 in:fade="{{ duration: 500 }}">
    <span>Lutz Vössing</span>
</h1>

<style>
  h1 {
    margin-top: 2rem;
    font-size: 2rem;
    /* text-align: center; */
    color: var(--primary);
  }

  h1 span {
    padding: 0.5rem;
    border: 2px solid var(--quaternary);
    background-color: var(--tertiary);
    box-shadow: -2px -2px 0 #bdbdbd, -4px -4px 0 #a4a4a4, -6px -6px 0 #848484,-8px -8px 0 #585858, -10px -10px 0 #2e2e2e, -12px -12px 0 #000;
  }

  @media (min-width: 640px) {
    h1 {
      text-align: left;
    }
  }
</style>
