import Head from 'next/head';
import { useTranslation } from '../i18n';
import { Container, Row, Col } from 'reactstrap';
import Layout from 'components/Layout';
import KeyIndicator from 'components/content/KeyIndicator';

export default function Home() {
  const { t, i18n } = useTranslation(['common']);

  return (
    <Layout>
      <Head>
        <title>REINA - Front page</title>
      </Head>
      <Container className="mt-4">
        <Row className="mx-2">
          <Col md="4" className="px-2">
              <KeyIndicator
                title={t("restriction-day-index")}
                value="155"
                info={t("restriction-day-index-info")}
              />
          </Col>
          <Col md="4" className="px-2">
              <KeyIndicator
                title={t("restriction-day-index")}
                value="155"
                info={t("restriction-day-index-info")}
              />
          </Col>
          <Col md="4" className="px-2">
              <KeyIndicator
                title={t("restriction-day-index")}
                value="155"
                info={t("restriction-day-index-info")}
              />
          </Col>
        </Row>
      </Container>
      
    </Layout>
  )
}

Home.getInitialProps = async () => ({
  namespacesRequired: ['common'],
})
