import Head from 'next/head';
import { gql, useQuery } from "@apollo/client";
import { useTranslation } from 'i18n';
import { Container, Row, Col, Spinner } from 'reactstrap';
import MetricsGraph from 'components/charts/MetricsGraph';
import Layout from 'components/Layout';
import DashCard from 'components/general/DashCard';

const GET_MOBILITY_METRICS = gql`
{
  mobilityChangeMetrics {
    dates
    metrics {
      type
      label
      description
      unit
      intValues
    }
  }
}
`;

export default function Mobility() {
  const { t, i18n } = useTranslation(['common']);
  const { loading, error, data } = useQuery(GET_MOBILITY_METRICS);

  if (loading) {
    return <Spinner style={{ width: '3rem', height: '3rem' }} />
  }
  if (error) {
    console.log(error);
    stopPolling();
    return <div>Failed to get simulation results</div>;
  }

  const mobilityMetrics = {
    dates: data?.mobilityChangeMetrics.dates,
    metrics: data?.mobilityChangeMetrics.metrics[0]
  };

  const { mobilityChangeMetrics } = data;
  const metrics = {};
  metrics.dates = mobilityChangeMetrics.dates;
  metrics.metrics = [];

  const clonedMetrics = JSON.parse(JSON.stringify(mobilityChangeMetrics));

  clonedMetrics.metrics.forEach((element,index) => {
    element.isInteger = element.isSimulated = true;
  });

  const shownMetrics = [
    { type: 'GROCERY_AND_PHARMACY_MOBILITY_CHANGE' },
    { type: 'RETAIL_AND_RECREATION_MOBILITY_CHANGE' },
    { type: 'PARKS_MOBILITY_CHANGE' },
    { type: 'TRANSIT_STATIONS_MOBILITY_CHANGE' },
    { type: 'WORKPLACES_MOBILITY_CHANGE' },
    { type: 'RESIDENTIAL_MOBILITY_CHANGE' },
  ]
  return (
    <Layout>
      <Head>
        <title>REINA - { t('mobility-data') }</title>
      </Head>
      <Container className="mt-4" fluid="lg">
        <Row className="mx-2">
          <Col>
            <DashCard>
              <MetricsGraph     
                dailyMetrics={clonedMetrics}
                shownMetrics={shownMetrics}
                events={[]}
                title={t('mobility')} 
                subtitle={clonedMetrics.metrics[0].description}
                showToday={false} />
            </DashCard>
          </Col>
        </Row>
      </Container>

    </Layout>
  )
}

Mobility.getInitialProps = async () => ({
  namespacesRequired: ['common'],
})
