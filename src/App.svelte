<script>
  import Header from "./components/Header.svelte";
  import Footer from "./components/Footer.svelte";

  import About from "./pages/About.svelte";
  import Kontakt from "./pages/Kontakt.svelte";
  import Texte from "./pages/Texte.svelte";

  import { Router, Route } from "svelte-navigator";
</script>

<Router>
  <Header />

  <main>
    <div id="checkgrid" />
    <h1><span>Lutz Vössing</span></h1>
    <Route path="/" component="{About}" />
    <Route path="kontakt" component="{Kontakt}" />
    <Route path="texte" component="{Texte}" />
  </main>

  <Footer />

</Router>

<style>
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
    font-family: 'Rubik', -apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji;
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

  h1 {
    margin-top: 2rem;
    font-size: 2rem;
    /* text-align: center; */
    color: var(--primary);
  }

  h1 span {
    padding: 0.5rem;
    border: 2px solid var(--primary);
    background-color: var(--tertiary);
    box-shadow: 6px 6px 0 0px var(--secondary);
  }

  @media (min-width: 640px) {
    main {
      max-width: 500px;
      margin: auto;
      padding: 4em;
    }
    h1 {
      text-align: left;
    }
  }
</style>
