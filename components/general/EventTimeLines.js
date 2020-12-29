import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import styled from 'styled-components';
import TimeLine from 'components/general/TimeLine';

dayjs.extend(isSameOrBefore);

const TimeLines = styled.div`
  overflow-x: auto;
  padding-bottom: 1rem;
  background-color: #ccccee;
`;

const MonthsWrapper = styled.div`
  display: flex;
`;

const MonthHeader = styled.div`
  flex-shrink: 0;
  border-left: 6px solid #fff;
  padding-left: 6px;
  width: ${(props) => props.width}px;
`;

const Months = ({months}) => {
  return (
    <MonthsWrapper>
    { months.map((month) => (
      <MonthHeader width={month.monthLength * 16}>
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

  while (currentDay.isSameOrBefore(endDate) && dayLimit <= 200) {
    if(currentDay.date() == 1 || currentDay.isSame(endDate) || dayLimit == 200) {
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

  return (
    <TimeLines>
      <Months months={monthData} />
      <TimeLine 
        startDate={startDate}
        endDate={endDate}
        events={[]}
      />
    </TimeLines>
  );
};

export default EventTimeLines;
