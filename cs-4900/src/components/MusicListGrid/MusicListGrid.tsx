import { useQuery } from '@tanstack/react-query';
import { fetchAll } from '../../services/index';
import MusicSmallCard from '../MusicSmallCard/MusicSmallCard';
import './MusicListGrid.css';

interface MusicListGridProps {
  entity: string;
  list?: any[];
}

function MusicListGrid({ entity, list }: MusicListGridProps) {
  const { data: musicList, isLoading, error } = useQuery(
    { queryKey: [entity, 'list'], queryFn: () => fetchAll(entity), enabled: !list }
  );

  // Determine the source of the music list
  const finalMusicList = list || musicList;

  if (!list && isLoading) {
    return <div className="music-grid-container">Loading…</div>;
  }

  if (!finalMusicList || error || !Array.isArray(finalMusicList) || finalMusicList.length === 0) {
    return <div className="music-grid-container">No {entity} found.</div>;
  }

  return (
    <div className="music-grid-container">
      {finalMusicList.map((music: any) => (
        <div className="music-card-wrapper" key={music.id}>
          <MusicSmallCard music={music} entity={entity} />
        </div>
      ))}
    </div>
  );
}

export default MusicListGrid;
