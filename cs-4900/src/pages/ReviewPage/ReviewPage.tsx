import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getReview } from '../../services/review';
import { fetchById } from '../../services';
import { Col, Row, Image, Button, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { fetchCommentsForReview } from '../../services/comments.ts';
import { createItem, deleteItem, updateItem } from '../../services/generic.ts';

const ReviewPage: React.FC = () => {
  const { reviewId } = useParams<any>();
  const [review, setReview] = useState<any | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [music, setMusic] = useState<any>(null); 
  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentText, setEditingCommentText] = useState<string>('');
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    if (reviewId) {
      getReview(reviewId)
        .then((data) => {
          setReview(data);
          if (data?.user_id) {
            fetchById('users', data.user_id).then(setUser);
          }
          if (data?.album_id || data?.song_id) {
            fetchById(`${data.type}s`, data.song_id == null ? data.album_id : data.song_id).then(setMusic);
          }
        })
        .catch(console.error);
      fetchCommentsForReview(reviewId).then(setComments).catch(console.error);
    }
  }, [reviewId]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    if (!reviewId) {
      console.error("Review ID is undefined");
      return;
    }

    if (!currentUser) {
      console.error("User is not logged in");
      return;
    }

    const newComment = {
      review_id: reviewId,
      user_id: currentUser.id,
      comment_text: commentText,
      timestamp: new Date().toLocaleDateString(),
    };

    const posted = await createItem('comments', newComment);

    posted.profile_picture = currentUser.profile_picture || "https://www.gravatar.com/avatar/?d=mp";
    posted.username = currentUser.username;
    setComments((prev) => [...prev, posted]);
    setCommentText('');
  };

  const handleEditComment = (commentId: string, commentText: string) => {
    setEditingCommentId(commentId);
    setEditingCommentText(commentText);
  };

  const handleUpdateComment = async () => {
    if (!editingCommentId || !editingCommentText.trim()) return;

    const updatedComment = {
      comment_text: editingCommentText,
    };

    await updateItem('comments', editingCommentId, updatedComment);

    setComments((prev) =>
      prev.map((comment) =>
        comment.id === editingCommentId
          ? { ...comment, comment_text: editingCommentText }
          : comment
      )
    );

    setEditingCommentId(null);
    setEditingCommentText('');
  };

  const handleDeleteComment = async (commentId: string) => {
    await deleteItem('comments', commentId);

    setComments((prev) => prev.filter((comment) => comment.id !== commentId));
  };

  if (!review) return;

  let formattedRating = '';
  if (review.rating) {
    formattedRating = `(${review.rating.toString().replace(/\.0+$/, '')}/10)`;
  }

  return (
    <div className='mt-20'>
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

          <Row style={{ marginTop: '60px' }}>
            <h4>Comments</h4>
            <Form onSubmit={handleCommentSubmit} className="mb-4">
              <Form.Group controlId="commentText" className='mb-3'>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                />
              </Form.Group>
              <Button type="submit" disabled={!commentText.trim()}>
                Post Comment
              </Button>
            </Form>
            {comments.map((comment, index) => (
              <div key={index} className="mb-3 d-flex gap-2 align-items-start">
                <Image
                  src={comment.profile_picture || "https://www.gravatar.com/avatar/?d=mp"}
                  roundedCircle
                  width={40}
                  height={40}
                />
                <div>
                  <strong>
                    <Link to={`/profile/${comment.user_id}`}>{comment.username}</Link>
                  </strong>
                  {editingCommentId === comment.id ? (
                    <>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        value={editingCommentText}
                        onChange={(e) => setEditingCommentText(e.target.value)}
                      />
                      <Button
                        variant="success"
                        size="sm"
                        onClick={handleUpdateComment}
                        className="mt-2"
                      >
                        Save
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setEditingCommentId(null)}
                        className="mt-2 ml-10"
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <p className="mb-1">{comment.comment_text}</p>
                      <small className="text-muted">{new Date(comment.timestamp).toLocaleDateString()}</small>
                      {comment.user_id === currentUser?.id && (
                        <>
                          <FontAwesomeIcon
                            icon={faEdit}
                            className="button ml-10"
                            onClick={() => handleEditComment(comment.id, comment.comment_text)}
                          />
                          <FontAwesomeIcon
                            icon={faTrash}
                            className="button ml-10"
                            onClick={() => handleDeleteComment(comment.id)}
                          />
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </Row>
        </div>
      ) : (
        <p>Loading review...</p>
      )}
    </div>
  );
};

export default ReviewPage;
