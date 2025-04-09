import { Container, Row, Col } from "react-bootstrap";
import BasicPersonCard from "./BasicPersonCard";

function PersonListGrid({ personList, entity }: { personList: any[], entity: string }) {

  if (!personList || personList.length === 0) {
    return (
        <div>
            <p>No {entity} found.</p>
        </div>
    );
  }

  return (
    <Container>
      <Row className="g-4">
        {personList.map((person) => (
          <Col xl={2} lg={3} md={4} sm={6} xs={12} key={person.id} className="card-col col-2-5">
            <BasicPersonCard person={person} entity={entity} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default PersonListGrid;
