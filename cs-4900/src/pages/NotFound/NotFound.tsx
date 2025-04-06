import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";

const NotFound = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1 className="mb-20"><FontAwesomeIcon icon={faTrashCan} /> Uh oh, you hit a dead end!</h1>
      <p>We looked far and wide, but no page was found here.</p>
      <p>If you think this is an error, please contact us on our <a style={{ color: 'blue' }} href="/support">support page</a>.</p>
    </div>
  );
};

export default NotFound;