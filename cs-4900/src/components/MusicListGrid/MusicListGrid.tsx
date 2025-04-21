import MusicSmallCard from "../MusicSmallCard/MusicSmallCard";
import './MusicListGrid.css';

function MusicListGrid({ musicList, entity }: { musicList: any[], entity: string }) {
    if (!musicList || musicList.length === 0) {
        return (
            <div className="music-grid-container">
                No {entity} found.
            </div>
        );
    }

    return (
        <div className="music-grid-container">
            {musicList.map(musicData => (
                <div className="music-card-wrapper" key={musicData.id}>
                    <MusicSmallCard musicId={musicData.id} entity={entity} />
                </div>
            ))}
        </div>
    );
}

export default MusicListGrid;