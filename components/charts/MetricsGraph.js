import dynamic from 'next/dynamic';
import dayjs from 'dayjs';

// Plotly doesn't work with SSR
const DynamicPlot = dynamic(() => import('react-plotly.js'),
    { ssr: false });


function MetricsGraph(props) {
  const { dailyMetrics, shownMetrics, title, validationMetrics } = props;
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

  // Adds text annonation on current day line. Not in use for now
  const annotations = [
    {
      x: new dayjs().format('YYYY-MM-DD'),
      y: 1,
      xref: 'x',
      yref: 'paper',
      text: 'Today',
      showarrow: true,
      arrowhead: 0,
      arrowcolor: '#999999',
      ax: 0,
      ay: -15,
    }
  ];

  const shapes = [
    {
      type: 'line',
      yref: 'paper',
      x0: new dayjs().format('YYYY-MM-DD'),
      y0: 0,
      x1: new dayjs().format('YYYY-MM-DD'),
      y1: 1,
      line: {
        color: '#999999',
        width: 2,
        dash: "dot",
      }
    },
  ];

  const layout = {
    title,
    autosize: true,
    font: {
      family: 'Inter',
    },
    shapes
  }

  return (
    <div>
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
