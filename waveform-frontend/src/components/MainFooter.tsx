import { Container, Row, Col } from "react-bootstrap";
import { faTwitter } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router";

function MainFooter() {
  return (
    <footer className="main-footer py-4 mt-5">
      <Container>
        <Row>
          <Col md={6}>
            <h5>Help Links</h5>
            <ul className="list-unstyled">
              <li><Link to="/support">Support</Link></li>
              <li><Link to="/tos">Terms of Service</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
            </ul>
          </Col>
          <Col md={6} className="text-md-end">
            <h5>Social Media</h5>
            <p>
              <a href="https://x.com/music_waveform" className="me-2" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faTwitter} size="2x" /></a>
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
