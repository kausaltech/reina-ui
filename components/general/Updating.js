import styled from 'styled-components';
import { Spinner } from 'reactstrap';

const UpdateIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 1rem 1rem;
`;

const Updating = (props) => {
  const { children } = props;
  return (
    <UpdateIndicator>
      <Spinner type="grow" color="primary" size="sm" />
      <div className="ml-2">Updating results</div>
    </UpdateIndicator>
  );
};

export default Updating;
