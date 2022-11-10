<script  context="module">
  import Landing from "../pages/Landing.svelte";
  import Bio from "../pages/Bio.svelte";
  import Kontakt from "../pages/Kontakt.svelte";
  import Texte from "../pages/Texte.svelte";

  export const navOptions = {
    "landing": Landing,
    "bio": Bio,
    "kontakt": Kontakt,
    "texte": Texte,
};
</script>
