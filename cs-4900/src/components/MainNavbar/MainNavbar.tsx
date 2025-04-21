import { useEffect, useState } from 'react';
import { Container, Nav, Navbar, Button, FormControl, Form, Image, NavDropdown, InputGroup, Offcanvas } from 'react-bootstrap';
import { authLogin, authLogout, fetchMe, onSearch } from '../../services/index.ts';
import { Link, useNavigate } from 'react-router-dom';
import './MainNavbar.css';

function MainNavbar() {
  const [user, setUser] = useState<any>(null);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow  = () => setShow(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await fetchMe();
        setUser(currentUser);
        localStorage.setItem("user", JSON.stringify(currentUser));
      } catch (error) {
        setUser(null);
        localStorage.removeItem("user");
      }
    };

    if (!user) checkUser();
  }, []);

  useEffect(() => {
    const syncUser = () => {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    window.addEventListener("storage", syncUser);
    return () => window.removeEventListener("storage", syncUser);
  }, []);

  const handleLogin = () => {
    authLogin();
  };

  const handleLogout = async () => {
    await authLogout();
    setUser(null);
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchClick = () => {
    if (searchTerm.trim() !== '') {
      onSearch(searchTerm);
      navigate(`/results?q=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
    }
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    handleSearchClick();
  };

  return (
    <Navbar expand="lg" className="navbar" style={{ maxHeight: "55px" }}>
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <Image 
            src="/images/new-waveform-logo.png" 
            alt="Waveform" 
            className="me-2" 
            width={30} 
            height={30} 
          />
          <span className="wave-text">
            {"Waveform".split("").map((letter, i) => <span key={i}>{letter}</span>)}
          </span>
        </Navbar.Brand>

        {/* toggle opens offcanvas */}
        <Navbar.Toggle aria-controls="offcanvasNavbar" onClick={handleShow} />

        <Navbar.Offcanvas
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
          placement="end"
          show={show}
          onHide={handleClose}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id="offcanvasNavbarLabel">
              Waveform
            </Offcanvas.Title>
          </Offcanvas.Header>

          <Offcanvas.Body>
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/songs" onClick={handleClose}>Songs</Nav.Link>
              <Nav.Link as={Link} to="/albums" onClick={handleClose}>Albums</Nav.Link>
              <Nav.Link as={Link} to="/artists" onClick={handleClose}>Artists</Nav.Link>
              <Nav.Link as={Link} to="/users" onClick={handleClose}>Users</Nav.Link>
              <Nav.Link as={Link} to="/genres" onClick={handleClose}>Genres</Nav.Link>
            </Nav>

            <Nav className="d-flex align-items-center">
              <Form onSubmit={handleSearchSubmit} className="me-2 w-100">
                <InputGroup>
                  <FormControl
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={handleInputChange}
                    style={{ paddingRight: '40px', borderRadius: '10px' }}
                    className="search-input"
                  />
                </InputGroup>
              </Form>

              {user ? (
                <NavDropdown
                  id="offcanvas-nav-dropdown-profile"
                  title={
                    <>
                      <Image 
                        src={user.profile_picture || "https://www.gravatar.com/avatar/?d=mp"} 
                        alt={user.username} 
                        roundedCircle 
                        width={30} 
                        height={30} 
                        className="me-2"
                      />
                      {user.username}
                    </>
                  }
                >
                  <NavDropdown.Item as={Link} to={`/profile/${user.id}`} onClick={handleClose}>
                    Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={() => { handleLogout(); handleClose(); }}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <NavDropdown
                  id="offcanvas-nav-dropdown-login"
                  title={
                    <>
                      <Image 
                        src="https://www.gravatar.com/avatar/?d=mp" 
                        alt="Login" 
                        roundedCircle 
                        width={30} 
                        height={30} 
                        className="me-2"
                      />
                      Login
                    </>
                  }
                >
                  <NavDropdown.Item as={Button} onClick={() => { handleLogin(); handleClose(); }}>
                    Login With Google
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
}

export default MainNavbar;
