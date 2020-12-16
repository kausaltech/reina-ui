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
export default function Scenario() {
  const { t, i18n } = useTranslation(['common']);
  const { loading, error, data } = useQuery(GET_INTERVENTIONS);
  const { loading: loadingActive, error: errorActive, data: dataActive, refetch } = useQuery(GET_ACTIVE_INTERVENTIONS);

  const updateList = () => {
    //console.log('Updating list');
    refetch();
  };

  return (
    <Layout>
      <Head>
        <title>REINA - Front page</title>
      </Head>
      <Container className="mt-4" fluid="lg">
        <Row className="mx-2">
          <Col>
              <AddIntervention
                interventions={data ? data.availableInterventions : []}
                handleSuccess={updateList}
                loading={loading}/>
              <InterventionList
                interventions={dataActive ? dataActive.activeInterventions : []}
                updateList={updateList}
                loading={loadingActive}
              />
          </Col>
        </Row>
      </Container>

    </Layout>
  )
}

Scenario.getInitialProps = async () => ({
  namespacesRequired: ['common'],
})
