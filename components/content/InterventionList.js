import styled from 'styled-components';
import { Table } from 'reactstrap';

const EventRow = styled.tr`
  background-color: ${(props) => props.theme.themeColors.light};

  &.import_infections {
    color: ${(props) => props.theme.themeColors.white};
    background-color: ${(props) => props.theme.graphColors.red070};
  }

  &.test_symptomatic, &.test_and_trace, &.test_severe {
    background-color: ${(props) => props.theme.graphColors.blue010};
  }

  &.limit_mobility {
    background-color: ${(props) => props.theme.graphColors.red030};
  }

  &.build_hospital_beds, &.build_icu_units {
    background-color: ${(props) => props.theme.graphColors.blue030};
  }
`;

const InterventionList = (props) => {
  const { interventions } = props;
  return (
    <Table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Event</th>
          <th>Value</th>
        </tr>
        </thead>
        <tbody>
          { interventions.map((intervention) =>
          <EventRow className={intervention.eventType} key={intervention.eventType}>
            <td>{ intervention.date }</td>
            <td>{ intervention.eventName }</td>
            <td>{ intervention.value }</td>
            <td>{ intervention.unit }</td>
          </EventRow> )}
        </tbody>
    </Table>
  );
};

export default InterventionList;
