import React, { useState } from 'react';
import { Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPen, faAlignLeft, faTag, faFlag } from "@fortawesome/free-solid-svg-icons";
import forumApi from '../../../api/forumApi';
import { Alerts } from '../../../utils/Alerts';

const CreateTicketModal = ({ show, onHide, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    category: 'Support',
    priority: 'Medium'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.subject.trim()) {
      setError('Subject is required');
      return;
    }

    if (!formData.description.trim()) {
      setError('Description is required');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        subject: formData.subject,
        description: formData.description,
        category: formData.category,
        priority: formData.priority
      };

      const user = JSON.parse(localStorage.getItem('user'));
      payload.company_id = user?.company_id;

      await forumApi.createTicket(payload);

      // Reset form
      setFormData({
        subject: '',
        description: '',
        category: 'Support',
        priority: 'Medium'
      });

      onHide();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Failed to create ticket:', error);
      setError('Failed to create ticket. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered className="animate-fade-in">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fs-5 fw-bold text-dark">
          Open New Support Ticket
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body className="py-4">
          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          )}

          {/* Subject Field */}
          <Form.Group className="mb-4">
            <Form.Label className="small fw-bold text-secondary text-uppercase">
              <FontAwesomeIcon icon={faPen} className="me-2" /> Subject
            </Form.Label>
            <Form.Control
              type="text"
              name="subject"
              placeholder="Ex: Issue with password reset"
              value={formData.subject}
              onChange={handleChange}
              required
              disabled={loading}
              className="py-2 rounded-3 border-light-subtle shadow-sm shadow-none"
            />
          </Form.Group>

          {/* Description Field */}
          <Form.Group className="mb-4">
            <Form.Label className="small fw-bold text-secondary text-uppercase">
              <FontAwesomeIcon icon={faAlignLeft} className="me-2" /> Description
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="description"
              placeholder="Describe your issue or request..."
              value={formData.description}
              onChange={handleChange}
              required
              disabled={loading}
              className="py-2 rounded-3 border-light-subtle shadow-sm shadow-none"
              style={{ resize: 'none' }}
            />
          </Form.Group>

          {/* Category Field */}
          <Form.Group className="mb-4">
            <Form.Label className="small fw-bold text-secondary text-uppercase">
              <FontAwesomeIcon icon={faTag} className="me-2" /> Category
            </Form.Label>
            <Form.Select
              name="category"
              value={formData.category}
              onChange={handleChange}
              disabled={loading}
              className="py-2 rounded-3 border-light-subtle shadow-sm shadow-none"
            >
              <option value="Support">Support</option>
              <option value="Billing">Billing</option>
              <option value="Emergency">Emergency</option>
              <option value="Technical">Technical</option>
            </Form.Select>
          </Form.Group>

          {/* Priority Field */}
          <Form.Group className="mb-2">
            <Form.Label className="small fw-bold text-secondary text-uppercase">
              <FontAwesomeIcon icon={faFlag} className="me-2" /> Priority (Optional)
            </Form.Label>
            <Form.Select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              disabled={loading}
              className="py-2 rounded-3 border-light-subtle shadow-sm shadow-none"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </Form.Select>
          </Form.Group>
          <small className="text-muted" style={{ fontSize: '0.7rem' }}>
            A manager will review and respond to your ticket shortly.
          </small>
        </Modal.Body>

        <Modal.Footer className="border-0 pt-0 pb-4 px-4">
          <Button
            variant="light"
            onClick={onHide}
            className="rounded-3 px-4 fw-medium border-0"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="rounded-3 px-4 border-0 shadow-sm fw-bold"
            style={{ backgroundColor: '#8b5cf6' }}
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Creating...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faPlus} className="me-2" /> Create Ticket
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CreateTicketModal;