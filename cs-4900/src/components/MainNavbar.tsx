import { useEffect, useState } from 'react';
import { Container, Nav, Navbar, Button } from 'react-bootstrap';
import { authLogin, authLogout, fetchUser } from '../services/api.ts';

function MainNavbar() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    const checkUser = async () => {
      setIsLoading(true);
      try {
        const currentUser = await fetchUser();
        setUser(currentUser);
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkUser();
  }, []);

  const handleLogin = () => {
    authLogin();
  };

  const handleLogout = async () => {
    authLogout();
    setUser(null);
    window.location.href = "/";
  }

  if (isLoading) {
    return (
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="/">Waveform</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/songs">View Songs</Nav.Link>
              <Nav.Link href="/albums">View Albums</Nav.Link>
            </Nav>
            <Nav>
              <Navbar.Text>Loading...</Navbar.Text>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="/">Waveform</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/songs">View Songs</Nav.Link>
            <Nav.Link href="/albums">View Albums</Nav.Link>
          </Nav>
          <Nav>
            {user ? (
              <>
                <Navbar.Text className="me-2">Signed in as: {user.username}</Navbar.Text>
                <Button variant="outline-danger" onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <Button variant="outline-success" onClick={handleLogin}>Sign in with Google</Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MainNavbar;