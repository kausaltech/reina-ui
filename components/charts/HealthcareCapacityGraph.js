import React from 'react';
import { useTranslation } from 'i18n';
import MetricsGraph from './MetricsGraph';

function HealthcareCapacityGraph(props) {
  const { dailyMetrics } = props;
  const { t } = useTranslation(['common']);

  const shownMetrics = [
    { type: 'AVAILABLE_HOSPITAL_BEDS' },
    { type: 'AVAILABLE_ICU_UNITS' },
  ]
  return (
    <MetricsGraph
      dailyMetrics={dailyMetrics}
      shownMetrics={shownMetrics}
      title={t('free-healthcare-capacity')} 
    />
  )   
}

export default HealthcareCapacityGraph;