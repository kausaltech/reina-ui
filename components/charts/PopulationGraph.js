import React from 'react';
import MetricsGraph from './MetricsGraph';

function PopulationGraph(props) {
  const { dailyMetrics } = props;

  const shownMetrics = [
    { type: 'SUSCEPTIBLE', visible: 'legendonly' },
    { type: 'INFECTED' },
    { type: 'HOSPITALIZED' },
    { type: 'IN_ICU' },
    { type: 'DEAD' },
    { type: 'RECOVERED', visible: 'legendonly' },
  ]
  return <MetricsGraph dailyMetrics={dailyMetrics} shownMetrics={shownMetrics} title="Population" />
}

export default PopulationGraph;
