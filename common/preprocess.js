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
        category: categoryLabel,
        label: `${categoryLabel} -${reduction.value} ${reduction.unit}`,
        value: reduction.value,
        date: element.date,
        id: element.id,
        type: element.type,
        color: '#990000',
        marker: '&#x2771;',
        markerColor: '#ffffff',
      });

      eventCategories.push(categoryLabel);
  });

  // create a list of unique event categories by label
  const uniqueCategories = Array.from(new Set(eventCategories)).sort();
  const categorizedEvents = [];
  uniqueCategories.forEach((cat) => {
    const category = editedEvents.filter((event) => event.category === cat);
    categorizedEvents.push({
      events: category,
      label: cat,
    })
  })
  return categorizedEvents;
};

const categorizeMaskEvents = (events) => {
  if(!events?.length) return null;

  const maskEvents = events.filter((element) => element.type==='WEAR_MASKS');
  const editedEvents = [];
  const eventCategories= [];

  // based on its parameters create a category label for each event
  maskEvents.forEach((element) => {
      const minAge = element.parameters.find((param) => param.id === 'min_age');
      const maxAge = element.parameters.find((param) => param.id === 'max_age');
      const place = element.parameters.find((param) => param.id === 'place');
      const effect = element.parameters.find((param) => param.id === 'share_of_contacts');

      const ageGroup = (minAge.value !== null || maxAge.value !== null) ?
        ` (${minAge.value !== null ? minAge.value : 0}–${maxAge.value !== null ? maxAge.value : 100}-v.)` : undefined;
      const categoryLabel = `${place?.choice ? place.choice.label : 'All'}${ageGroup || ''}`;

      editedEvents.push({
        category: categoryLabel,
        label: `${categoryLabel} (${effect.value} ${effect.unit})`,
        value: effect.value,
        date: element.date,
        id: element.id,
        type: element.type,
        color: '#333333',
        marker: '&#x2771;',
        markerColor: '#ffffff',
      });

      eventCategories.push(categoryLabel);
  });

  // create a list of unique event categories by label
  const uniqueCategories = Array.from(new Set(eventCategories)).sort();
  const categorizedEvents = [];
  uniqueCategories.forEach((cat) => {
    const category = editedEvents.filter((event) => event.category === cat);
    categorizedEvents.push({
      events: category,
      label: cat,
    })
  })
  return categorizedEvents;
};

const categorizeVaccinationEvents = (events) => {
  if(!events?.length) return null;

  const vaccinationEvents = events.filter((element) => element.type==='VACCINATE');
  const editedEvents = [];
  const eventCategories= [];

  // based on its parameters create a category label for each event
  vaccinationEvents.forEach((element) => {
      const minAge = element.parameters.find((param) => param.id === 'min_age');
      const maxAge = element.parameters.find((param) => param.id === 'max_age');
      const rate = element.parameters.find((param) => param.id === 'daily_vaccinations');

      const ageGroup = (minAge.value !== null || maxAge.value !== null) ?
        ` (${minAge.value !== null ? minAge.value : 0}–${maxAge.value !== null ? maxAge.value : 100}-v.)` : undefined;
      const categoryLabel = `${ageGroup || ''}`;

      editedEvents.push({
        category: categoryLabel,
        label: `${categoryLabel} (${rate.value} ${rate.unit})`,
        value: rate.value,
        date: element.date,
        id: element.id,
        type: element.type,
        color: '#009999',
        marker: '&#x2771;',
        markerColor: '#ffffff',
      });

      eventCategories.push(categoryLabel);
  });

  // create a list of unique event categories by label
  const uniqueCategories = Array.from(new Set(eventCategories)).sort();
  const categorizedEvents = [];
  uniqueCategories.forEach((cat) => {
    const category = editedEvents.filter((event) => event.category === cat);
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
        label: `${amount.value} ${amount.unit}`,
        amount: amount.value,
        date: element.date,
        id: element.id,
        type: element.type,
        marker: '&#x273A;',
        markerColor: '#33aa33',
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

  // based on its parameters create a category label for each event
  testingEvents.forEach((element) => {
      let strength = 0;

      if (element.type === 'TEST_ONLY_SEVERE_SYMPTOMS') strength = element.parameters[0]?.value/2
        else if (element.type === 'TEST_ALL_WITH_SYMPTOMS') strength = 50
        else if (element.type === 'TEST_WITH_CONTACT_TRACING') strength = 50 + element.parameters[0]?.value/2;

      editedEvents.push({
        category: element.description,
        label: `${element.description} ${element.parameters[0]?.value} ${element.parameters[0]?.unit}`,
        value: strength,
        date: element.date,
        id: element.id,
        type: element.type,
        color: '#000099',
        marker: '&#x2771;',
        markerColor: '#ffffff',
      });
  });

  return [{
    label: 'Testing',
    events: editedEvents,
  }];
};


export {
  categorizeMobilityEvents,
  getInfectionEvents,
  categorizeTestingEvents,
  categorizeMaskEvents,
  categorizeVaccinationEvents,
};
