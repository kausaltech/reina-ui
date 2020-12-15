import { useTranslation } from '../i18n';
import { i18n, Link } from 'i18n';
import { I18nContext } from 'next-i18next';
import { gql, useQuery, useMutation } from "@apollo/client";
import { Container, Row, Col } from 'reactstrap';
import KeyIndicator from 'components/content/KeyIndicator';
import PopulationGraph from 'components/charts/PopulationGraph';
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
    return <div>Spinner2</div>
  }
  if (error) {
    console.log(error);
    return <div>Errrrrrorr in starting simulation</div>
  }

  const { simulationResults, validationMetrics } = data;
  const { predictedMetrics } = simulationResults;

  if (simulationResults.finished) {
    console.log('simulation run done, stop polling');
    stopPolling();
  }
  console.log("Results", simulationResults, validationMetrics)

  return (
    <Container className="mt-4">
      <Row className="mx-2">
        <Col md="4" className="px-2">
            <KeyIndicator
              title={t("restriction-day-index")}
              value="155"
              info={t("restriction-day-index-info")}
            />
        </Col>
        <Col md="4" className="px-2">
            <KeyIndicator
              title={t("restriction-day-index")}
              value="155"
              info={t("restriction-day-index-info")}
            />
        </Col>
        <Col md="4" className="px-2">
            <KeyIndicator
              title={t("restriction-day-index")}
              value="155"
              info={t("restriction-day-index-info")}
            />
        </Col>
      </Row>
      <Row className="mx-2">
        <Col md="12">
          <PopulationGraph dailyMetrics={predictedMetrics} />
        </Col>
      </Row>
      <Row className="mx-2">
        <Col md="12">
          <HealthcareCapacityGraph dailyMetrics={predictedMetrics} />
        </Col>
      </Row>
      <Row className="mx-2">
        <Col md="12">
          <ValidationGraph
            dailyMetrics={predictedMetrics}
            validationMetrics={validationMetrics}
          />
        </Col>
      </Row>
    </Container>
  )
}

export default SimulationResults;
