import styled from 'styled-components';
import dayjs from 'dayjs';
import { Table, Button } from 'reactstrap';
import DashCard from 'components/general/DashCard';

const HeaderCell = styled.th`
  ${({ small }) => small && `
    width: 16px;
  `}
  ${({ medium }) => medium && `
    width: 120px;
  `}
  ${({ numeric }) => numeric && `
    text-align: right;
  `}
`;

const TableCell = styled.td`
  &.IMPORT_INFECTIONS {
    color: ${(props) => props.theme.themeColors.white};
    background-color: ${(props) => props.theme.graphColors.red070};
  }

  &.TEST_ALL_WITH_SYMPTOMS, &.TEST_ONLY_SEVERE_SYMPTOMS, &.TEST_WITH_CONTACT_TRACING {
    background-color: ${(props) => props.theme.graphColors.blue010};
  }

  &.LIMIT_MOBILITY {
    background-color: ${(props) => props.theme.graphColors.red030};
  }

  &.HealthcareCapacityIntervention {
    background-color: ${(props) => props.theme.graphColors.blue030};
  }

  ${({ numeric }) => numeric && `
    text-align: right;
  `}
`;

// TODO: Handle displaying special case values ie. (min_age-max_age)
const DisplayValueParameters = (props) => {
  const { parameters } = props;
  return (
    <>
      { parameters.map((param) => param.__typename === 'InterventionIntParameter' && <div key={param.id}>{param.value} {param.unit}</div>)}
    </>
  )
};

const DisplayChoiceParameters = (props) => {
  const { parameters } = props;
  return (
    <>
      { parameters.map((param) => param.__typename === 'InterventionChoiceParameter' && <span key={param.id}>({param.label})</span>)}
    </>
  )
};

const InterventionList = (props) => {
  const { interventions: rawInterventions } = props;
  let interventions = [];

  if (rawInterventions) {
    interventions = rawInterventions.map((intervention)=>intervention);
    interventions.sort((a, b) => (a.date > b.date) ? 1 : -1);
  }

  return (
    <DashCard>
      <h5>Events</h5>
      <Table hover size="sm">
        <thead>
          <tr>
            <HeaderCell small={true}></HeaderCell>
            <HeaderCell small={true}></HeaderCell>
            <HeaderCell>Event</HeaderCell>
            <HeaderCell medium={true} numeric>Value</HeaderCell>
            <HeaderCell medium={true} numeric>Date</HeaderCell>
          </tr>
          </thead>
          <tbody>
            { interventions && interventions.map((intervention) =>
            <tr key={intervention.id}>
              <TableCell><Button close /></TableCell>
              <TableCell className={intervention.type}></TableCell>
              <TableCell>
                { intervention.description }
                <DisplayChoiceParameters parameters={intervention.parameters} />
                </TableCell>
              <TableCell numeric>
                <DisplayValueParameters parameters={intervention.parameters} />
              </TableCell>
              <TableCell numeric>
                { dayjs(intervention.date).format('DD.MM.YY') }
              </TableCell>
            </tr> )}
          </tbody>
      </Table>
    </DashCard>
  );
};

export default InterventionList;
