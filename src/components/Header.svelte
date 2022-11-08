<script>
  import { Link } from "svelte-navigator";
</script>

<header>
  <nav>
    <a
      href="https://www.startpage.com/do/dsearch?query=Lutz+V%C3%B6ssing"
      id="nav__lutz"
      target="_blank"><div /></a
    >
    <Link to="bio">
      <div>
        Bio
      </div>
    </Link>
    <Link to="texte">
      <div>
        Texte
      </div>
    </Link>
    <Link to="kontakt">
      <div>
        Kontakt
      </div>
    </Link>
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
    grid-template-columns: repeat(4, 1fr);
    gap: 25px;
    align-items: center;
    margin: 0 5px;
    padding: 0.75rem 0.25rem;
  }

  header nav a:not(:first-child) div {
    box-shadow: 0;
    transition: outline-offset 0.5s;
  }

  header nav a:not(:first-child):hover div {
    outline-style: solid;
    outline-offset: 0;
  }

  header nav a:not(:first-child) div {
    outline-color: var(--secondary);
    border-color: var(--secondary);
    outline-offset: -6px;
    outline-style: dashed;
    outline-width: 2px;
    border-style: dashed;
    border-width: 2px;
    font-size: 1.5rem;
    padding: 0.75rem;
    background-color: var(--primary);
    display: flex;
    align-items: center;
    justify-content: space-around;
  }

  /* header nav a[aria-current="page"] {
    outline-color: var(--primary);
    border-color: var(--primary);
    background-color: var(--secondary);
  } */

  header nav #nav__lutz {
    /* font-family: 'RampartOne'; */
    /* color: rgb(143, 16, 16); */
    /* text-decoration: none; */
    padding: 0 0.5rem;
  }

  header nav #nav__lutz div {
    /* font-size: calc(5em / 3); */
    background: url("/lutz-jap__alt.png");
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    word-break: keep-all;
    height: calc(7em / 3);
  }

  @media (max-width: 800px) {
    header nav {
      grid-template-rows: 1fr 1fr;
      grid-template-columns: 1fr 1fr;
    }
  }
  @media (max-width: 600px) {
    header nav {
      /* grid-template-rows: 1fr 1fr 1fr 1fr;
      grid-template-columns: 1fr; */
      gap:5px;
      
    }
    header nav a div {
      /* margin: 0 40px; */
      font-size: 15px!important;
    }
  }
</style>
