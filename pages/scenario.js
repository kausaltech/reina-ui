import { useState } from 'react';
import Head from 'next/head';
import { gql, useQuery, useMutation } from "@apollo/client";
import { useTranslation } from 'i18n';
import { TabContent, TabPane, Nav, NavItem, NavLink, Container, Row, Col, Button } from 'reactstrap';
import classnames from 'classnames';
import Layout from 'components/Layout';
import AddEvent from 'components/content/AddEvent';
import EventList from 'components/content/EventList';
import ScenarioSelector from 'components/content/ScenarioSelector';
import EventTimeLines from 'components/general/EventTimeLines';
import DashCard from 'components/general/DashCard';

const GET_ACTIVE_EVENTS = gql`
  query GetActiveEvents {
    activeEvents {
      id
      type
      date
      description
      modifiable
      modifiedByUser
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
  const { loading: loadingActive, error: errorActive, data: dataActive, refetch } = useQuery(GET_ACTIVE_EVENTS, {
    fetchPolicy: "no-cache"
  });
  // We determine if the user has customized the event list by checking if the amount of events has changed.
  // Not very elegant but can not think other options without fetching scenarios list here too
  const isCustomized = dataActive?.activeEvents.length;

  const updateList = () => {
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
              <DashCard className="shadow-lg">
                <h3>{ t('scenario') }</h3>
                <ScenarioSelector
                  run
                  handleUpdate={updateList}
                  isCustomized={isCustomized}
                />
              </DashCard>
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
