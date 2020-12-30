import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

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
        type: element.type,
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

const getInfectionEvents = (events) => {
  if(!events?.length) return null;

  const infectionEvents = events.filter((element) => element.type==='IMPORT_INFECTIONS');
  const editedEvents = [];

  infectionEvents.forEach((element) => {
      const amount = element.parameters.find((param) => param.id === 'amount');
      editedEvents.push({
        label: 'New infections',
        amount: amount.value,
        date: element.date,
        id: element.id,
        type: element.type,
      });
  });

  return editedEvents;
};

const categorizeTestingEvents = (events) => {
  if(!events?.length) return null;

  const testingEvents = events.filter((element) =>
    ['TEST_ALL_WITH_SYMPTOMS','TEST_ONLY_SEVERE_SYMPTOMS','TEST_WITH_CONTACT_TRACING'].includes(element.type)
    );
  const editedEvents = [];
  const eventCategories= [];

  // based on its parameters create a category label for each event
  testingEvents.forEach((element) => {
      const categoryLabel = element.description;

      editedEvents.push({
        label: categoryLabel,
        strength: element.parameters ? element.parameters[0]?.value : 100,
        date: element.date,
        id: element.id,
        type: element.type,
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


export {
  categorizeMobilityEvents,
  getInfectionEvents,
  categorizeTestingEvents,
};
