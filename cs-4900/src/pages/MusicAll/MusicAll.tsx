// import { useState } from "react";
import MusicListGrid from "../../components/MusicListGrid/MusicListGrid.tsx";
import { Button, Container } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { Flex } from "@mantine/core";
import { useNavigate } from "react-router-dom";

function MusicAll({ entity }: { entity: string }) {
  // const [visibleCount, setVisibleCount] = useState(10);
  const navigate = useNavigate();

  const singular = entity.replace(/s$/, "");

  return (
    <div>
      <Helmet>
        <title>
          {entity.charAt(0).toUpperCase() + entity.slice(1)} - Waveform
        </title>
      </Helmet>

      <Container>
        <Flex justify="space-between" align="center" className="py-3">
          <h3 className="mb-0 text-capitalize">All {entity}</h3>
          <Button
            variant="primary"
            onClick={() => navigate(`/add-music/${singular}`)}
          >
            + Add{" "}
            {singular.charAt(0).toUpperCase() +
              singular.slice(1)}
          </Button>
        </Flex>

        <MusicListGrid
          entity={entity}
        />
{/* 
        {visibleCount < musicList.length && (
          <div className="text-center mt-3">
            <Button
              variant="outline-primary"
              onClick={() => setVisibleCount((v) => v + 10)}
            >
              Show More
            </Button>
          </div>
        )} */}
      </Container>
    </div>
  );
}

export default MusicAll;
