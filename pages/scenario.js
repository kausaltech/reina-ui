import { useState } from 'react';
import Head from 'next/head';
import { gql, useQuery, useMutation } from "@apollo/client";
import { useTranslation } from 'i18n';
import { TabContent, TabPane, Nav, NavItem, NavLink, Container, Row, Col, Button } from 'reactstrap';
import classnames from 'classnames';
import Layout from 'components/Layout';
import AddEvent from 'components/content/AddEvent';
import EventList from 'components/content/EventList';
import ScenariosHeader from 'components/content/ScenariosHeader';
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

  const [activeTab, setActiveTab] = useState('1');

  const toggle = tab => {
    if(activeTab !== tab) setActiveTab(tab);
  }

  return (
    <Layout>
      <Head>
        <title>REINA - Scenario</title>
      </Head>
      <Container className="mt-4" fluid="lg">
        <Row className="mx-2">
          <Col>
              <ScenariosHeader
                handleUpdate={updateList}
              />
              <DashCard>
                <AddEvent
                  events={data ? data.availableEvents : []}
                  handleSuccess={updateList}
                  loading={loading}/>
                <h5>{ t('active-events') }</h5>
                <Nav tabs>
                  <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === '1' })}
                    onClick={() => { toggle('1'); }}
                  >
                    { t('list') }
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === '2' })}
                    onClick={() => { toggle('2'); }}
                  >
                    { t('timeline') }
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={activeTab} className="pt-3">
                <TabPane tabId="1">
                  <EventList
                    events={dataActive ? dataActive.activeEvents : []}
                    updateList={updateList}
                    loading={loadingActive}
                  />
                </TabPane>
                <TabPane tabId="2">
                  <EventTimeLines
                    startDate="2020-03-02"
                    endDate="2021-04-30"
                    events={dataActive ? dataActive.activeEvents : []}
                  />
                </TabPane>
              </TabContent>
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
