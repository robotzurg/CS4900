import { useEffect, useState } from 'react';
import { Container, Nav, Navbar, Button, FormControl, Form, Image, NavDropdown } from 'react-bootstrap';
import { authLogin, authLogout, fetchUser, onSearch } from '../services/index.ts';
import { useNavigate } from 'react-router-dom';

function MainNavbar() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

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
  };

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchClick = () => {
    if (searchTerm.trim() !== '') {
      onSearch(searchTerm);
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
    }
  };

  const handleSearchSubmit = (event) => {
      event.preventDefault();
      handleSearchClick();
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
              <Nav.Link href="/artists">View Artists</Nav.Link>
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
            <Nav.Link href="/artists">View Artists</Nav.Link>
          </Nav>
          <Nav className="d-flex align-items-center">
            <Form onSubmit={handleSearchSubmit} className="me-2">
              <div className="d-flex">
                <FormControl
                  type="text"
                  placeholder="Search"
                  className="me-2"
                  value={searchTerm}
                  onChange={handleInputChange}
                />
                <Button variant="outline-success" type="submit">Search</Button>
              </div>
            </Form>
            {user ? (
              <NavDropdown
                id="nav-dropdown-profile"
                title={
                  <>
                    <Image 
                      src={user.profile_picture || "https://www.gravatar.com/avatar/?d=mp"} 
                      alt={user.username} 
                      className="me-2" 
                      roundedCircle 
                      width={30} 
                      height={30} 
                    />
                    <Navbar.Text>{user.username}</Navbar.Text>
                  </>
                }
              >
                <NavDropdown.Item as={Nav.Link} href={`/profile/${user.id}`}>
                  Profile
                </NavDropdown.Item>
                <NavDropdown.Item onClick={handleLogout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
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