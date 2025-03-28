import { Container, Row, Col } from 'react-bootstrap';
import ReviewCard from './ReviewCard';

function ReviewListGrid({ type, reviews }: { type: string, reviews: any[] }) {

  let header = 'Reviews';
  
  switch (type) {
    case 'user_main': header = 'Your Review'; break;
    case 'critic': header = 'Critic Reviews'; break;
    case 'user': 
    default: header = 'Reviews'; break;
  }

  return (
    <div>
    <Container>
    <Row className="g-4 mt-1">
        <h2>{header}</h2>
        {reviews.length > 0 ? (
        reviews.map((review) => (
            <Col key={review.id} md={6}>
                <ReviewCard review={review} />
            </Col>
        ))
        ) : (
        <p>No reviews yet.</p>
        )}
    </Row>
    </Container>
    </div>
  );
}

export default ReviewListGrid;

