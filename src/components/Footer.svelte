<script>
  import { Link } from "svelte-navigator";
</script>

<footer>
  <nav>
    <Link to="bio"><img src="/bio.png" alt="isometric book" /></Link>
    <Link to="kontakt"
      ><img src="/kontakt.png" alt="isometric speechbubble" /></Link
    >
    <Link to="texte"><img src="/texte.png" alt="isometric notepad" /></Link>
  </nav>
</footer>

<style>
  footer {
    margin-top: 40px;
    position: absolute;
    bottom: 10px;
    right: 10px;
    z-index: 3;
  }
  footer nav img {
    height: 60px;
  }
</style>
