import { useEffect, useState } from "react";
import { Container, Col, Row, Image } from "react-bootstrap";
import { fetchById } from "../services/index";
import { Link } from "react-router";
import { faComment, faHeart } from "@fortawesome/free-regular-svg-icons";
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

  let formattedRating = 'N/A'
  if (review.rating) {
    formattedRating = `${review.rating.toString().replace(/\.0+$/, '')}/10`;
  }
  
  const reviewDate = new Date(review.timestamp);
  const isToday = new Date().toDateString() === reviewDate.toDateString();

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
            <Link to={`/profile/${user.id}`}>
              <h5 className="mb-1">
                <strong>{user.username}</strong>
              </h5>
            </Link>
            <h6 style={{color: 'gray'}}>
              {formattedRating}
            </h6>
          <p className="mb-0">
            {(expanded
              ? review.review_text
              : review.review_text.length > 400
                ? review.review_text.slice(0, 400) + "..."
                : review.review_text
            )
            .split('\n')
            .map((line, index) => (
              <span key={index}>
                {line}
                <br />
              </span>
            ))}
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
        <FontAwesomeIcon icon={faHeart} />
          <p className="mb-0 ms-2">20</p>
        </Col>
        <Col xs="auto" className="d-flex align-items-center">
          <FontAwesomeIcon icon={faComment} />
          <p className="mb-0 ms-2">20</p>
        </Col>
        <Col xs="auto" className="d-flex align-items-center">
          <Link style={{ textDecoration: 'none' }} to={`/${review.type}s/${review.type == 'song' ? review.song_id : review.album_id}/reviews/${review.id}`}>
            <p className="mb-0">Open Review</p>
          </Link>
        </Col>
        <Col xs="auto" className="d-flex align-items-center">
          <p className="mb-0" style={{ fontSize: '0.9em', color: 'gray' }}>
            {isToday
              ? reviewDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : reviewDate.toLocaleDateString()}
          </p>
        </Col>
      </Row>
    </Container>
  );
}

export default ReviewCard;