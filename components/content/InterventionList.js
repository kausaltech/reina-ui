import styled from 'styled-components';
import dayjs from 'dayjs';
import { gql, useMutation } from "@apollo/client";
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

  &.BUILD_NEW_ICU_UNITS, &.BUILD_NEW_HOSPITAL_BEDS  {
    background-color: ${(props) => props.theme.graphColors.blue030};
  }

  ${({ numeric }) => numeric && `
    text-align: right;
  `}
`;

const DisplayParameter = styled.span`
  margin-left: .5em;

  .unit {
    opacity: 0.5;
  }
`;

// TODO: Handle displaying special case values ie. (min_age-max_age)
const DisplayValueParameters = (props) => {
  const { parameters } = props;
  return (
    <>
      { parameters.map((param) => param.__typename === 'InterventionIntParameter' && <DisplayParameter key={param.id} >{param.value} <span className="unit">{param.unit}</span></DisplayParameter>)}
    </>
  )
};

const DisplayChoiceParameters = (props) => {
  const { parameters } = props;
  return (
    <>
      { parameters.map((param) => param.__typename === 'InterventionChoiceParameter' && <span key={param.id}> ({param.choice.label})</span>)}
    </>
  )
};

const DELETE_INTERVENTION = gql`
  mutation DeleteIntervention($id: ID!) {
    deleteIntervention(interventionId: $id) {
      ok
    }
  }
`;

const RESET_INTERVENTIONS = gql`
  mutation ResetVariables {
    resetVariables {
      ok
    }
  }
`;

const InterventionList = (props) => {
  const { interventions: rawInterventions, updateList } = props;

  const [deleteIntervention] = useMutation(DELETE_INTERVENTION, {
    onCompleted({data}) {
      //updateList();
      console.log(`Intervention deleted`);
    }
  });

  const [resetInterventions] = useMutation(RESET_INTERVENTIONS, {
    onCompleted({data}) {
      updateList();
      console.log(`Interventions reseted`);
    }
  });

  let interventions = [];

  if (rawInterventions) {
    interventions = rawInterventions.map((intervention)=>intervention);
    interventions.sort((a, b) => (a.date > b.date) ? 1 : -1);
  }

  return (
    <DashCard>
      <h5>Events</h5>
      <Button size="sm" className="float-right mb-3" onClick={resetInterventions}>Reset Scenario</Button>
      <Table hover size="sm">
        <thead>
          <tr>
            <HeaderCell small={true}></HeaderCell>
            <HeaderCell small={true}></HeaderCell>
            <HeaderCell>Event</HeaderCell>
            <HeaderCell>Value</HeaderCell>
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
              <TableCell>
                <DisplayValueParameters parameters={intervention.parameters} />
              </TableCell>
              <TableCell numeric>
                { dayjs(intervention.date).format('DD.MM.YYYY') }
              </TableCell>
            </tr> )}
          </tbody>
      </Table>
    </DashCard>
  );
};

export default InterventionList;
