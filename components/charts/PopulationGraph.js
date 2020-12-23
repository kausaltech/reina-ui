import React from 'react';
import { gql, useQuery } from "@apollo/client";
import MetricsGraph from './MetricsGraph';

const GET_ACTIVE_INTERVENTIONS = gql`
query GetActiveInvertions {
  activeInterventions {
    id
    type
    date
    description
    parameters {
      id
      description
      ... on InterventionIntParameter {
        value
        unit
      }
      ... on InterventionChoiceParameter {
        choice {
          id
          label
        }
      }
    }
  }
}
`;

const categorizeMobilityInterventions = (interventions) => {
  if(!interventions?.length) return null;

  const mobilityInterventions = interventions.filter((element) => element.type==='LIMIT_MOBILITY');
  const editedInterventions = [];
  const interventionCategories= [];

  // based on its parameters create a category label for each intervention
  mobilityInterventions.forEach((element) => {
      const minAge = element.parameters.find((param) => param.id==='min_age');
      const maxAge = element.parameters.find((param) => param.id==='max_age');
      const place = element.parameters.find((param) => param.id==='place');
      const reduction = element.parameters.find((param) => param.id==='reduction');

      const ageGroup = (minAge || maxAge) ?
        ` (${minAge ? minAge.value : 0}-${maxAge ? maxAge.value : 100})` : undefined;
      const categoryLabel = `${place ? place.choice.label : 'All'}${ageGroup || ''}`;

      editedInterventions.push({
        label: categoryLabel,
        reduction: reduction.value,
        date: element.date,
        id: element.id,
      });

      interventionCategories.push(categoryLabel);
  });

  // create a list of unique intervention categories by label
  const uniqueCategories = Array.from(new Set(interventionCategories)).sort();
  const categorizedInterventions = [];
  uniqueCategories.forEach((cat) => {
    const category = editedInterventions.filter((intervention) => intervention.label === cat);
    categorizedInterventions.push({
      interventions: category,
      label: cat,
    })
  })
  return categorizedInterventions;
};

function PopulationGraph(props) {
  const { dailyMetrics } = props;

  const { loading: loadingActive, error: errorActive, data: dataActive } = useQuery(GET_ACTIVE_INTERVENTIONS);

  if (loadingActive) {
    return <div>Loading interventions</div>
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
    interventions={categorizeMobilityInterventions(dataActive.activeInterventions)}
    title="Population"
  />
}

export default PopulationGraph;
