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
    return <div>Failed to get simulation results</div>;
  }

  const { mobilityChangeMetrics } = data;

  const metrics = JSON.parse(JSON.stringify(mobilityChangeMetrics));

  metrics.metrics.forEach((element,index) => {
    element.isInteger = element.isSimulated = true;
  });

  const shownMetrics = [
    { type: 'GROCERY_AND_PHARMACY_MOBILITY_CHANGE' },
    { type: 'RETAIL_AND_RECREATION_MOBILITY_CHANGE' },
    { type: 'PARKS_MOBILITY_CHANGE' },
    { type: 'TRANSIT_STATIONS_MOBILITY_CHANGE' },
    { type: 'WORKPLACES_MOBILITY_CHANGE' },
    { type: 'RESIDENTIAL_MOBILITY_CHANGE' },
  ];


  return (
    <Layout>
      <Head>
        <title>REINA - { t('mobility-data') }</title>
      </Head>
      <Container className="mt-4" fluid="lg">
        <Row className="mx-2">
          <Col>
            <DashCard>
              <h3>{ t('mobility-data') }</h3>
              <h5 className="mb-5">{metrics.metrics[0].description}</h5>
              { metrics.metrics.map((metric) =>
                <MetricsGraph     
                  dailyMetrics={metrics}
                  shownMetrics={[{ type: metric.type }]}
                  events={[]}
                  subtitle={metric.label} 
                  showToday={false}
                  key={metric.type}
                />
              )}
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
