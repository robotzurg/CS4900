import { useEffect, useState } from 'react';
import { Container, Nav, Navbar, Button, FormControl, Form, Image, NavDropdown, InputGroup } from 'react-bootstrap';
import { authLogin, authLogout, fetchUser, onSearch } from '../services/index.ts';
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
    await authLogout();
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
      <Navbar expand="lg" className="bg-body-tertiary" style={{ maxHeight: "55px" }}>
        <Container>
          <Navbar.Brand href="/">Waveform</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/songs">View Songs</Nav.Link>
              <Nav.Link href="/albums">View Albums</Nav.Link>
              <Nav.Link href="/artists">View Artists</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }

  return (
    <Navbar expand="lg" className="bg-body-tertiary" style={{ maxHeight: "55px" }}>
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
            <InputGroup>
              <FormControl
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={handleInputChange}
                style={{ paddingRight: '40px', borderRadius: '10px' }}
              />
              <div 
                style={{ 
                  position: 'absolute', 
                  right: '10px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                }}
              >
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </div>
            </InputGroup>
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
                <NavDropdown.Item as={Nav.Link} href={`/profile/${user.id}`} className="py-2 px-3 text-dark">
                  Profile
                </NavDropdown.Item>
                <NavDropdown.Item onClick={handleLogout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <NavDropdown
                id="nav-dropdown-profile"
                title={
                  <>
                    <Image 
                      src={"https://www.gravatar.com/avatar/?d=mp"} 
                      alt="Not logged in avatar" 
                      className="me-2" 
                      roundedCircle 
                      width={30} 
                      height={30} 
                    />
                    <Navbar.Text>Login</Navbar.Text>
                  </>
                }
              >
                <NavDropdown.Item as={Button} onClick={handleLogin} className="py-2 px-3 text-dark">
                  Login With Google
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MainNavbar;