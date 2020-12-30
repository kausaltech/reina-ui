import dayjs from 'dayjs';
import styled from 'styled-components';
import { transparentize } from 'polished';
import {
  Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Button
} from 'reactstrap';

const Label = styled.div`
  width: 120px;
  margin-left: -120px;
  padding-right: 6px;
  background-color: #fff;
  flex-shrink: 0;
  position: relative;
  /* needs some js magic to make label sticky relative to parent */
  text-align: right;
  font-size: 14px;
  line-height: 1;
  height: 24px;
`;

const TimeLineWrapper = styled.div`
  display: flex;
  position: relative;
  padding-bottom: 1em;
  padding-left: 120px;
`;

const DayMarker = styled.div`
  display: inline-block;
  flex-shrink: 0;
  width: 12px;
  height: 24px;
  border: 1px solid #fff;
  background-color: ${(props) => props.strength ? transparentize(1-props.strength, props.color) : '#f0f0f0'};

  &:hover {
    border-color: #333;
  }

  &.first {
    width: 18px;
    border-left-width: 6px;
  }

  span {
    color: ${(props) => props.color};
  }
`;

const Day = (props) => {
  const { date, event, state, color } = props;
  let currentState = state;

  return (
    <DayMarker
      strength={currentState/100}
      className={date.date()===1 && 'first'}
      color={color}
    >
      { event ? <span>X</span> : <span> </span>}
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
    if (['TEST_ALL_WITH_SYMPTOMS','TEST_ONLY_SEVERE_SYMPTOMS','TEST_WITH_CONTACT_TRACING'].includes(todaysEvent?.type)) {
      timeLineState = todaysEvent.strength;
      eventColor = '#224499';
    }
    if (todaysEvent?.type === 'IMPORT_INFECTIONS') {
      timeLineState = 0;
      eventColor = '#339966';
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
