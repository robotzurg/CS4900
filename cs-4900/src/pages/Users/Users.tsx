import { useState, useEffect } from "react";
import { fetchAll } from "../../services/index.ts";
import "./Users.css";
import { Container } from "react-bootstrap";
import PersonListGrid from "../../components/PersonListGrid.tsx";
import { Helmet } from "react-helmet";

function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll("users")
      .then((data) => setUsers(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <Helmet>
        <title>Users - Waveform</title>
      </Helmet>
      <Container>
        <h3 className="pt-20 pb-20 text-capitalize">All Users</h3>
        {loading ? <p>Loading...</p> : <PersonListGrid personList={users} entity="users" />}
      </Container>
    </div>
  );
}

export default Users;