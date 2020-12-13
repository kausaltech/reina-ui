import Head from 'next/head';
import { gql, useQuery, useMutation } from "@apollo/client";
import { useTranslation } from '../i18n';
import SimulationResults from 'components/SimulationResults';
import Layout from 'components/Layout';


const START_SIMULATION = gql`
  mutation {
    runSimulation {
      runId
    }
  }
`;


export default function Home() {
  const { t, i18n } = useTranslation(['common']);

  const [
    runSimulation,
    { loading, error, data }
  ] = useMutation(START_SIMULATION);

  runSimulation();

  if (loading || !data) {
    return <div>Spinner</div>
  }

  const runId = data.runSimulation.runId;

  return (
    <Layout>
      <Head>
        <title>REINA - Front page</title>
      </Head>
      <SimulationResults runId={runId} />
    </Layout>
  )
}

Home.getInitialProps = async () => ({
  namespacesRequired: ['common'],
})
