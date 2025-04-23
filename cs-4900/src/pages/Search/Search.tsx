import { useQuery } from '@tanstack/react-query';
import { Container } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { onSearch } from '../../services/index';
import MusicListGrid from '../../components/MusicListGrid/MusicListGrid';
import PersonListGrid from '../../components/PersonListGrid';

// simple skeleton placeholder
function SectionSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="music-grid-container">
      {Array.from({ length: count }).map((_, i) => (
        <div className="music-card-wrapper" key={i}>
          <div className="skeleton" />
        </div>
      ))}
    </div>
  );
}

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  // batch all four searches in one useQuery
  const { data, isLoading, isError } = useQuery({
    queryKey: ['search', query],
    queryFn: () =>
      Promise.all([
        onSearch(query, 'songs'),
        onSearch(query, 'albums'),
        onSearch(query, 'artists'),
        onSearch(query, 'users'),
      ]).then(([songs, albums, artists, users]) => ({
        songs,
        albums,
        artists,
        users,
      })),
    enabled: query.length > 0,
  });

  return (
    <div>
      <Helmet>
        <title>{query ? `"${query}" Results` : 'Search'} - Waveform</title>
      </Helmet>

      <Container className="mt-4">
        <h1 className="pb-40">
          {query ? `Search Results for "${query}"` : 'Please enter a search term'}
        </h1>

        {/* Songs */}
        <section className="mb-40">
          <h2>Songs</h2>
          {isLoading ? (
            <SectionSkeleton />
          ) : isError || !data?.songs.length ? (
            <p>No songs found.</p>
          ) : (
            <MusicListGrid list={data.songs} entity="songs" />
          )}
        </section>

        {/* Albums */}
        <section className="mb-40">
          <h2>Albums</h2>
          {isLoading ? (
            <SectionSkeleton />
          ) : isError || !data?.albums.length ? (
            <p>No albums found.</p>
          ) : (
            <MusicListGrid list={data.albums} entity="albums" />
          )}
        </section>

        {/* Artists */}
        <section className="mb-40">
          <h2>Artists</h2>
          {isLoading ? (
            <SectionSkeleton />
          ) : isError || !data?.artists.length ? (
            <p>No artists found.</p>
          ) : (
            <PersonListGrid list={data.artists} entity="artists" />
          )}
        </section>

        {/* Users */}
        <section className="mb-40">
          <h2>Users</h2>
          {isLoading ? (
            <SectionSkeleton />
          ) : isError || !data?.users.length ? (
            <p>No users found.</p>
          ) : (
            <PersonListGrid list={data.users} entity="users" />
          )}
        </section>
      </Container>
    </div>
  );
};

export default SearchPage;
