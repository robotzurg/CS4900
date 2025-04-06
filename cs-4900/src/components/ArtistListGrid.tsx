import { Container, Row, Col } from "react-bootstrap";
import ArtistCard from "./ArtistCard";

function ArtistListGrid({ artistList }: { artistList: any[] }) {

  if (!artistList || artistList.length === 0) {
    return (
        <div>
            <p>No artists found.</p>
        </div>
    );
  }

  return (
    <Container>
      <Row className="g-4">
        {artistList.map((artist) => (
          <Col xl={2} lg={3} md={4} sm={6} xs={12} key={artist.id} className="card-col col-2-5">
            <ArtistCard artistId={artist.id} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default ArtistListGrid;
