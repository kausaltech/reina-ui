import Head from 'next/head';
import { gql, useQuery } from "@apollo/client";
import { useTranslation } from '../i18n';
import { Container, Row, Col } from 'reactstrap';
import Layout from 'components/Layout';
import AddIntervention from 'components/content/AddIntervention';
import InterventionList from 'components/content/InterventionList';

/*
const GET_ACTIVE_INTERVENTIONS = gql`
  query getInvertions {
    interventions {
      id
      date
      ... on ImportInfectionsIntervention {
        amount
      }
      ... on LimitMobilityIntervention {
        value
        minAge
        maxAge
        contactPlace
      }
      ... on TestingStrategyIntervention {
        strategy
        efficiency
      }
    }
  }
`
*/

const GET_INTERVENTIONS = gql`
  query GetAvailableInterventions {
    availableInterventions {
      type
      description
      parameters {
        id
        description
        required
        ... on InterventionChoiceParameter {
          choices
          labels
          required
        }
        ... on InterventionIntParameter {
          minValue
          maxValue
          required
        }
      }
    }
  }
`;
export default function Events() {
  const { t, i18n } = useTranslation(['common']);
  const { loading, error, data } = useQuery(GET_INTERVENTIONS);

  return (
    <Layout>
      <Head>
        <title>REINA - Front page</title>
      </Head>
      <Container className="mt-4">
        <Row className="mx-2">
          <Col>
            <AddIntervention interventions={data ? data.availableInterventions : []} />
            <InterventionList interventions={[]} />
          </Col>
        </Row>
      </Container>
      
    </Layout>
  )
}

Events.getInitialProps = async () => ({
  namespacesRequired: ['common'],
})
