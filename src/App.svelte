<script>
  import { navOptions } from "./components/Nav.svelte"; // import application navigation
  let pgSelected = "landing";

  // change the selected component (the event.originalTarget.id is not accessible in Chrome so switched to event.srcElement.id)
  function changeComponent(event) {
    pgSelected = event.srcElement.id;
    console.log(pgSelected);
  }
</script>

<header>
  <nav class={pgSelected == "landing" ? "landing" : "not-landing"}>
    <div
      style={pgSelected == "landing" ? "display:none" : ""}
      on:click={changeComponent}
      id="landing"
    />
    <div
      class={pgSelected == "bio" ? "active" : "inactive"}
      on:click={changeComponent}
      id="bio"
    >
      Bio
    </div>

    <div
      class={pgSelected == "texte" ? "active" : "inactive"}
      on:click={changeComponent}
      id="texte"
    >
      Texte
    </div>

    <div
      class={pgSelected == "kontakt" ? "active" : "inactive"}
      on:click={changeComponent}
      id="kontakt"
    >
      Kontakt
    </div>
  </nav>
</header>

  <main>
    <div id="checkgrid" />
    <svelte:component this={navOptions[pgSelected]} />
  </main>

<style>
/* header related */
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

  header nav div {
    cursor: pointer;
  }

  header nav.landing {
    grid-template-columns: repeat(3, 1fr);
  }

  header nav #landing {
    /* font-size: calc(5em / 3); */
    padding: 0 0.5rem;
    background: url("/lutz-jap__alt.png");
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    word-break: keep-all;
    height: calc(7em / 3);
  }

  header nav div:not(#landing):hover {
    outline-style: solid;
    outline-offset: 0;
  }

  header nav div:not(#landing) {
    box-shadow: 0;
    transition: outline-offset 0.5s;
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

  header nav div:not(#landing).active {
    outline-color: var(--primary);
    border-color: var(--primary);
    color: var(--primary);
    background-color: var(--secondary);
    transition: outline-color 0.5s, border-color 0.5s, background-color 0.5s, color 0.5s;
  }


  @media (max-width: 800px) {
    header nav {
      grid-template-rows: 1fr 1fr;
      grid-template-columns: 1fr 1fr;
    }
    header nav.landing {
      grid-template-rows: 1fr 1fr 1fr;
      grid-template-columns: 1fr;
    }
  }
  @media (max-width: 600px) {
    header nav {
      gap: 5px;
    }
    header nav a div {
      font-size: 15px !important;
    }
  }

  /* main related */
  @font-face {
    font-family: "Rubik";
    src: url("/fonts/Rubik-Regular.ttf") format("truetype");
    font-weight: normal;
  }

  @font-face {
    font-family: "Rubik";
    src: url("/fonts/Rubik-Bold.ttf") format("truetype");
    font-weight: bold;
  }

  @font-face {
    font-family: "FiraCode";
    src: url("/fonts/FiraCode-Regular.woff") format("woff");
    font-weight: normal;
  }

  @font-face {
    font-family: "FiraCode";
    src: url("/fonts/FiraCode-Regular.woff2") format("woff2");
    font-weight: normal;
  }
  main {
    text-align: left;
    width: 95%;
    margin: auto;
    line-height: 1.5rem;
    display: grid;
    font-family: "Rubik", -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica,
      Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji;
    position: relative;
  }

  #checkgrid {
    position: absolute;
    width: 100%;
    height: 100%;
    grid-template-columns: repeat(100, 1fr);
    grid-template-rows: repeat(500, 1fr);
    gap: 0;
  }

  @media (min-width: 640px) {
    main {
      max-width: 500px;
      margin: auto;
      padding: 2.5em;
    }
  }  
</style>