import React from 'react';
//import Plot from 'react-plotly.js';
import dynamic from 'next/dynamic';

// Plotly doesn't work with SSR
const DynamicPlot = dynamic(() => import('react-plotly.js'),
    { ssr: false });

class PopulationGraph extends React.Component {
  render() {
    /*
    // This is actually not useful at the moment - PopulationGraph
    // is not created except when data is at ready. The problem
    // is that rendering graph takes a while, and at that time
    // there is nothing to show the graph is loading. Do add solution if
    // you find one.

    let ssrMode = typeof window === "undefined";
    let dataNotLoaded = this.props.dailyMetrics === "undefined";
    console.log("ssrmode", ssrMode)
    console.log("dataNotLoaded", dataNotLoaded, this.props.dailyMetrics)
    if (ssrMode || dataNotLoaded) {
      return (
        <div style={{background: "white", width: "100%"}}>
            Loading population chart...
        </div>
      )
    }

    */
    let metrics = this.props.dailyMetrics.metrics;

    //console.log(metrics)
    let baseData = [
        {
            y: metrics.find(m => m.id == 'susceptible').values,
            name:'Susceptible',
            marker: {color: 'yellow'},
            visible: 'legendonly',
        },
        {
            y: metrics.find(m => m.id == 'infected').values,
            name:'Active infections',
            marker: {color: 'purple'},
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
        {
            y: metrics.find(m => m.id == 'recovered').values,
            name:'Recovered',
            marker: {color: 'green'},
            visible: 'legendonly',
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
            layout={ {title: 'Population', autosize: true} }
            useResizeHandler={ true }
            style={ {width: "100%"} }
        />
        </div>
    );
  }
}

export default PopulationGraph;