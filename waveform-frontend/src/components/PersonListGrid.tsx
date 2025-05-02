import { useQuery } from '@tanstack/react-query';
import { fetchAll } from '../services/generic.ts';
import { Container, Row, Col } from 'react-bootstrap';
import BasicPersonCard from './BasicPersonCard';

interface PersonListGridProps {
  entity: string;
  list?: any[];
}

function PersonListGrid({ entity, list }: PersonListGridProps) {
  const { data: personList, isLoading, error } = useQuery({
    queryKey: [entity, 'list'],
    queryFn: () => fetchAll(entity),
    enabled: !list, 
  });

  const finalPersonList = list || personList;

  if (!list && isLoading) {
    return <div>Loading…</div>;
  }

  if (!finalPersonList || error || !Array.isArray(finalPersonList) || finalPersonList.length === 0) {
    return <div>No {entity} found.</div>;
  }

  return (
    <Container>
      <Row className="g-4">
        {finalPersonList.map((person: any) => (
          <Col xl={2} lg={3} md={4} sm={6} xs={12} key={person.id} className="card-col col-2-5">
            <BasicPersonCard person={person} entity={entity} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default PersonListGrid;
