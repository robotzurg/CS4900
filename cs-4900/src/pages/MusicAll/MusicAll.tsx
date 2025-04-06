import { useState, useEffect } from "react";
import { fetchAll } from "../../services/index.ts";
import "./MusicAll.css";
import MusicListGrid from "../../components/MusicListGrid.tsx";
import { Container } from "react-bootstrap";

function MusicAll({ entity }: {entity: string}) {
  const [musicList, setMusicList] = useState<any[]>([]);

  useEffect(() => {
    fetchAll(entity).then(setMusicList).catch(console.error);
  }, []);

  return (
    <div>
      <Container>
        <h3 className='pt-20 pb-20 text-capitalize'>All {entity}</h3>
        <MusicListGrid musicList={musicList} entity={entity}></MusicListGrid>
      </Container>
    </div>
  );
}

export default MusicAll;