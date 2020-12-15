import dynamic from 'next/dynamic';

// Plotly doesn't work with SSR
const DynamicPlot = dynamic(() => import('react-plotly.js'),
    { ssr: false });


function MetricsGraph(props) {
  const { dailyMetrics, shownMetrics, title, validationMetrics } = props;
  const { dates, metrics } = dailyMetrics;

  let metricsByType = new Map(metrics.map(m => [m.type, m]));
  if(typeof validationMetrics !== 'undefined' && validationMetrics.metrics){
    const valMetricsByType = new Map(validationMetrics.metrics.map(m => [m.type, m]));
    metricsByType = new Map([...metricsByType, ...valMetricsByType])
  }

  let traces = shownMetrics.map((m) => {
    const metric = metricsByType.get(m.type);
    if (!metric) {
      throw new Error(`Unsupported metric: ${m.type}`)
    }
    const values = metric.isInteger ? metric.intValues : metric.floatValues;
    const mode = metric.isSimulated ? 'lines': 'markers';

    return {
      y: values,
      x: dates,
      type: 'scatter',
      mode: mode,
      marker: {
        color: metric.color,
      },
      name: metric.label,
      visible: m.visible,
    };
  });

  return (
    <div>
      <DynamicPlot
          data={ traces }
          layout={ {title, autosize: true} }
          useResizeHandler={ true }
          style={ {width: "100%"} }
      />
    </div>
  );
}

export default MetricsGraph;
