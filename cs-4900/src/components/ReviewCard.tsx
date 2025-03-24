import { useEffect, useState } from "react";
import { Container, Col, Row, Image } from "react-bootstrap";
import { fetchById } from "../services/api";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faHeart } from '@fortawesome/free-solid-svg-icons'
import HeartButton from "./HeartButton";

function ReviewCard({ review }: { review: any }) {
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    if (review.user_id) {
      fetchById("users", review.user_id)
        .then((data) => setUser(data))
        .catch(console.error);
    }
  }, [review.user_id]);

  if (!user) return null;

  return (
    <Container className="mt-4 review-card p-3 border rounded">
      <Row className="align-items-center">
        <Col xs="auto">
          <Image 
            src={user.profile_picture || "https://www.gravatar.com/avatar/?d=mp"} 
            alt={user.username} 
            roundedCircle 
            width={50} 
            height={50} 
          />
        </Col>

        <Col>
          <h5 className="mb-1"><strong>{user.username}</strong></h5>
          <p className="mb-0">{review.review_text}</p>
        </Col>
      </Row>
      <Row>
      <Col className="mt-2 d-flex align-items-center">
        <HeartButton />
        <p className="mb-0 ms-2">20</p>
      </Col>
      </Row>
    </Container>
  );
}

export default ReviewCard;
