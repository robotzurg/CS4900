import { useEffect, useState } from "react";
import { Container, Col, Row, Image } from "react-bootstrap";
import { fetchById } from "../services/index";
import HeartButton from "./HeartButton";
import { Link } from "react-router";
import { faComment } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function ReviewCard({ review }: { review: any }) {
  const [user, setUser] = useState<any | null>(null);
  const [expanded, setExpanded] = useState(false);
  const toggleExpanded = () => setExpanded(!expanded);

  useEffect(() => {
    if (review.user_id) {
      fetchById("users", review.user_id)
        .then((data) => setUser(data))
        .catch(console.error);
    }
  }, [review.user_id]);

  if (!user) return null;

  let formattedRating = ''
  if (review.rating) {
    formattedRating = `(${review.rating.toString().replace(/\.0+$/, '')}/10)`;
  }

  return (
    <Container className="review-card p-3 border rounded">
      
      <Row>
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
          <Link style={{ textDecoration: 'none' }} to={`/${review.type}s/${review.type == 'song' ? review.song_id : review.album_id}/reviews/${review.id}`}>
            <h5 className="mb-1">
              <strong>{user.username} {formattedRating}</strong>
            </h5>
          </Link>
          <p className="mb-0">
            {expanded
              ? review.review_text
              : review.review_text.length > 400
                ? review.review_text.slice(0, 400) + "..."
                : review.review_text}
          </p>
          {review.review_text.length > 400 && (
            <button className="btn btn-link text-black p-0" onClick={toggleExpanded}>
              {expanded ? 'Read less' : 'Read more'}
            </button>
          )}
        </Col>
      </Row>
      <Row className="mt-2 d-flex justify-content-start align-items-center">
        <Col xs="auto" className="d-flex align-items-center">
          <HeartButton />
          <p className="mb-0 ms-2">20</p>
        </Col>
        <Col xs="auto" className="d-flex align-items-center">
          <FontAwesomeIcon icon={faComment} />
          <p className="mb-0 ms-2">20</p>
        </Col>
      </Row>
    </Container>
  );
}

export default ReviewCard;