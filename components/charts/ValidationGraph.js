import React from 'react';
import dynamic from 'next/dynamic';

// Plotly doesn't work with SSR
const DynamicPlot = dynamic(() => import('react-plotly.js'),
    { ssr: false });

class ValidationGraph extends React.Component {
  render() {

    let metrics = this.props.dailyMetrics.metrics;

    //console.log(metrics)
    let baseData = [
        {
            y: metrics.find(m => m.id == 'available_hospital_beds').values,
            name:'All detected',
            marker: {color: 'yellow'},
        },
        {
            y: metrics.find(m => m.id == 'hospitalized').values,
            name:'Hospitalized',
            marker: {color: 'orange'},
        },
        {
            y: metrics.find(m => m.id == 'in_icu').values,
            name:'In ICU',
            marker: {color: 'red'},
        },
        {
            y: metrics.find(m => m.id == 'dead').values,
            name:'Dead',
            marker: {color: 'indigo'},
        },
    ]

    let dates = this.props.dailyMetrics.dates;
    let toTraces = function(baseData) {
      return baseData.map((value) => {
        return {
          ...value,
          x: dates,
          type: 'scatter',
          mode: 'lines',
        };
      });
    };

    return (
        <div>
        <DynamicPlot
            data={ toTraces(baseData) }
            layout={ {title: 'Validation', autosize: true} }
            useResizeHandler={ true }
            style={ {width: "100%"} }
        />
        </div>
    );
  }
}

export default ValidationGraph;