import styled from 'styled-components';
import { useTranslation } from 'i18n';
import dayjs from 'dayjs';
import { Table, Button } from 'reactstrap';

const HeaderCell = styled.th`
  ${({ small }) => small && `
    width: 32px;
  `}
  ${({ medium }) => medium && `
    width: 120px;
  `}
  ${({ numeric }) => numeric && `
    text-align: right;
  `}
`;

const EventRow = styled.tr`
  background-color: ${(props) => props.theme.themeColors.light};
`;

const TableCell = styled.td`
  &.ImportInfectionsIntervention {
    color: ${(props) => props.theme.themeColors.white};
    background-color: ${(props) => props.theme.graphColors.red070};
  }

  &.TestingStrategyIntervention {
    background-color: ${(props) => props.theme.graphColors.blue010};
  }

  &.LimitMobilityIntervention {
    background-color: ${(props) => props.theme.graphColors.red030};
  }

  &.HealthcareCapacityIntervention {
    background-color: ${(props) => props.theme.graphColors.blue030};
  }

  ${({ numeric }) => numeric && `
    text-align: right;
  `}
`;

const displayIntervention = (intervention) => {
  const { t } = useTranslation(['common']);

  let formattedIntervention = {
    id: intervention.id,
    date: intervention.date,
    displayDate: dayjs(intervention.date).format('DD.MM.YY'),
    type: intervention.__typename,
  };

  switch(formattedIntervention.type) {
    case 'ImportInfectionsIntervention':
      formattedIntervention.name = t(intervention.__typename); 
      formattedIntervention.displayValue = intervention.amount;
      formattedIntervention.unit = 'infections';
    break;
    case 'TestingStrategyIntervention': 
      formattedIntervention.name = `${t(intervention.__typename)}: ${t(intervention.strategy)}`;
      formattedIntervention.displayValue = intervention.efficiency;
      formattedIntervention.unit = '';
    break;
    case 'LimitMobilityIntervention': 
      formattedIntervention.name = `${t(intervention.__typename)} (${t(intervention.minAge)} - ${t(intervention.maxAge)})`; 
      formattedIntervention.displayValue = intervention.value;
      formattedIntervention.unit = '%';
    break;
    default:
      formattedIntervention.name = 'Unknown intervention'; 
      formattedIntervention.displayValue = '';
      formattedIntervention.unit = '';
  }

  return formattedIntervention;
}

const InterventionList = (props) => {
  const { interventions:rawInterventions } = props;
  let interventions;

  if (rawInterventions) {
    interventions = rawInterventions.map((intervention)=>displayIntervention(intervention));
    interventions.sort((a, b) => (a.date > b.date) ? 1 : -1);
  }
  
  return (
    <Table hover size="sm">
      <thead>
        <tr>
          <HeaderCell small={true}></HeaderCell>
          <HeaderCell medium={true} numeric>Date</HeaderCell>
          <HeaderCell small={true}></HeaderCell>
          <HeaderCell>Event</HeaderCell>
          <HeaderCell small={true} numeric>Value</HeaderCell>
          <HeaderCell medium={true}></HeaderCell>
        </tr>
        </thead>
        <tbody>
          { interventions && interventions.map((intervention) =>
          <EventRow key={intervention.id}>
            <TableCell><Button close /></TableCell>
            <TableCell numeric>{ intervention.displayDate }</TableCell>
            <TableCell className={intervention.type}></TableCell>
            <TableCell>{ intervention.name }</TableCell>
            <TableCell numeric>{ intervention.displayValue }</TableCell>
            <TableCell>{ intervention.unit }</TableCell>
          </EventRow> )}
        </tbody>
    </Table>
  );
};

export default InterventionList;
