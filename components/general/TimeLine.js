import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import styled from 'styled-components';
import { transparentize } from 'polished';
import {
  UncontrolledTooltip
} from 'reactstrap';
import { useTranslation } from 'i18n';

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
  const { date, dayEvent, state, color } = props;
  let currentState = state;
  let classes = '';
  if (date.date()===1) classes +=' first';
  if (date.isToday()) classes +=' today';

  let eventMarker = '';
  let eventTooltip = '';
  if (dayEvent) {
    eventMarker = <DayMarkerContent markerColor={dayEvent.markerColor} dangerouslySetInnerHTML={{__html: dayEvent.marker}} />;
    eventTooltip = <UncontrolledTooltip
      placement="top"
      target={`evt-${dayEvent.id}`}
    >
      {date.format('DD.MM.YYYY')}<br/>{dayEvent.label}
    </UncontrolledTooltip>
  };

  return (
    <DayMarker
      strength={currentState/100}
      className={classes}
      color={color}
      id={dayEvent && `evt-${dayEvent.id}`}
    >
      { eventMarker }
      { eventTooltip }
    </DayMarker>
  );
};

const TimeLine = (props) => {
  const { startDate, endDate, events, label } = props;
  const { t } = useTranslation(['common']);

  const startDay = dayjs(startDate);
  const endDay = dayjs(endDate);

  if (!startDay.isValid() || !endDay.isValid()) {
    return <div>{ t('error') }</div>
  }

  const timeLineData = [];
  let currentDay = dayjs(startDate);
  let timeLineState = 0;
  let dayLimit = 0;
  let stateColor = '#efefef';

  while (currentDay.isBefore(endDate) && dayLimit < 600) {
    const todaysEvent = events?.find((element) => element.date === dayjs(currentDay).format('YYYY-MM-DD'));

    if (todaysEvent) {
      if (todaysEvent.continuous) stateColor = todaysEvent.color;
      timeLineState = todaysEvent.value;
    }

    timeLineData.push({
      date: currentDay,
      event: todaysEvent,
      state: timeLineState,
      color: stateColor,
    });
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
          dayEvent={element.event}
          state={element.state}
          color={element.color}
        />
      ))}
    </TimeLineWrapper>
  );
};

export default TimeLine;
