import { useTranslation } from '../i18n';
import { useContext } from 'react';
import { i18n, Link } from 'i18n';
import { gql, useQuery, useMutation } from "@apollo/client";
import { Container, Row, Col, Spinner } from 'reactstrap';
import DashCard from 'components/general/DashCard';
import Updating from 'components/general/Updating';
import ScenarioSelector from 'components/content/ScenarioSelector';
import PopulationGraph from 'components/charts/PopulationGraph';
import EpidemicParametersGraph from 'components/charts/EpidemicParametersGraph';
import ValidationGraph from 'components/charts/ValidationGraph';
import HealthcareCapacityGraph from 'components/charts/HealthcareCapacityGraph';
import AreaContext from 'common/area';


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
          categorizedIntValues {
            categories
            values
          }
          isInteger
          isSimulated
        }
      }
    }
  }
`;


function ResultBlock({ finished, children }) {
  return (
    <Row className="mx-2">
      <Col md="12">
        <DashCard>
          { finished ? children : <Updating /> }
        </DashCard>
      </Col>
    </Row>
  )
}


function SimulationResults({ runId, handleRefresh }) {
  const { t, i18n } = useTranslation(['common']);
  const area = useContext(AreaContext);

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
  const { predictedMetrics, finished } = simulationResults;

  console.log("Results", simulationResults, validationMetrics)

  if (!predictedMetrics.metrics.length) {
    return <Spinner style={{ width: '3rem', height: '3rem' }} />
  }

  if (finished) {
    console.log('simulation run done, stop polling');
    stopPolling();
  }

  return (
    <Container className="mt-4" fluid="lg">
      <ResultBlock finished={true}>
        <h3>{ t('outcome') }</h3>
        <h5>{area.area.nameLong}</h5>
        <div>{`${t('population')}: ${area.area.totalPopulation}`}</div>
        <hr />
        <ScenarioSelector edit handleUpdate={handleRefresh} />
      </ResultBlock>
      <ResultBlock finished={finished}>
        <PopulationGraph dailyMetrics={predictedMetrics} />
      </ResultBlock>
      <ResultBlock finished={finished}>
        <HealthcareCapacityGraph dailyMetrics={predictedMetrics} />
      </ResultBlock>
      <ResultBlock finished={finished}>
        <EpidemicParametersGraph dailyMetrics={predictedMetrics} />
      </ResultBlock>
      <ResultBlock finished={finished}>
        <ValidationGraph
          dailyMetrics={predictedMetrics}
          validationMetrics={area.validationMetrics}
        />
      </ResultBlock>
    </Container>
  )
}

export default SimulationResults;
