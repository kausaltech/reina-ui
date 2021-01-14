import React from 'react';
import { gql, useQuery } from "@apollo/client";
import { useTranslation } from 'i18n';
import MetricsGraph from './MetricsGraph';


function VaccinationGraph(props) {
  const { dailyMetrics } = props;
  const { t } = useTranslation(['common']);
  const shownMetrics = [
    { type: 'VACCINATED' },
  ]


  return <MetricsGraph
    dailyMetrics={dailyMetrics}
    shownMetrics={shownMetrics}
    title={t('vaccinations')}
  />
}

export default VaccinationGraph;
