import React from 'react';
import { gql, useQuery } from "@apollo/client";
import { useTranslation } from 'i18n';
import MetricsGraph from './MetricsGraph';

const GET_AREA_DATA = gql`
  query getSimulationArea {
    area {
      name
      nameLong
      totalPopulation
      ageGroups {
        label
        count
      }
    }
  }
`;

function VaccinationGraph(props) {
  const { dailyMetrics } = props;
  const { t } = useTranslation(['common']);

  const { loading, error, data, refetch } = useQuery(GET_AREA_DATA, {
    fetchPolicy: "no-cache"
  });

  const vaccinationMetrics = JSON.parse(JSON.stringify(dailyMetrics.metrics.filter((metric)=> metric.type === 'VACCINATED')));
  let hasAllTotals = false;
  let title = t('vaccinations');
  let subtitle = t('total-vaccinated-age-group');

  // If we have are data let's convert vaccinated totals to portions per age group
  if (data?.area) {
    hasAllTotals = true;
    vaccinationMetrics[0].categorizedIntValues.categoryTotals=[];
    vaccinationMetrics[0].categorizedIntValues.categories.forEach((ageGroup, index) => {
      const groupTotal = data.area.ageGroups.find((group) => group.label === ageGroup).count;
      if( groupTotal > 0) {
        vaccinationMetrics[0].categorizedIntValues.values.forEach((dailyValue) => {
          dailyValue[index] = (dailyValue[index]/groupTotal)*100;
        });
      } else hasAllTotals = false;
    }
    );
    if (hasAllTotals) {
      title = t('vaccination-coverage');
      subtitle = t('vaccinated-per-age-group');
      vaccinationMetrics[0].isInteger = false;
      vaccinationMetrics[0].unit = '%';
    };
  }

  const normalizedMetrics = {
    dates: dailyMetrics.dates,
    metrics: hasAllTotals ? vaccinationMetrics : dailyMetrics.metrics,
  };

  const shownMetrics = [
    { type: 'VACCINATED', yAxisLabel: '% ikäryhmästä' },
  ]

  return <MetricsGraph
    dailyMetrics={normalizedMetrics}
    shownMetrics={shownMetrics}
    title={title}
    subtitle={subtitle}
    yAxisLabel='% ikäryhmästä'
  />
}

export default VaccinationGraph;
