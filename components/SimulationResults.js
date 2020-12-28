import { useTranslation } from '../i18n';
import { i18n, Link } from 'i18n';
import { gql, useQuery, useMutation } from "@apollo/client";
import { Container, Row, Col, Spinner } from 'reactstrap';
import DashCard from 'components/general/DashCard';
import Updating from 'components/general/Updating';
import PopulationGraph from 'components/charts/PopulationGraph';
import EpidemicParametersGraph from 'components/charts/EpidemicParametersGraph';
import ValidationGraph from 'components/charts/ValidationGraph';
import HealthcareCapacityGraph from 'components/charts/HealthcareCapacityGraph';


const GET_SIMULATION_RESULTS = gql`
  query GetSimulationResults($runId: ID!) {
    simulationResults(runId: $runId) {
      finished
      predictedMetrics {
        dates
        metrics {
          type
          label
          unit
          color
          intValues
          floatValues
          isInteger
          isSimulated
        }
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



function SimulationResults({ runId }) {
  const { t, i18n } = useTranslation(['common']);

  const {
    loading, error, data, startPolling, stopPolling
  } = useQuery(GET_SIMULATION_RESULTS, {
    variables: { runId },
    pollInterval: 500,
  });

  if (loading) {
    return <Spinner style={{ width: '3rem', height: '3rem' }} />
  }
  if (error) {
    console.log(error);
    stopPolling();
    return <div>Failed to get simulation results</div>;
  }

  const { simulationResults, validationMetrics } = data;
  const { predictedMetrics } = simulationResults;

  console.log("Results", simulationResults, validationMetrics)

  if (!predictedMetrics.metrics.length) {
    return <Spinner style={{ width: '3rem', height: '3rem' }} />
  }

  if (simulationResults.finished) {
    console.log('simulation run done, stop polling');
    stopPolling();
  }

  return (
    <Container className="mt-4" fluid="lg">
      <Row className="mx-2">
        <Col md="12">
          <DashCard>
            <h3>Outcome</h3>
            <h5>COVID-19 epidemic model: Varsinais-Suomen sairaanhoitopiiri</h5>
            <Link href="/scenario">Edit scenario events</Link>
          </DashCard>
          
        </Col>
      </Row>
      <Row className="mx-2">
        <Col md="12">
          <DashCard>
            { !simulationResults.finished && <Updating /> }
            <PopulationGraph dailyMetrics={predictedMetrics} />
          </DashCard>
        </Col>
      </Row>
      <Row className="mx-2">
        <Col md="12">
          <DashCard>
            { !simulationResults.finished && <Updating /> }
            <HealthcareCapacityGraph dailyMetrics={predictedMetrics} />
          </DashCard>
        </Col>
      </Row>
      <Row className="mx-2">
        <Col md="12">
          <DashCard>
            { !simulationResults.finished && <Updating /> }
            <EpidemicParametersGraph dailyMetrics={predictedMetrics} />
          </DashCard>
        </Col>
      </Row>
      <Row className="mx-2">
        <Col md="12">
          <DashCard>
            { !simulationResults.finished && <Updating /> }
            <ValidationGraph
              dailyMetrics={predictedMetrics}
              validationMetrics={validationMetrics}
            />
          </DashCard>
        </Col>
      </Row>
    </Container>
  )
}

export default SimulationResults;
