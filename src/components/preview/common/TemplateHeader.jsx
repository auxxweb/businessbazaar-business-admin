/* eslint-disable react/prop-types */
import { Container, Nav, Navbar, NavLink } from 'react-bootstrap'

const TemplateHeader = ({businessData}) => {
  return (
    <Navbar expand="lg" className="bg-white pjs fixed-top" style={{ paddingBlock: "5px" }}>
                <Container>
                    {/* Align Brand to the start (left side) */}
                    <Navbar.Brand href="/" className='fw-bold w-50 nav-logo' style={{ fontSize: '36px' }}>
                        <img src={businessData?.logo} alt="" />
                        <span className="ms-2">{businessData?.businessName}</span>
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="basic-navbar-nav" style={{ color: 'black' }} />

                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto w-100 justify-content-evenly jcc">
                            <NavLink href="#" className='text-black text-center text-lg-start  text-decoration-none fs-14' style={{ color: 'black' }}>
                                Home
                            </NavLink>
                            <NavLink href="#about" className='text-black text-center text-lg-start  text-decoration-none fs-14' style={{ color: 'black' }}>
                                About
                            </NavLink>
                            <NavLink href="#gallery" className='text-black text-center text-lg-start  text-decoration-none fs-14' style={{ color: 'black' }}>
                                Gallery
                            </NavLink>
                            <NavLink href="#contact" className='text-black text-center text-lg-start  text-decoration-none fs-14' style={{ color: 'black' }}>
                                Contact
                            </NavLink>
                            <NavLink
                                to='/create-business'
                                style={{
                                    backgroundColor: businessData?.theme,
                                    color: 'white',
                                    borderRadius: '10px 0px',
                                    padding: '8px 20px',
                                    fontSize: '13px',
                                    boxShadow: '0px 15px 30px rgba(0, 0, 0, 0.15)'
                                }}
                                className='fw-bold text-decoration-none text-center text-lg-start'
                            >
                                Services
                            </NavLink>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
  )
}

export default TemplateHeader
