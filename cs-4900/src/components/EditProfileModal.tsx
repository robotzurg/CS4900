import { useState, useEffect } from 'react';
import { Modal, Button, Form, Image } from 'react-bootstrap';
import { uploadImage } from '../services/generic';

interface EditProfileModalProps {
  show: boolean;
  handleClose: () => void;
  onSubmit: (updatedData: { username: string; bio: string; profile_picture?: string | ArrayBuffer | null }) => void;
  userData: { username: string; bio: string; profile_picture?: string };
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 2 mb
const MAX_WIDTH     = 512; 
const MAX_HEIGHT    = 512;

const EditProfileModal: React.FC<EditProfileModalProps> = ({ show, handleClose, onSubmit, userData }) => {
  const [formData, setFormData] = useState({ username: '', bio: '', profile_picture: '' });
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (userData) {
      setFormData({
        username: userData.username || '',
        bio: userData.bio || '',
        profile_picture: userData.profile_picture || '',
      });
    }
  }, [userData, show]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (selectedImageFile) {
      try {
        const response = await uploadImage(selectedImageFile);
        const url = typeof response === 'string' ? response : response.url;
        if (url) {
          formData.profile_picture = url;
        } else {
          alert("Failed to retrieve image URL");
        }
      } catch {
        alert("Failed to upload image");
      }
    }
    onSubmit(formData);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="username" className="mb-3">
        <Form.Label>Username</Form.Label>
        <Form.Control
            type="text"
            placeholder="Enter your username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
        />
        </Form.Group>

        <Form.Group controlId="bio" className="mb-3">
        <Form.Label>Bio</Form.Label>
        <Form.Control
            as="textarea"
            rows={3}
            placeholder="Tell us about yourself"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
        />
        </Form.Group>

        <Form.Group controlId="profilePicture" className="mb-3">
          <Form.Label>Profile Picture</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = (e.target as HTMLInputElement).files?.[0];
              if (!file) return;

              if (file.size > MAX_FILE_SIZE) {
                alert(`Image must be smaller than ${MAX_FILE_SIZE/1024/1024} MB.`);
                return;
              }
              
              const previewUrl = URL.createObjectURL(file);
              const img = new window.Image();
              img.src = previewUrl;
              img.onload = () => {
                if (img.width  > MAX_WIDTH || img.height > MAX_HEIGHT) {
                  alert(`Image dimensions must be at most ${MAX_WIDTH}x${MAX_HEIGHT}px.`);
                  URL.revokeObjectURL(previewUrl);
                  return;
                }

                setSelectedImageFile(file);
                setFormData(prev => ({
                  ...prev,
                  profile_picture: previewUrl,
                }));
              };
              img.onerror = () => {
                alert("Invalid image file.");
                URL.revokeObjectURL(previewUrl);
              };
            }}
          />
          {formData.profile_picture && (
            <Image
              src={formData.profile_picture}
              alt="Profile preview"
              roundedCircle
              width={75}
              height={75}
              className="mt-2"
            />
          )}
        </Form.Group>
      </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" onClick={handleSubmit}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditProfileModal;
