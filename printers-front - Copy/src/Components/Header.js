// Packages imports
import React from "react";
// import Cookie from 'universal-cookie';
import { Link } from "react-router-dom";
import {
    Container,
    Col,
    Row,
    Navbar
} from "react-bootstrap";

import '../Styles/header.css';

class Header extends React.Component {

    render() {
        return(
            <Container className="header">
                <Row>
                    <Col>
                        <Navbar>
                            <Navbar.Brand to="/admin/dashboard">PDFeast</Navbar.Brand>
                            <Link className="navBtn" to="/">Home</Link>
                            <Link className="navBtn" to="#features">Features</Link>
                            <Link className="navBtn" to="#pricing">Pricing</Link>
                            <Link className="navBtn" to="#roadmap">Roadmap</Link>
                            {/* <DropdownButton id="dropdown-basic-button" title="My Account">
                                <Dropdown.Item><Link to="/admin/account" style={{display: "block"}}>Account</Link></Dropdown.Item>
                                <Dropdown.Item><Link to="/login" style={{display: "block"}}>Logout</Link></Dropdown.Item>
                            </DropdownButton> */}
                        </Navbar>
                    </Col>
                </Row>
            </Container>
        );
    }

}

export default Header;