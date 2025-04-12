import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getReview } from '../../services/review';
import { fetchById } from '../../services';
import { Col, Row, Image, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

const ReviewPage: React.FC = () => {
  const { reviewId } = useParams<any>();
  const [review, setReview] = useState<any | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [music, setMusic] = useState<any>(null); 

  useEffect(() => {
    if (reviewId) {
      getReview(reviewId)
        .then((data) => {
          setReview(data);
          if (data && data.user_id) {
            fetchById('users', data.user_id)
              .then((userData) => setUser(userData))
              .catch((error) => console.error('Error fetching user:', error));
          }
          if (data && (data.album_id || data.song_id)) {
            fetchById(`${data.type}s`, data.song_id == null ? data.album_id : data.song_id)
              .then((musicData) => setMusic(musicData))
              .catch((error) => console.error('Error fetching music:', error));
          }
        })
        .catch((error) => console.error('Error fetching review:', error));
    }
  }, [reviewId]);

  if (!review) return;

  let formattedRating = '';
  if (review.rating) {
    formattedRating = `(${review.rating.toString().replace(/\.0+$/, '')}/10)`;
  }
  
  return (
    <div>
      {review && user && music ? (
        <div>
            <Row className="align-items-center">
                <Col xs="auto">
                <Image
                    src={music.image_url || "https://www.gravatar.com/avatar/?d=mp"}
                    alt={music} 
                    width={150}
                    height={150}
                />    
                </Col>
                <Col>
                  <h2><Link to={`/${music.category}s/${music.id}`}><strong>{music.name}</strong></Link></h2>
                  <h4>
                    {music.artists.map((artist: any, index: number) => (
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
                    <Button variant='secondary' className='ml-10'><FontAwesomeIcon icon={faEdit} /></Button>
                    <Button variant='danger'><FontAwesomeIcon icon={faTrash} /></Button>
                  </div>
                </Col>
            </Row>
            <Row className='mt-20'>
              <p className="mb-0">
                {review.review_text.split('\n').map((line: string, index: number) => (
                  <span key={index}>
                    {line}
                    <br />
                  </span>
                ))}
              </p>
            </Row>
            <Row style={{ marginTop: '100px'}}>
              <h4>Comments</h4>
            </Row>
        </div>
      ) : (
        <p>Loading review...</p>
      )}
    </div>
  );
};

export default ReviewPage;