import MusicSmallCard from "./MusicSmallCard";

function MusicListGrid({ musicList, entity }: { musicList: any[], entity: string }) {
    if (!musicList || musicList.length === 0) {
        return (
            <div className="music-grid-container">
                <p>No {entity} found.</p>
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