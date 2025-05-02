// import { useState, useEffect } from "react";
// import { fetchAll } from "../../services/index.ts";
import "./Users.css";
import { Container } from "react-bootstrap";
import PersonListGrid from "../../components/PersonListGrid.tsx";
import { Helmet } from "react-helmet";

function Users() {
  return (
    <div>
      <Helmet>
        <title>Users - Waveform</title>
      </Helmet>
      <Container>
        <h3 className="pt-20 pb-20 text-capitalize">All Users</h3>
        <PersonListGrid entity="users" />
      </Container>
    </div>
  );
}

export default Users;