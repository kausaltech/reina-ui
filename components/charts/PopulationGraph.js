import React, { useContext } from 'react';
import { gql, useQuery } from "@apollo/client";
import { useTranslation } from 'i18n';
import MetricsGraph from './MetricsGraph';
import AreaContext from 'common/area';
import {
  categorizeTestingEvents,
  categorizeMobilityEvents,
  categorizeMaskEvents,
  categorizeVaccinationEvents,
  categorizeInfectionEvents,
  categorizeWeeklyInfectionEvents, } from 'common/preprocess';

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
  const area = useContext(AreaContext);
  const { loading: loadingActive, error: errorActive, data: dataActive } = useQuery(GET_ACTIVE_EVENTS, {
    fetchPolicy: "no-cache"
  });

  if (loadingActive) {
    return <div>{ t('loading-events') } </div>
  }
  if (errorActive) {
    console.log(error);
    return <div>{ t('error') }</div>
  }

  const shownMetrics = [
    { type: 'SUSCEPTIBLE', visible: 'legendonly' },
    { type: 'DETECTED', visible: 'legendonly', },
    { type: 'NEW_INFECTIONS' },
    { type: 'IN_WARD', visible: 'legendonly' },
    { type: 'IN_ICU', visible: 'legendonly' },
    { type: 'DEAD', visible: 'legendonly' },
    { type: 'RECOVERED', visible: 'legendonly' },
  ]

  const shownEvents = [
    {
      label: t('new-infections'),
      categories: categorizeWeeklyInfectionEvents(dataActive.activeEvents, area.area.totalPopulation),
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
