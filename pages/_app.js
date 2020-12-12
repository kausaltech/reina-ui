import '../styles/globals.scss'
import { ThemeProvider } from 'styled-components';

const appTheme = require('sass-extract-loader?{"plugins": ["sass-extract-js"]}!styles/themes/default.scss');

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={appTheme}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp
