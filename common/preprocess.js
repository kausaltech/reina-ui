import dayjs from 'dayjs';

function getAgeGroupString(minAge, maxAge, parens=false) {
  let ageGroup;
  if (minAge.value != null || maxAge.value != null) {
    ageGroup = parens ? ' (' : '';
    if (minAge.value != null) {
      ageGroup += minAge.value;
    }
    if (maxAge.value != null) {
      ageGroup += '–' + maxAge.value;
    } else {
      ageGroup += '+';
    }
    ageGroup += '-v.';
    if (parens) ageGroup += ')';
  }
  return ageGroup;
}


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
      const ageGroup = getAgeGroupString(minAge, maxAge, true);
      const categoryLabel = `${place?.choice ? place.choice.label : ''}${ageGroup || ''}`;

      editedEvents.push({
        category: categoryLabel,
        continuous: true,
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

      const ageGroup = getAgeGroupString(minAge, maxAge, true);
      const categoryLabel = `${place?.choice ? place.choice.label : ''}${ageGroup || ''}`;

      editedEvents.push({
        category: categoryLabel,
        continuous: true,
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
      const rate = element.parameters.find((param) => param.id === 'weekly_vaccinations');

      const ageGroup = getAgeGroupString(minAge, maxAge);
      const categoryLabel = `${ageGroup || ''}`;

      editedEvents.push({
        category: categoryLabel,
        continuous: true,
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

const categorizeInfectionEvents = (events) => {
  if(!events?.length) return null;

  const infectionEvents = events.filter((element) => element.type==='IMPORT_INFECTIONS');
  const editedEvents = [];

  infectionEvents.forEach((element) => {
      const amount = element.parameters.find((param) => param.id === 'amount');
      editedEvents.push({
        category: element.description,
        continuous: false,
        label: `${amount.value} ${amount.unit}`,
        value: amount.value,
        date: element.date,
        id: element.id,
        type: element.type,
        color: '#33aa33',
        marker: '&#x273A;',
        markerColor: '#33aa33',
      });
  });

  return [{
    label: 'infections',
    events: editedEvents,
  }];
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
        continuous: true,
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
    label: 'testing',
    events: editedEvents,
  }];
};

const getEarliestDate = (events) => {
  let earliestDate = new dayjs();

  events.forEach((element) => {
    const checkDate = dayjs(element.date);
    if(checkDate.isBefore(earliestDate)) earliestDate = checkDate;
  });

  return earliestDate;
};

const getLatestDate = (events) => {
  let latestDate = new dayjs();

  events.forEach((element) => {
    const checkDate = dayjs(element.date);
    if(checkDate.isAfter(latestDate)) latestDate = checkDate;
  });

  return latestDate;
};

export {
  categorizeMobilityEvents,
  getInfectionEvents,
  categorizeTestingEvents,
  categorizeMaskEvents,
  categorizeVaccinationEvents,
  categorizeInfectionEvents,
  getEarliestDate,
  getLatestDate,
};
