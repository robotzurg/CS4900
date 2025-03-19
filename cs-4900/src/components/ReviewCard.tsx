import { Container, Col } from 'react-bootstrap';

function ReviewCard({ review }: { review: any }) {
  return (
    <Container className="mt-4 review-card">
        <Col className="d-flex flex-column justify-content-center">
            <h2><strong>{review.user_id}</strong></h2>
            <p>
                {review.review_text}
            </p>
        </Col>
      </Container>
  );
}

export default ReviewCard;