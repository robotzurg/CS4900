// ReviewCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Row, Image } from 'react-bootstrap';
import { faComment, faHeart } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface ReviewCardProps {
  review: any;
  user: any;
  music: any;
}

const BigReviewCard: React.FC<ReviewCardProps> = ({ review, user, music }) => {
  let formattedRating = '';
  if (review.rating) {
    formattedRating = `(${review.rating.toString().replace(/\.0+$/, '')}/10)`;
  }

  const reviewDate = new Date(review.timestamp);
  const isToday = new Date().toDateString() === reviewDate.toDateString();
  
  return (
    <div className="review-card p-3 border rounded mb-20">
      <Row className="align-items-center">
        <Col xs="auto">
          <Image
            src={music.image_url || "https://www.gravatar.com/avatar/?d=mp"}
            alt={music.name}
            width={150}
            height={150}
          />
        </Col>
        <Col>
          <h2>
            <Link to={`/${music.category}s/${music.id}`}>
              <strong>{music.name}</strong>
            </Link>
          </h2>
          <h4>
            {music.artists && music.artists.map((artist: any, index: number) => (
              <span key={index}>
                <Link className="artist-link" to={`/artists/${artist.id}`}>
                  {artist.name}
                </Link>
                {index < music.artists.length - 1 && ', '}
              </span>
            ))}
          </h4>
          <div className='d-flex flex-row gap-2 align-items-center'>
            <Image
              src={user.profile_picture || "https://www.gravatar.com/avatar/?d=mp"}
              alt={user.username}
              roundedCircle
              width={50}
              height={50}
            />
            <div className='d-flex flex-column'>
              <h5 className="mb-0">
                <Link to={`/profile/${user.id}`}>{user.username}</Link>
              </h5>
              <h5>{formattedRating}</h5>
            </div>
          </div>
        </Col>
      </Row>
      <Row className='mt-20 mb-20'>
        <p className="mb-0">
          {review.review_text.split('\n').map((line: string, index: number) => (
            <span key={index}>
              {line}
              <br />
            </span>
          ))}
        </p>
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
    </div>
  );
};

export default BigReviewCard;
