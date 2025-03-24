import { Container, Row, Col } from 'react-bootstrap';
import ReviewCard from './ReviewCard';

function ReviewListGrid({ reviews }: { reviews: any[] }) {
  return (
    <div>
    <Container>
    <Row className="g-4 m-0">
        <h2>Reviews</h2>
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

