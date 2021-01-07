import React from 'react';
import MetricsGraph from './MetricsGraph';
import { useTranslation } from 'i18n';

function EpidemicParametersGraph(props) {
  const { dailyMetrics } = props;
  const { t } = useTranslation(['common']);

  const shownMetrics = [
    { type: 'R' },
    { type: 'IFR' },
    { type: 'CFR' },
  ]
  return <MetricsGraph dailyMetrics={dailyMetrics} shownMetrics={shownMetrics} title={t('epidemic-parameters')} />
}

export default EpidemicParametersGraph;
