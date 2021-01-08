
import styled from 'styled-components';
import { gql, useMutation } from "@apollo/client";
import { CustomInput, Button } from 'reactstrap';
import { useTranslation } from 'i18n';
import DashCard from 'components/general/DashCard'

const ButtonToolbar = styled.div`
  display: flex;
  padding: 1rem 0;
`;

const RESET_EVENTS = gql`
  mutation ResetVariables {
    resetVariables {
      ok
    }
  }
`;

const ScenariosHeader = (props) => {
  const { handleUpdate } = props;
  const { t } = useTranslation(['common']);

  const [resetEvents] = useMutation(RESET_EVENTS, {
    onCompleted({data}) {
      handleUpdate();
    }
  });

  return (
    <DashCard className="shadow-lg">
      <h3>{ t('scenario') }</h3>
      <CustomInput
        type="select"
        id="select-scenario"
      >
        <option value="default" selected>{ t('default') }</option>
      </CustomInput>
      <ButtonToolbar>
        <Button size="sm" color="danger" className="mb-3 mr-3" onClick={resetEvents}>{ t('reset') }</Button>
      </ButtonToolbar>
    </DashCard>
  );
};

export default ScenariosHeader;
