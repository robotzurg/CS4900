import { Container, Row, Col } from 'react-bootstrap';
import ReviewCard from './ReviewCard';

function ReviewListGrid({ reviews, type='' }: { reviews: any[], type?: string }) {

  let header = '';
  
  switch (type) {
    case 'user_main': header = 'Your Review'; break;
    case 'critic': header = 'Critic Reviews'; break;
    case 'user': header = 'Reviews'; break;
    default: header = ''; break;
  }

  return (
    <div>
    <Container>
    <Row className="g-4 mt-1">
        {header !== '' && <h2>{header}</h2>}
        {reviews.length > 0 ? (
        reviews.map((review) => (
            <Col key={review.id}>
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
