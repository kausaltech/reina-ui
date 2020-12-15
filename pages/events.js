import Head from 'next/head';
import { gql, useQuery } from "@apollo/client";
import { useTranslation } from '../i18n';
import { Container, Row, Col, Spinner } from 'reactstrap';
import Layout from 'components/Layout';
import AddIntervention from 'components/content/AddIntervention';
import InterventionList from 'components/content/InterventionList';
import DashCard from 'components/general/DashCard';

const GET_ACTIVE_INTERVENTIONS = gql`
  query GetActiveInvertions {
    activeInterventions {
      id
      type
      date
      description
      parameters {
        id
        description
        ... on InterventionIntParameter {
          value
          unit
        }
        ... on InterventionChoiceParameter {
          choice {
            id
            label
          }
        }
      }
    }
  }
`;

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
          choices {
            id
            label
          }
        }
        ... on InterventionIntParameter {
          minValue
          maxValue
          unit
        }
      }
    }
  }
`;
export default function Events() {
  const { t, i18n } = useTranslation(['common']);
  const { loading, error, data, refetch } = useQuery(GET_INTERVENTIONS);
  const { loading: loadingActive, error: errorActive, data: dataActive } = useQuery(GET_ACTIVE_INTERVENTIONS);

  return (
    <Layout>
      <Head>
        <title>REINA - Front page</title>
      </Head>
      <Container className="mt-4">
        <Row className="mx-2">
          <Col>
            { loading ?
              <Spinner style={{ width: '3rem', height: '3rem' }} /> :
              <AddIntervention interventions={data ? data.availableInterventions : []} handleSuccess={refetch} /> }
            { loadingActive ?
              <Spinner style={{ width: '3rem', height: '3rem' }} /> :
              <InterventionList interventions={dataActive ? dataActive.activeInterventions : []} />}
          </Col>
        </Row>
      </Container>

    </Layout>
  )
}

Events.getInitialProps = async () => ({
  namespacesRequired: ['common'],
})
