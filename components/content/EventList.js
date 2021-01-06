import styled from 'styled-components';
import dayjs from 'dayjs';
import { gql, useMutation } from "@apollo/client";
import { Table, Button, UncontrolledCollapse, Spinner } from 'reactstrap';

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
      { parameters.filter(param => param.__typename === 'EventIntParameter' && param.value !== null)
        .map(
          (param) => <DisplayParameter key={param.id}>{param.value} <span className="unit">{param.unit}</span></DisplayParameter>
        )
      }
    </>
  )
};

const DisplayChoiceParameters = (props) => {
  const { parameters } = props;
  return (
    <>
      { parameters.filter(param => param.__typename === 'EventChoiceParameter' && param.choice !== null)
        .map(
          (param) => <span key={param.id}> ({param.choice.label})</span>
        )}
    </>
  )
};

const DELETE_EVENT = gql`
  mutation DeleteEvent($id: ID!) {
    deleteEvent(eventId: $id) {
      ok
    }
  }
`;

const EventRow = (props) => {
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

const EventList = (props) => {
  const { events, updateList, loading } = props;
  const today = new Date();

  const [deleteEvent] = useMutation(DELETE_EVENT, {
    onCompleted({data}) {
      updateList();
      //console.log(`Event deleted`);
    }
  });

  const handleDelete = (id, evt) => {
    deleteEvent({variables: { id }});
  };

  let pastEvents = [];
  let futureEvents = [];

  if (events) {
    pastEvents = events
      .filter((event) => dayjs(event.date) < today )
      .sort((a, b) => (a.date > b.date) ? 1 : -1);
    futureEvents = events
      .filter((event) => dayjs(event.date) >= today )
      .sort((a, b) => (a.date > b.date) ? 1 : -1);
  }

  return (
    <div>
      { loading ?
        <div className="d-flex justify-content-center align-items-center w-100 my-5"><div><Spinner type="grow" color="secondary" /></div></div>
        : (
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
                <a href="#pastToggler">Past events ({ pastEvents.length })</a>
              </th>
            </tr>
          </tbody>
          <UncontrolledCollapse toggler="#pastToggler" tag="tbody" defaultOpen={false}>
            { pastEvents && pastEvents.map((event) =>
              <EventRow event={event} handleDelete={handleDelete} key={event.id} />
            )}
          </UncontrolledCollapse>
          <tbody>
            <tr>
              <th colSpan="2">+</th>
              <th colSpan="3" id="futureToggler">
                <a href="#futureToggler">Future events ({ futureEvents.length })</a>
              </th>
            </tr>
          </tbody>
          <UncontrolledCollapse toggler="#futureToggler" tag="tbody" defaultOpen={true}>
            { futureEvents && futureEvents.map((event) =>
              <EventRow event={event} handleDelete={handleDelete} key={event.id} />
            )}
          </UncontrolledCollapse>
        </Table>
        )}
    </div>
  );
};

export default EventList;
