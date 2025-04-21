import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { Helmet } from "react-helmet";
import { Link } from "react-router";

const NotFound = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <Helmet>
        <title>404 Not Found - Waveform</title>
      </Helmet>
      <h1 className="mb-20"><FontAwesomeIcon icon={faTrashCan} /> Uh oh, you hit a dead end!</h1>
      <p>We looked far and wide, but no page was found here.</p>
      <p>If you think this is an error, please contact us on our <Link style={{ color: 'blue' }} to="/support">support page</Link>.</p>
    </div>
  );
};

export default NotFound;