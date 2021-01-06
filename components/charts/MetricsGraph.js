import dynamic from 'next/dynamic';
import dayjs from 'dayjs';

// Plotly doesn't work with SSR
const DynamicPlot = dynamic(() => import('react-plotly.js'),
    { ssr: false });

const createEventBar = (eventSet, startDate, endDate, index) => {
  const firstY = -0.2;
  const barHeight = 0.05;
  const barMargin = 0.06;
  const barPosition = firstY - (barHeight + barMargin) * index;

  // box outline for the bar
  const bar =[{
    type: 'rect',
    yref: 'paper',
    x0: startDate,
    y0: barPosition,
    x1: endDate,
    y1: barPosition-barHeight,
    line: {
      color: '#e3e3e3',
      width: 1,
    }
  }];

  // category label for the bar
  const label = {
    xref: 'paper',
    yref: 'paper',
    x: 1.025,
    y: barPosition - barHeight,
    showarrow: false,
    text: eventSet.label,
    xanchor: 'left',
    yanchor: 'bottom',
    yshift: -4,
  };

  // bar segments
  eventSet.events.forEach((event, idx) => {
    const opacity = event.value/100;
    let end = endDate;
    if (eventSet.events.length > idx + 1) end = eventSet.events[idx+1].date;
  
    bar.push({
      type: 'rect',
      xref:'x',
      yref:'paper',
      x0: event.date,
      y0: barPosition,
      x1: end,
      y1: barPosition-barHeight,
      fillcolor: event.color,
      opacity: opacity,
      line: {
        width: 0,
      }
    })
  })
  return { bar: bar, label: label };
};

function MetricsGraph(props) {
  const { dailyMetrics, shownMetrics, title, validationMetrics, events } = props;
  const { metrics } = dailyMetrics;

  let metricsByType = new Map(metrics.map(m => [m.type, {metric: m, dates: dailyMetrics.dates}]));

  if (typeof validationMetrics !== 'undefined' && validationMetrics.metrics){
    validationMetrics.metrics.forEach((m) => {
      metricsByType.set(m.type, {metric: m, dates: validationMetrics.dates});
    });
  }

  let traces = shownMetrics.map((m) => {
    const metaMetric = metricsByType.get(m.type);
    if (!metaMetric) {
      throw new Error(`Unsupported metric: ${m.type}`)
    }
    const { metric, dates } = metaMetric;
    const values = metric.isInteger ? metric.intValues : metric.floatValues;
    const mode = metric.isSimulated ? 'lines': 'markers';
    // const unitStr = metric.unit ? ` ${metric.unit}` : '';
    const unitStr = '';

    return {
      y: values,
      x: dates,
      type: 'scatter',
      mode: mode,
      marker: {
        color: metric.color,
      },
      hovertemplate: metric.isInteger ? `%{y}${unitStr}` : `%{y:.2f}${unitStr}`,
      name: metric.label,
      visible: m.visible,
    };
  });

  let annotations = [];
  let shapes = [];
  let barCount = 0;
  let barIndex = 0;

  // create a horizontal bar graph for each event
  events?.forEach((group) => {
    barCount += group.categories ? group.categories.length : 0;
    if (barCount > 0) 
      group.categories.forEach((category) => {
        const newBar = createEventBar(category, dailyMetrics.dates[0], dailyMetrics.dates[dailyMetrics.dates.length-1], barIndex);
        shapes = shapes.concat(newBar.bar);
        annotations.push(newBar.label);
        barIndex += 1;
      });
  });

  const todaymarker =
    {
      type: 'line',
      yref: 'paper',
      x0: new dayjs().format('YYYY-MM-DD'),
      y0: barCount * -0.3,
      x1: new dayjs().format('YYYY-MM-DD'),
      y1: 1,
      line: {
        color: '#999999',
        width: 2,
        dash: "dot",
      }
    };

  shapes.push(todaymarker);

  const layout = {
    height: 300 + barCount * 25,
    margin: {
      t: 24,
      r: 200,
      b: 48 + barCount * 25,
    },
    autosize: true,
    font: {
      family: 'Inter',
    },
    shapes,
    annotations,
  }

  return (
    <div>
      <h4>{title}</h4>
      <DynamicPlot
          data={ traces }
          layout={ layout }
          useResizeHandler={ true }
          style={ {width: "100%"} }
      />
    </div>
  );
}

export default MetricsGraph;
