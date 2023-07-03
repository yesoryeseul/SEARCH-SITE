// global.js
import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

const GlobalStyles = createGlobalStyle`
${reset}
  * {
    box-sizing: border-box;
  }
  
  html {
    font-family: 'NanumSquare', sans-serif;
    background: linear-gradient(60deg, rgba(216,226,251,1) 0%, rgba(236,235,253,1) 100%);
  }

  ul, li {
    list-style: none;
  }

`;

export default GlobalStyles;
