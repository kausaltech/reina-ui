import Head from 'next/head';
import { gql, useQuery, useMutation } from "@apollo/client";
import { Spinner } from 'reactstrap';
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

  if (error) {
    console.log(error);
    return <div>Erroorrr in starting simulation</div>
  }

  if (loading || !data) {
    return <div className="d-flex justify-content-center align-items-center vw-100 vh-100"><div><Spinner style={{ width: '3rem', height: '3rem' }} /></div></div>
  }

  console.log('got data', data);
  const runId = data.runSimulation.runId;

  return (
    <Layout>
      <Head>
        <title>REINA</title>
      </Head>
      <SimulationResults runId={runId} />
    </Layout>
  )
}

Home.getInitialProps = async () => ({
  namespacesRequired: ['common'],
})
