import React from 'react';
import { gql, useQuery } from "@apollo/client";
import MetricsGraph from './MetricsGraph';

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

const categorizeMobilityEvents = (events) => {
  if(!events?.length) return null;

  const mobilityEvents = events.filter((element) => element.type==='LIMIT_MOBILITY');
  const editedEvents = [];
  const eventCategories= [];

  // based on its parameters create a category label for each event
  mobilityEvents.forEach((element) => {
      const minAge = element.parameters.find((param) => param.id === 'min_age');
      const maxAge = element.parameters.find((param) => param.id === 'max_age');
      const place = element.parameters.find((param) => param.id === 'place');
      const reduction = element.parameters.find((param) => param.id === 'reduction');

      const ageGroup = (minAge.value !== null || maxAge.value !== null) ?
        ` (${minAge.value !== null ? minAge.value : 0}–${maxAge.value !== null ? maxAge.value : 100}-v.)` : undefined;
      const categoryLabel = `${place?.choice ? place.choice.label : 'All'}${ageGroup || ''}`;

      editedEvents.push({
        label: categoryLabel,
        reduction: reduction.value,
        date: element.date,
        id: element.id,
      });

      eventCategories.push(categoryLabel);
  });

  // create a list of unique event categories by label
  const uniqueCategories = Array.from(new Set(eventCategories)).sort();
  const categorizedEvents = [];
  uniqueCategories.forEach((cat) => {
    const category = editedEvents.filter((event) => event.label === cat);
    categorizedEvents.push({
      events: category,
      label: cat,
    })
  })
  return categorizedEvents;
};

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
    { type: 'RECOVERED', visible: 'legendonly' },
  ]
  return <MetricsGraph
    dailyMetrics={dailyMetrics}
    shownMetrics={shownMetrics}
    events={categorizeMobilityEvents(dataActive.activeEvents)}
    title="Population"
  />
}

export default PopulationGraph;
