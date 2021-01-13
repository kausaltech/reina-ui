
import styled from 'styled-components';
import { gql, useMutation } from "@apollo/client";
import { CustomInput, Button } from 'reactstrap';
import { useTranslation } from 'i18n';

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

const ScenarioSelector = (props) => {
  const { handleUpdate } = props;
  const { t } = useTranslation(['common']);

  const [resetEvents] = useMutation(RESET_EVENTS, {
    onCompleted({data}) {
      handleUpdate();
    }
  });

  return (
    <div>
      <CustomInput
        type="select"
        id="select-scenario"
        defaultValue="default"
      >
        <option value="default">{ t('default') }</option>
      </CustomInput>
      <ButtonToolbar>
        <Button size="sm" color="danger" className="mb-3 mr-3" onClick={resetEvents}>{ t('reset') }</Button>
      </ButtonToolbar>
    </div>
  );
};

export default ScenarioSelector;
