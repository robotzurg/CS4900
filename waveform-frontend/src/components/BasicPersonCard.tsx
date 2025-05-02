import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

function BasicPersonCard({ person, entity }: { person: any, entity: string }) {

  let linkUrl = ``
  let image = "https://www.gravatar.com/avatar/?d=mp";
  let personName = 'N/A';
  console.log(person);
  switch (entity) {
    case 'artists': 
      linkUrl = `/artists/${person.id}`;
      image = person.image_url || "https://www.gravatar.com/avatar/?d=mp";
      personName = person.name;
    break;
    case 'users': 
      linkUrl = `/profile/${person.id}`; 
      image = person.profile_picture || "https://www.gravatar.com/avatar/?d=mp";
      personName = person.username;
    break;
  }

  return (
    <Card className="border-0 shadow p-0 text-center" style={{ width: "12rem", maxWidth: "12rem" }}>
      <Link to={linkUrl} style={{ textDecoration: "none", color: "inherit" }}>
        <Card.Img
          variant="top"
          src={image || "https://www.gravatar.com/avatar/?d=mp"}
          alt={personName}
          className="rounded-circle mt-3"
          style={{ width: "80px", height: "80px", objectFit: "cover" }}
        />
        <Card.Body> 
          <Card.Title className="fw-bold">{personName}</Card.Title>
        </Card.Body>
      </Link>
    </Card>
  );
}

export default BasicPersonCard;
