import React from 'react';
import MetricsGraph from './MetricsGraph';

function HealthcareCapacityGraph(props) {
  const { dailyMetrics } = props;

  const shownMetrics = [
    { type: 'AVAILABLE_HOSPITAL_BEDS' },
    { type: 'AVAILABLE_ICU_UNITS' },
  ]
  return (
    <MetricsGraph
      dailyMetrics={dailyMetrics}
      shownMetrics={shownMetrics}
      title="Free capacity in the healthcare system" 
    />
  )   
}

export default HealthcareCapacityGraph;