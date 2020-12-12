import {
  Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Button
} from 'reactstrap';

const DashCard = (props) => {
  const { children } = props;
  return (
    <Card className="mb-4">
      <CardBody>
        { children }
      </CardBody>
    </Card>
  );
};

export default DashCard;
