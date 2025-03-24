import { Container, Row, Col } from 'react-bootstrap';
import MusicSmallCard from './MusicSmallCard';

function MusicListGrid({ musicList, entity }: { musicList: any[], entity: string }) {
    return (
        <Container>
            <Row className="g-4">
                {musicList.map(musicData => (
                    <Col xl={2} lg={3} md={4} sm={6} xs={12} key={musicData.id} className='card-col col-2-5'>
                        <MusicSmallCard musicId={musicData.id} entity={entity} />
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

export default MusicListGrid;