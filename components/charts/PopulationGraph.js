import React from 'react';
import { gql, useQuery } from "@apollo/client";
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

  const { loading: loadingActive, error: errorActive, data: dataActive } = useQuery(GET_ACTIVE_EVENTS);

  if (loadingActive) {
    return <div>Loading events</div>
  }
  if (errorActive) {
    console.log(error);
    return <div>Err</div>
  }

  const shownMetrics = [
    { type: 'SUSCEPTIBLE', visible: 'legendonly' },
    { type: 'INFECTED' },
    { type: 'HOSPITALIZED' },
    { type: 'IN_ICU' },
    { type: 'DEAD' },
    { type: 'VACCINATED', visible: 'legendonly' },
    { type: 'RECOVERED', visible: 'legendonly' },
  ]

  const shownEvents = [
    {
      label: 'New infections',
      categories: categorizeInfectionEvents(dataActive.activeEvents),
    },
    {
      label: 'Limit mobility',
      categories: categorizeMobilityEvents(dataActive.activeEvents),
    },
    {
      label: 'Testing',
      categories: categorizeTestingEvents(dataActive.activeEvents),
    },
    {
      label: 'Wearing masks',
      categories: categorizeMaskEvents(dataActive.activeEvents),
    },
    {
      label: 'Vaccination',
      categories: categorizeVaccinationEvents(dataActive.activeEvents),
    },
  ];

  return <MetricsGraph
    dailyMetrics={dailyMetrics}
    shownMetrics={shownMetrics}
    events={shownEvents}
    title="Population"
  />
}

export default PopulationGraph;
