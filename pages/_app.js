import 'styles/globals.scss'
import App from 'next/app'
import { ApolloProvider } from "@apollo/client";
import { ThemeProvider } from 'styled-components';
import { gql, useQuery } from "@apollo/client";
import { Spinner } from 'reactstrap';

import { useApollo } from 'common/apollo';
import AreaContext from 'common/area';
import { appWithTranslation } from '../i18n';


const GET_AREA_DATA = gql`
  query GetAreaData {
    area {
      name
      nameLong
      totalPopulation
      ageGroups {
        label
        count
      }
    }
    validationMetrics {
      dates
      metrics {
          type
          label
          unit
          color
          intValues
          isInteger
          isSimulated
      }
    }
  }
`;


const appTheme = require('sass-extract-loader?{"plugins": ["sass-extract-js"]}!styles/themes/default.scss');
function ReinaApp({ Component, pageProps }) {
  const apolloClient = useApollo(pageProps.initialApolloState);
  const {
    loading, error, data
  } = useQuery(GET_AREA_DATA, {client: apolloClient});
  let component;

  if (error) {
    component = <div>{`Error loading area data: ${error}`}</div>;
  } else if (loading) {
    component = <Spinner style={{ width: '3rem', height: '3rem' }} />
  } else {
    component = <Component {...pageProps} />
  }

  return (
    <ApolloProvider client={apolloClient}>
      <ThemeProvider theme={appTheme}>
        <AreaContext.Provider value={data}>
          {component}
        </AreaContext.Provider>
      </ThemeProvider>
    </ApolloProvider>
  );
}

ReinaApp.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext)
  return { ...appProps }
}

export default appWithTranslation(ReinaApp)
