import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

interface CreateReviewModalProps {
  show: boolean;
  handleClose: () => void;
  onSubmit: (rating: number, reviewText: string) => void;
}

const CreateReviewModal: React.FC<CreateReviewModalProps> = ({ show, handleClose, onSubmit }) => {
  const [rating, setRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>('');

  const handleSubmit = () => {
    if (rating > 0 && reviewText.trim()) {
      onSubmit(rating, reviewText);
      setRating(0);
      setReviewText('');
      handleClose();
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add A Review</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={(e) => e.preventDefault()}>
          <Form.Group>
            <Form.Label>Rating (0-10)</Form.Label>
            <Form.Control
                type="text"
                inputMode="decimal"
                placeholder="Enter rating (0-10, decimals allowed)"
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
          <Form.Group className="mt-3">
            <Form.Check
            type="checkbox"
            label="Favorite"
            id={`favorite-checkbox`}
          />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateReviewModal;