import Head from 'next/head';
import { useTranslation } from '../i18n';
import { Container, Row, Col } from 'reactstrap';
import Layout from 'components/Layout';
import InterventionList from 'components/content/InterventionList';

const interventions = [
  { id: 1,
    date: "2020-02-20",
    eventType: "import_infections",
    eventName: "Import infections",
    value: "5",
    unit: "infections",
  },
  { id: 2,
    date: "2020-02-20",
    eventType: "test_symptomatic",
    eventName: "Test all with symptoms",
    value: "",
    unit: "",
  },
  { id: 3,
    date: "2020-02-20",
    eventType: "test_and_trace",
    eventName: "Test all with symptoms and perform contact tracing with given accuracy",
    value: "",
    unit: "",
  },
  { id: 3,
    date: "2020-02-20",
    eventType: "test_severe",
    eventName: "Test people only with severe symptoms, given percentage of mild cases are detected",
    value: "",
    unit: "",
  },
  { id: 3,
    date: "2020-02-20",
    eventType: "limit_mobility",
    eventName: "Limit population mobility",
    value: "50",
    unit: "%",
  },
  { id: 3,
    date: "2020-02-20",
    eventType: "build_hospital_beds",
    eventName: "Build new hospital beds",
    value: "55",
    unit: "units",
  },
  { id: 3,
    date: "2020-02-20",
    eventType: "build_icu_units",
    eventName: "Build new ICU units",
    value: "25",
    unit: "units",
  },
];

export default function Events() {
  const { t, i18n } = useTranslation(['common']);

  return (
    <Layout>
      <Head>
        <title>REINA - Front page</title>
      </Head>
      <Container className="mt-4">
        <Row className="mx-2">
          <Col>
            <InterventionList interventions={interventions}/>
          </Col>
        </Row>
      </Container>
      
    </Layout>
  )
}

Events.getInitialProps = async () => ({
  namespacesRequired: ['common'],
})
