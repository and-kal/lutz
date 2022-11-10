<script>
    import { fade } from 'svelte/transition';
</script>

<div class="contentbox" in:fade="{{ duration: 500 }}">
  <h2><span>Kontakt</span></h2>
  <!-- <img src="/lutz-foto.jpg" alt="Lutz lesend" /> -->
  <img src="/lutz-logo.jpg" alt="Lutz written with an eel" />
  Schreibt mir gerne via <a href="mailto:luzz@tuta.io">E-Mail</a>, ich drucke die Nachrichten dann aus und lese sie.
</div>

<style>
  h2 {
    padding: 0 0 1rem 0;
  }
  img {
    max-width: 99%;
    height: auto;
    border: 3px solid var(--quaternary);
    margin: 1rem 0;
    filter: grayscale(80%);
    -webkit-filter: grayscale(80%);
    -moz-filter: grayscale(80%);
    -o-filter: grayscale(80%);
    -ms-filter: grayscale(80%);
  }
  a {
    font-size: 1rem;
    margin: 2rem auto;
    text-decoration: none;
  }
</style>
