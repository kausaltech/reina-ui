import styled from 'styled-components';
import dayjs from 'dayjs';
import { Link } from 'i18n';
import { gql, useMutation } from "@apollo/client";
import { Table, Button, UncontrolledCollapse } from 'reactstrap';
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

const InterventionRow = (props) => {
  const { event, handleDelete } = props;

  return (
    <tr>
      <TableCell><Button close onClick={(e) => handleDelete(event.id, e)}/></TableCell>
      <TableCell className={event.type}></TableCell>
      <TableCell>
        { event.description }
        <DisplayChoiceParameters parameters={event.parameters} />
        </TableCell>
      <TableCell>
        <DisplayValueParameters parameters={event.parameters} />
      </TableCell>
      <TableCell numeric>
        { dayjs(event.date).format('DD.MM.YYYY') }
      </TableCell>
    </tr>
  )
}

const InterventionList = (props) => {
  const { interventions, updateList } = props;
  const today = new Date();

  const [deleteIntervention] = useMutation(DELETE_INTERVENTION, {
    onCompleted({data}) {
      updateList();
      //console.log(`Intervention deleted`);
    }
  });

  const [resetInterventions] = useMutation(RESET_INTERVENTIONS, {
    onCompleted({data}) {
      updateList();
      //console.log(`Interventions reseted`);
    }
  });

  const handleDelete = (id, evt) => {
    deleteIntervention({variables: { id }});
  };

  let pastInterventions = [];
  let futureInterventions = [];

  if (interventions) {
    pastInterventions = interventions
      .filter((intervention) => dayjs(intervention.date) < today )
      .sort((a, b) => (a.date > b.date) ? 1 : -1);
    futureInterventions = interventions
      .filter((intervention) => dayjs(intervention.date) >= today )
      .sort((a, b) => (a.date > b.date) ? 1 : -1);
  }

  return (
    <DashCard>
      <h3>Scenario</h3>
      <Link href="/">See outcome</Link>
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
          <tr>
            <th colSpan="2">+</th>
            <th colSpan="3" id="pastToggler">
              <a href="#pastToggler">Past events ({ pastInterventions.length })</a>
            </th>
          </tr>
        </tbody>
        <UncontrolledCollapse toggler="#pastToggler" tag="tbody" defaultOpen={false}>
          { pastInterventions && pastInterventions.map((intervention) =>
            <InterventionRow event={intervention} handleDelete={handleDelete} key={intervention.id} />
          )}
        </UncontrolledCollapse>
        <tbody>
          <tr>
            <th colSpan="2">+</th>
            <th colSpan="3" id="futureToggler">
              <a href="#futureToggler">Future events ({ futureInterventions.length })</a>
            </th>
          </tr>
        </tbody>
        <UncontrolledCollapse toggler="#futureToggler" tag="tbody" defaultOpen={true}>
          { futureInterventions && futureInterventions.map((intervention) =>
            <InterventionRow event={intervention} handleDelete={handleDelete} key={intervention.id} />
          )}
        </UncontrolledCollapse>
      </Table>
    </DashCard>
  );
};

export default InterventionList;
