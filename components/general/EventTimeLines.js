import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import styled from 'styled-components';
import TimeLine from 'components/general/TimeLine';
import { categorizeMobilityEvents, getInfectionEvents, categorizeTestingEvents } from 'common/preprocess';

dayjs.extend(isSameOrBefore);

const TimeLines = styled.div`
  overflow-x: auto;
  overscroll-behavior-x: contain;
  padding-bottom: .5rem;
  background-color: #fff;
`;

const TimeLineGroup = styled.div`
  border-bottom: solid 1px #efefef;
  margin-bottom: .5rem;
  width: auto;
`;

const MonthsWrapper = styled.div`
  display: flex;
  margin-bottom: .5rem;
`;

const LabelSpace = styled.div`
  flex-shrink: 0;
  width: 120px;
`;

const MonthHeader = styled.div`
  flex-shrink: 0;
  font-size: 14px;
  //border-left: 6px solid #fff;
  width: ${(props) => props.width + 4}px;
`;

const Months = ({months}) => {
  return (
    <MonthsWrapper>
      <LabelSpace />
    { months.map((month) => (
      <MonthHeader width={month.monthLength * 13} key={month.monthName}>
        {month.monthName}
      </MonthHeader>
    ))}
    </MonthsWrapper>
  )
};

const EventTimeLines = (props) => {
  const { startDate, endDate, events } = props;

  const startDay = dayjs(startDate);
  const endDay = dayjs(endDate);
 
  const monthData = [];
  let currentDay = dayjs(startDate);
  let currentMonth = currentDay.format('MMM YYYY');
  let dayCount = 0;
  let dayLimit = 0;

  while (currentDay.isSameOrBefore(endDate) && dayLimit <= 600) {
    if(currentDay.date() == 1 || currentDay.isSame(endDate) || dayLimit == 600) {
      monthData.push({
        monthName: currentMonth,
        monthLength: dayCount,
      });
      dayCount = 0;
      currentMonth = currentDay.format('MMM YYYY');
    }
    currentDay = currentDay.add(1, 'day');
    dayCount += 1;
    dayLimit += 1;
  }
  console.log(events);

  const infectionEvents = getInfectionEvents(events);
  const mobilityEvents = categorizeMobilityEvents(events);
  const testingEvents = categorizeTestingEvents(events);

  return (
    <TimeLines>
      <Months months={monthData} />
      <TimeLineGroup>
        <TimeLine 
          startDate={startDate}
          endDate={endDate}
          events={infectionEvents ? infectionEvents : []}
          label="New infections"
        />
      </TimeLineGroup>
      <TimeLineGroup>
      { mobilityEvents?.map((category) => (
        <TimeLine 
          startDate={startDate}
          endDate={endDate}
          events={category.events}
          label={category.label}
          key={category.label}
        />
      ))}
      </TimeLineGroup>
      <TimeLineGroup>
      { testingEvents?.map((category) => (
        <TimeLine 
          startDate={startDate}
          endDate={endDate}
          events={category.events}
          label={category.label}
          key={category.label}
        />
      ))}
      </TimeLineGroup>
    </TimeLines>
  );
};

export default EventTimeLines;
