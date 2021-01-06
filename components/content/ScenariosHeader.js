
import styled from 'styled-components';
import { gql, useMutation } from "@apollo/client";
import { CustomInput, Button } from 'reactstrap';
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

  const [resetEvents] = useMutation(RESET_EVENTS, {
    onCompleted({data}) {
      handleUpdate();
    }
  });

  return (
    <DashCard className="shadow-lg">
      <h3>Scenario</h3>
      <CustomInput
        type="select"
      >
        <option value="new" disabled>Empty</option>
        <option value="default" selected>Default</option>
      </CustomInput>
      <ButtonToolbar>
        <Button size="sm" color="danger" className="mb-3 mr-3" onClick={resetEvents}>Reset</Button>
        <Button size="sm" className="mb-3 mr-3" onClick={resetEvents} disabled>Save</Button>
        <Button size="sm" className="mb-3 mr-3" onClick={resetEvents} disabled>Save As...</Button>
      </ButtonToolbar>
    </DashCard>
  );
};

export default ScenariosHeader;
