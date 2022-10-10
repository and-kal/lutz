<script>
  import { Link } from "svelte-routing";
</script>

<header>
  <nav>
    <a
      href="https://www.startpage.com/do/dsearch?query=Lutz+V%C3%B6ssing"
      id="nav__lutz"
      target="_blank"><div></div></a
    >
    <Link to="/"><div>Start</div></Link>
    <Link to="texte"><div>Texte</div></Link>
    <Link to="kontakt"><div>Kontakt</div></Link>
  </nav>
</header>

<style>

  @font-face {
    font-family: "Digital";
    src: url("/fonts/EightBit\ Atari-Digital.ttf") format("truetype");
    font-weight: normal;
  }

  @font-face {
    font-family: "Digital";
    src: url("/fonts/EightBit\ Atari-Digitalbold.ttf") format("truetype");
    font-weight: bold;
  }

  header {
    height: auto;
    background-color: var(--quaternary);
    font-size: 1.5rem;
    border-bottom: 2px solid var(--tertiary);
    font-family: "Digital", -apple-system, BlinkMacSystemFont, Segoe UI,
      Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji;
  }

  header nav {
    height: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-auto-rows: minmax(0, 1fr);
    gap: 5px;
    align-items: center;
    margin: 0 5px;
    padding: 0.75rem 0.25rem;
  }

  header nav :global(a):not(:first-child) {
    box-shadow: 0;
    transition: box-shadow 0.5s;
  }

  header nav :global(a):not(:first-child):hover {
    box-shadow: rgba(220, 220, 220, 0.75) 0px 4px 5px,
      rgba(220, 220, 220, 0.88) 0px -2px 3px,
      rgba(220, 220, 220, 0.88) 0px 4px 6px,
      rgba(220, 220, 220, 0.83) 0px 2px 3px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
  }

  header nav a:not(:first-child) div {
    border: 2px solid var(--secondary);
    font-size: 1.5rem;
    padding: 0.75rem;
    background-color: var(--primary);
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
  header nav #nav__lutz {
    /* font-family: 'RampartOne'; */
    /* color: rgb(143, 16, 16); */
    /* text-decoration: none; */
    padding: 0 0.5rem;
  }

  header nav #nav__lutz div {  
    /* font-size: calc(5em / 3); */
    background: url('/lutz-jap.png');
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    word-break: keep-all;
    height: calc(7em / 3);
  }

  @media (max-width: 640px) {
    header nav {
      grid-template-rows: 1fr 1fr 1fr 1fr;
      grid-template-columns: 1fr;
    }
  }
</style>
