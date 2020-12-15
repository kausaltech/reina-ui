import React from 'react';
import MetricsGraph from './MetricsGraph';

function EpidemicParametersGraph(props) {
  const { dailyMetrics } = props;

  const shownMetrics = [
    { type: 'R' },
    { type: 'IFR' },
    { type: 'CFR' },
  ]
  return <MetricsGraph dailyMetrics={dailyMetrics} shownMetrics={shownMetrics} title="Epidemic parameters" />
}

export default EpidemicParametersGraph;
