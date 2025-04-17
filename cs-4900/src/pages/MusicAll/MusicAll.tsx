import { useState, useEffect } from "react";
import { fetchAll } from "../../services/index.ts";
import "./MusicAll.css";
import MusicListGrid from "../../components/MusicListGrid.tsx";
import { Container } from "react-bootstrap";
import { Helmet } from "react-helmet";

function MusicAll({ entity }: {entity: string}) {
  const [musicList, setMusicList] = useState<any[]>([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const handleLoadMore = () => setVisibleCount(prev => prev + 10);

  useEffect(() => {
    fetchAll(entity).then(setMusicList).catch(console.error);
  }, []);

  console.log(musicList);

  return (
    <div>
      <Helmet>
        <title>{entity.charAt(0).toUpperCase() + entity.slice(1)} - Waveform</title>
      </Helmet>
      <Container>
        <h3 className='pt-20 pb-20 text-capitalize'>All {entity}</h3>
        <MusicListGrid musicList={musicList.slice(0, visibleCount)} entity={entity} />
            {visibleCount < musicList.length && (
                <div className="text-center mt-3">
                    <button className="btn btn-outline-primary" onClick={handleLoadMore}>
                        Show More
                    </button>
                </div>
            )}
      </Container>
    </div>
  );
}

export default MusicAll;