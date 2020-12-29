import Head from 'next/head';
import { gql, useQuery } from "@apollo/client";
import { useTranslation } from '../i18n';
import { Container, Row, Col, Spinner } from 'reactstrap';
import styled from 'styled-components';
import Layout from 'components/Layout';
import AddEvent from 'components/content/AddEvent';
import EventList from 'components/content/EventList';
import EventTimeLines from 'components/general/EventTimeLines';
import DashCard from 'components/general/DashCard';

const GET_ACTIVE_EVENTS = gql`
  query GetActiveInvertions {
    activeEvents {
      id
      type
      date
      description
      parameters {
        id
        description
        ... on EventIntParameter {
          value
          unit
        }
        ... on EventChoiceParameter {
          choice {
            id
            label
          }
        }
      }
    }
  }
`;

const GET_EVENTS = gql`
  query GetAvailableEvents {
    availableEvents {
      type
      description
      parameters {
        id
        description
        required
        ... on EventChoiceParameter {
          choices {
            id
            label
          }
        }
        ... on EventIntParameter {
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
  const { loading, error, data } = useQuery(GET_EVENTS);
  const { loading: loadingActive, error: errorActive, data: dataActive, refetch } = useQuery(GET_ACTIVE_EVENTS);

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
              <AddEvent
                events={data ? data.availableEvents : []}
                handleSuccess={updateList}
                loading={loading}/>
              <EventList
                events={dataActive ? dataActive.activeEvents : []}
                updateList={updateList}
                loading={loadingActive}
              />
              <DashCard>
                <EventTimeLines
                  startDate="2020-02-02"
                  endDate="2021-28-02"
                  events={[]}
                />
              </DashCard>
          </Col>
        </Row>
      </Container>

    </Layout>
  )
}

Scenario.getInitialProps = async () => ({
  namespacesRequired: ['common'],
})
