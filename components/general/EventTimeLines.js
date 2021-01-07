import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import styled from 'styled-components';
import { useTranslation } from 'i18n';
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
  const { t } = useTranslation(['common']);

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
        { infectionEvents?.length > 0 &&
          <TimeLineGroup>
            <TimeLineGroupHeader>{ t('new-infections') }</TimeLineGroupHeader>
            <TimeLine 
              startDate={startDate}
              endDate={endDate}
              events={infectionEvents ? infectionEvents : []}
              label={t('new-infections')}
            />
          </TimeLineGroup>
        }
        { mobilityEvents?.length > 0 &&
          <TimeLineGroup>
          <TimeLineGroupHeader>{ t('limit-mobility') }</TimeLineGroupHeader>
            { mobilityEvents?.map((category) => (
              <TimeLine 
                startDate={startDate}
                endDate={endDate}
                events={category.events}
                label={t(category.label)}
                key={category.label}
              />
            ))}
          </TimeLineGroup>
        }
        { maskEvents?.length > 0 &&
          <TimeLineGroup>
            <TimeLineGroupHeader>{ t('wearing-masks') }</TimeLineGroupHeader>
            { maskEvents?.map((category) => (
              <TimeLine 
                startDate={startDate}
                endDate={endDate}
                events={category.events}
                label={t(category.label)}
                key={category.label}
              />
            ))}
          </TimeLineGroup>
        }
        { testingEvents?.length > 0 &&
          <TimeLineGroup>
            <TimeLineGroupHeader>{ t('testing') }</TimeLineGroupHeader>
              <TimeLine 
                startDate={startDate}
                endDate={endDate}
                events={testingEvents[0].events}
                label={t(testingEvents[0].label)}
              />
          </TimeLineGroup>
        }
        { vaccinationEvents?.length > 0 &&
          <TimeLineGroup>
            <TimeLineGroupHeader>{ t('vaccinations') }</TimeLineGroupHeader>
            { vaccinationEvents?.map((category) => (
              <TimeLine 
                startDate={startDate}
                endDate={endDate}
                events={category.events}
                label={t(category.label)}
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
