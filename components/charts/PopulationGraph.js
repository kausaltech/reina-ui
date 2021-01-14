import React from 'react';
import { gql, useQuery } from "@apollo/client";
import { useTranslation } from 'i18n';
import MetricsGraph from './MetricsGraph';
import {
  categorizeTestingEvents,
  categorizeMobilityEvents,
  categorizeMaskEvents,
  categorizeVaccinationEvents,
  categorizeInfectionEvents, } from 'common/preprocess';

const GET_ACTIVE_EVENTS = gql`
query GetActiveInvertions {
  activeEvents {
    id
    type
    date
    description
    parameters {
      id
      description
      ... on EventIntParameter {
        value
        unit
      }
      ... on EventChoiceParameter {
        choice {
          id
          label
        }
      }
    }
  }
}
`;

function PopulationGraph(props) {
  const { dailyMetrics } = props;
  const { t } = useTranslation(['common']);
  const { loading: loadingActive, error: errorActive, data: dataActive } = useQuery(GET_ACTIVE_EVENTS);

  if (loadingActive) {
    return <div>{ t('loading-events') } </div>
  }
  if (errorActive) {
    console.log(error);
    return <div>{ t('error') }</div>
  }

  const shownMetrics = [
    { type: 'SUSCEPTIBLE', visible: 'legendonly' },
    { type: 'INFECTED' },
    { type: 'HOSPITALIZED' },
    { type: 'IN_ICU' },
    { type: 'DEAD' },
    { type: 'RECOVERED', visible: 'legendonly' },
  ]

  const shownEvents = [
    {
      label: t('new-infections'),
      categories: categorizeInfectionEvents(dataActive.activeEvents),
    },
    {
      label: t('limit-mobility'),
      categories: categorizeMobilityEvents(dataActive.activeEvents),
    },
    {
      label: t('testing'),
      categories: categorizeTestingEvents(dataActive.activeEvents),
    },
    {
      label: t('wearing-masks'),
      categories: categorizeMaskEvents(dataActive.activeEvents),
    },
    {
      label: t('vaccination'),
      categories: categorizeVaccinationEvents(dataActive.activeEvents),
    },
  ];

  return <MetricsGraph
    dailyMetrics={dailyMetrics}
    shownMetrics={shownMetrics}
    events={shownEvents}
    title={t('population')}
  />
}

export default PopulationGraph;
