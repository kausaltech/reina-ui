import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import styled from 'styled-components';
import { transparentize } from 'polished';
import {
  UncontrolledTooltip
} from 'reactstrap';

dayjs.extend(isToday);

const Label = styled.div`
  width: 120px;
  margin-left: -120px;
  padding-right: 12px;
  background-color: #fff;
  flex-shrink: 0;
  position: relative;
  /* needs some js magic to make label sticky relative to parent */
  text-align: right;
  font-size: 12px;
  line-height: 1;
  height: 24px;
  overflow: hidden;
`;

const TimeLineWrapper = styled.div`
  display: flex;
  position: relative;
  padding-bottom: .5em;
  padding-left: 120px;
`;

const DayMarker = styled.div`
  display: inline-block;
  flex-shrink: 0;
  width: 12px;
  height: 24px;
  margin-right: 1px;
  text-align: center;
  background-color: ${(props) => props.strength ? transparentize(1-props.strength, props.color) : '#f0f0f0'};

  &:hover {
    box-shadow: 0 0 10px;
    z-index: 200;
  }

  &.first {
    margin-left: 4px;
  }

  &.today {
    border-left: 2px solid #990000;
    border-right: 2px solid #990000;
    margin-right: 0;
    margin-left: -1px;
  }
`;

const DayMarkerContent = styled.div`
  font-size: 16px;
  line-height: 24px;
  color: ${(props) => props.markerColor};
`;

const Day = (props) => {
  const { date, event, state, color } = props;
  let currentState = state;
  let classes = '';
  if (date.date()===1) classes +=' first';
  if (date.isToday()) classes +=' today';

  let eventMarker = '';
  let eventTooltip = '';
  if (event?.type === 'IMPORT_INFECTIONS') {
    eventMarker = <DayMarkerContent markerColor="#339966">&#x273A;</DayMarkerContent>;
    eventTooltip = <UncontrolledTooltip
      placement="top"
      target={`evt-${event.id}`}
    >
      {event.amount} {event.label}
    </UncontrolledTooltip>
  };
  if (event?.type === 'WEAR_MASKS') {
    eventMarker = <DayMarkerContent markerColor="#333333">&#x2771;</DayMarkerContent>;
    eventTooltip = <UncontrolledTooltip
      placement="top"
      target={`evt-${event.id}`}
    >
      { event.value != undefined && `${event.label} ${event.value} %` }
    </UncontrolledTooltip>
  };
  if (['TEST_ALL_WITH_SYMPTOMS','TEST_ONLY_SEVERE_SYMPTOMS','TEST_WITH_CONTACT_TRACING', 'LIMIT_MOBILITY'].includes(event?.type)) {
    eventMarker = <DayMarkerContent markerColor="#fff">&#x2771;</DayMarkerContent>;
    eventTooltip = <UncontrolledTooltip
      placement="top"
      target={`evt-${event.id}`}
    >
    { event.strength != undefined && `${event.label} ${event.strength} %` }
    { event.reduction != undefined && `${event.label} -${event.reduction} %` }
  </UncontrolledTooltip>
  };
  if (event?.type === 'VACCINATE') {
    eventMarker = <DayMarkerContent markerColor="#333333">&#x2771;</DayMarkerContent>;
    eventTooltip = <UncontrolledTooltip
      placement="top"
      target={`evt-${event.id}`}
    >
      { event.value != undefined && `${event.label} ${event.value} vaccinations/day` }
    </UncontrolledTooltip>
  };

  return (
    <DayMarker
      strength={currentState/100}
      className={classes}
      color={color}
      id={event && `evt-${event.id}`}
    >
      { eventMarker }
      { eventTooltip }
    </DayMarker>
  );
};

const TimeLine = (props) => {
  const { startDate, endDate, events, label } = props;

  const startDay = dayjs(startDate);
  const endDay = dayjs(endDate);

  if (!startDay.isValid() || !endDay.isValid()) {
    return <div>ERROR</div>
  }

  const timeLineData = [];
  let currentDay = dayjs(startDate);
  let timeLineState = 0;
  let dayLimit = 0;
  let eventColor = '#efefef';

  //console.log('parse data');
  while (currentDay.isBefore(endDate) && dayLimit < 600) {
    const todaysEvent = events?.find((element) => element.date === dayjs(currentDay).format('YYYY-MM-DD'));

    if (todaysEvent?.type === 'LIMIT_MOBILITY') {
      timeLineState = todaysEvent.reduction;
      eventColor = '#993300';
    }
    if (['TEST_ALL_WITH_SYMPTOMS','TEST_ONLY_SEVERE_SYMPTOMS','TEST_WITH_CONTACT_TRACING', 'VACCINATE'].includes(todaysEvent?.type)) {
      if (['TEST_ALL_WITH_SYMPTOMS', 'VACCINATE'].includes(todaysEvent.type)) timeLineState = 50;
        else timeLineState = todaysEvent.strength;
      eventColor = '#224499';
    }
    if (todaysEvent?.type === 'IMPORT_INFECTIONS') {
      timeLineState = 0;
      eventColor = '#339966';
    }
    if (todaysEvent?.type === 'WEAR_MASKS') {
      timeLineState = todaysEvent.value;
      eventColor = '#333333';
    }

    timeLineData.push({
      date: currentDay,
      event: todaysEvent,
      state: timeLineState,
      color: eventColor,
    });
    //console.log('creating date');
    //console.log(currentDay);
    currentDay = currentDay.add(1, 'day');
    dayLimit += 1;
  }

  return (
    <TimeLineWrapper>
      <Label>{ label }</Label>
      { timeLineData.map((element) => (
        <Day
          key={element.date.valueOf()}
          date={element.date}
          event={element.event}
          state={element.state}
          color={element.color}
        />
      ))}
    </TimeLineWrapper>
  );
};

export default TimeLine;
