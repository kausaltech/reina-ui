import { useTranslation, Link } from 'i18n';
import DashCard from 'components/general/DashCard';
import ScenarioSelector from 'components/content/ScenarioSelector';

const ScenariosHeader = (props) => {
  const { t } = useTranslation(['common']);

  return (
    <DashCard className="shadow-lg">
      <h3>{ t('scenario') }</h3>
      <ScenarioSelector />
      <Link href="/scenario">{ t('see-results') }</Link>
    </DashCard>
  );
};

export default ScenariosHeader;
