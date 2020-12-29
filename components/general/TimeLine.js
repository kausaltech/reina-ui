import dayjs from 'dayjs';
import styled from 'styled-components';
import { transparentize } from 'polished';
import {
  Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Button
} from 'reactstrap';

const Label = styled.div`
  width: 120px;
  flex-shrink: 0;
  font-size: 14px;
  line-height: 1;
`;

const TimeLineWrapper = styled.div`
  display: flex;
  padding-bottom: 1em;

`;

const DayMarker = styled.div`
  display: inline-block;
  flex-shrink: 0;
  width: 12px;
  height: 24px;
  border: 1px solid #fff;
  background-color: ${(props) => props.strength ? transparentize(1-props.strength, 'rgba(180, 33, 66, 1)') : '#f0f0f0'};

  &:hover {
    border-color: #333;
  }

  &.first {

      border-left-width: 6px;
  }
`;

const Day = (props) => {
  const { date, event, state } = props;
  return (
    <DayMarker strength={state/100} className={date.date()===1 && 'first'}>
      { event ? <span> </span> : <span> </span>}
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

  console.log('parse data');
  while (currentDay.isBefore(endDate) && dayLimit < 600) {
    const todaysEvent = events.find((element) => element.date === dayjs(currentDay).format('YYYY-MM-DD'));
    if (todaysEvent) timeLineState = todaysEvent.reduction;

    timeLineData.push({
      date: currentDay,
      event: todaysEvent,
      state: timeLineState,
    });
    console.log('creating date');
    console.log(currentDay);
    currentDay = currentDay.add(1, 'day');
    dayLimit += 1;
  }
   
  return (
    <TimeLineWrapper>
      <Label>{ label }:</Label>
      { timeLineData.map((element) => (
        <Day
          key={element.date.valueOf()}
          date={element.date}
          event={element.event}
          state={element.state}
        />
      ))}
    </TimeLineWrapper>
  );
};

export default TimeLine;
