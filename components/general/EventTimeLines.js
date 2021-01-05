import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import styled from 'styled-components';
import TimeLine from 'components/general/TimeLine';
import {
  categorizeMobilityEvents,
  getInfectionEvents,
  categorizeTestingEvents,
  categorizeMaskEvents,
  categorizeVaccinationEvents } from 'common/preprocess';

dayjs.extend(isSameOrBefore);

const TimeLines = styled.div`
  display: flex;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  padding-bottom: .25rem;
  background-color: #fff;
`;

const TimeLineGroup = styled.div`
  margin-bottom: .5rem;
  padding-top: .25rem;
  width: auto;
  border-top: solid 1px #dddddd;
`;

const TimeLineGroupHeader = styled.h3`
  font-size: 12px;
  width: 108px;
  margin-bottom: .5rem;
  text-align: right;
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
  const maskEvents = categorizeMaskEvents(events);
  const vaccinationEvents = categorizeVaccinationEvents(events);

  return (
    <TimeLines>
      {/* extra wrapper to make container blocks stretch the full timeline, not just parent width */}
      <div>
        <Months months={monthData} />
        { infectionEvents &&
          <TimeLineGroup>
            <TimeLineGroupHeader>New infections</TimeLineGroupHeader>
            <TimeLine 
              startDate={startDate}
              endDate={endDate}
              events={infectionEvents ? infectionEvents : []}
              label="New infections"
            />
          </TimeLineGroup>
        }
        { mobilityEvents &&
          <TimeLineGroup>
          <TimeLineGroupHeader>Limit mobility</TimeLineGroupHeader>
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
        }
        { maskEvents &&
          <TimeLineGroup>
            <TimeLineGroupHeader>Wearing masks</TimeLineGroupHeader>
            { maskEvents?.map((category) => (
              <TimeLine 
                startDate={startDate}
                endDate={endDate}
                events={category.events}
                label={category.label}
                key={category.label}
              />
            ))}
          </TimeLineGroup>
        }
        { testingEvents &&
          <TimeLineGroup>
            <TimeLineGroupHeader>Testing</TimeLineGroupHeader>
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
        }
        { vaccinationEvents &&
          <TimeLineGroup>
            <TimeLineGroupHeader>Vaccination</TimeLineGroupHeader>
            { vaccinationEvents?.map((category) => (
              <TimeLine 
                startDate={startDate}
                endDate={endDate}
                events={category.events}
                label={category.label}
                key={category.label}
              />
            ))}
          </TimeLineGroup>
        }
      </div>
    </TimeLines>
  );
};

export default EventTimeLines;
