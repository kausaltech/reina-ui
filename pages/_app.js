import '../styles/globals.scss'
import App from 'next/app'
import { ThemeProvider } from 'styled-components';
import { appWithTranslation } from '../i18n'

const appTheme = require('sass-extract-loader?{"plugins": ["sass-extract-js"]}!styles/themes/default.scss');
function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={appTheme}>
        <Component {...pageProps} />
    </ThemeProvider>
  );
}

MyApp.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext)
  return { ...appProps }
}

export default appWithTranslation(MyApp)