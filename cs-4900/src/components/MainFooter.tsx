import { Container, Row, Col } from "react-bootstrap";
import { faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function MainFooter() {
  return (
    <footer className="main-footer py-4 mt-5">
      <Container>
        <Row>
          <Col md={6}>
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/about">About</a></li>
              <li><a href="/contact">Contact</a></li>
              <li><a href="/terms">Terms of Service</a></li>
            </ul>
          </Col>
          <Col md={6} className="text-md-end">
            <h5>Social Media</h5>
            <p>
              <a href="https://twitter.com" className="me-2"><FontAwesomeIcon icon={faTwitter} size="2x" /></a>
              <a href="https://instagram.com"><FontAwesomeIcon icon={faInstagram} size="2x" /></a>
            </p>
          </Col>
        </Row>
        <hr />
        <p>&copy; {new Date().getFullYear()} Waveform. All rights reserved.</p>
      </Container>
    </footer>
  );
}

export default MainFooter;
