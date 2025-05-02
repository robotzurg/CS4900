import { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

interface CreateReviewModalProps {
  show: boolean;
  handleClose: () => void;
  onSubmit: (rating: number | null, reviewText: string) => void;
  existingReview?: { rating: number | null; review_text: string };
}

const CreateReviewModal: React.FC<CreateReviewModalProps> = ({ show, handleClose, onSubmit, existingReview }) => {
  const [rating, setRating] = useState<string>('');
  const [reviewText, setReviewText] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating !== null ? existingReview.rating.toString().replace(/\.0+$/, '') : '');
      setReviewText(existingReview.review_text);
    } else {
      setRating('');
      setReviewText('');
    }
  }, [existingReview, show]);

  const validateRating = (value: string) => {
    const num = parseFloat(value);
    if ((isNaN(num) && value !== '') || num < 0 || num > 10) {
      setError('Rating must be between 0 and 10.');
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    let numberRating: number | null = null;
    if (rating !== '') numberRating = parseFloat(rating);

    if (!error) {
      onSubmit(numberRating, reviewText);
      handleClose();
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{existingReview ? 'Edit Review' : 'Add Review'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Rating (0-10)</Form.Label>
            <Form.Control
              type="text"
              inputMode="decimal"
              placeholder="Enter rating (0-10, decimals allowed)"
              value={rating}
              onChange={(e) => {
                setRating(e.target.value);
                validateRating(e.target.value);
              }}
              isInvalid={!!error}
            />
          </Form.Group>
          <Form.Group className="mt-3">
            <Form.Label>Review</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" onClick={handleSubmit}>
          {existingReview ? 'Update' : 'Submit'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateReviewModal;
