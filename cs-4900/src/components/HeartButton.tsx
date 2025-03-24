import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";

function HeartButton() {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <FontAwesomeIcon
      icon={isFavorite ? solidHeart : regularHeart}
      color={isFavorite ? "white" : "black"}
      style={{ cursor: "pointer" }}
      onClick={() => setIsFavorite(!isFavorite)}
    />
  );
}

export default HeartButton;
