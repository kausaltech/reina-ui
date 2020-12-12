import Head from 'next/head';
import { Container, Row, Col } from 'reactstrap';
import Layout from 'components/Layout';
import KeyIndicator from 'components/content/KeyIndicator';

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>REINA - Front page</title>
      </Head>
      <Container className="mt-4">
        <Row className="mx-2">
          <Col md="4" className="px-2">
              <KeyIndicator
                title="Restriction Day Index"
                value="155"
                info="The cumulative sum of daily percentages of mobility restrictions. The index can be used as a rough indicator of harmful psychological, social and economic effects. A higher index means more severe effects."
              />
          </Col>
          <Col md="4" className="px-2">
              <KeyIndicator
                title="Restriction Day Index"
                value="155"
                info="The cumulative sum of daily percentages of mobility restrictions. The index can be used as a rough indicator of harmful psychological, social and economic effects. A higher index means more severe effects."
              />
          </Col>
          <Col md="4" className="px-2">
              <KeyIndicator
                title="Restriction Day Index"
                value="155"
                info="The cumulative sum of daily percentages of mobility restrictions. The index can be used as a rough indicator of harmful psychological, social and economic effects. A higher index means more severe effects."
              />
          </Col>
        </Row>
      </Container>
      
    </Layout>
  )
}
