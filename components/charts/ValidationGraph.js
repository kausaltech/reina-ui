import dynamic from 'next/dynamic';
import { useTranslation } from 'i18n';
import MetricsGraph from './MetricsGraph'

// Plotly doesn't work with SSR
const DynamicPlot = dynamic(() => import('react-plotly.js'),
    { ssr: false });

function ValidationGraph(props) {
  const { dailyMetrics, validationMetrics } = props;
  const { t } = useTranslation(['common']);

  const shownMetrics = [
    { type: 'ALL_DETECTED', visible: 'legendonly', rightY: true },
    { type: 'DETECTED', },
    { type: 'IN_WARD', },
    { type: 'IN_ICU', },
    { type: 'DEAD', },
  ]
  return <MetricsGraph dailyMetrics={dailyMetrics}
            shownMetrics={shownMetrics}
            validationMetrics={validationMetrics}
            title={t('validation')} />
}

export default ValidationGraph;
