<script>
  import Hero from "../components/Hero.svelte";
  import { fade } from "svelte/transition";
</script>

<Hero />
<div class="contentbox" in:fade={{ duration: 500 }}>
  <h2><span>Bio</span></h2>
  <div class="bio">
    Geboren 1990 in Höxter, Kurzaufenthalt in Mittelsachsen, Studium der
    Philosophie und Literaturwissenschaft in Wien und Berlin, lebt und arbeitet
    mit Büchern in Berlin.
  </div>
  <div class="bio">
    Beiträge für skug, GROOVE, Spex, wina, Ventil-Verlag, Facebook, Radio und
    diverse Arbeiten als Ghostwriter im Bereich Musik und Kultur.
  </div>
</div>

<style>
  .bio {
    margin: 1rem 0;
  }
</style>
