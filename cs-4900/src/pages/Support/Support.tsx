import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Support: React.FC = () => {
    return (
        <Container className="mt-4">
            <Row>
                <Col md={8}>
                    <h1 className="mb-4">Support</h1>
                    <p>If you need assistance with our site, please email us at <a href="mailto:support.waveformreviews.net" style={{ color: 'blue' }}>support.waveformreviews.net</a> and we will get back to you with assistance when we can.</p>
                </Col>
            </Row>
        </Container>
    );
};

export default Support;