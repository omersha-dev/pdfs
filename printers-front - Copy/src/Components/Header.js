// Packages imports
import React from "react";
// import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Cookie from 'universal-cookie';
import {
    // Container,
    // Col,
    // Row,
    Navbar,
    NavDropdown,
    Nav
} from "react-bootstrap";
import axios from "axios";
// import { useHistory } from "react-router-dom";
const cookie = new Cookie();

// import '../Styles/header.css';

class Header extends React.Component {

    constructor(props) {
        super(props);
        var isCookieSet = cookie.get("brand");
        this.state = {
            isLoggedIn: isCookieSet ? true : false,
        }
        // console.log(this.state.isLoggedIn);
        this.logout = this.logout.bind(this);
        this.validateUser();
    }

    logout() {
        // console.log("Logout");
        cookie.remove("brand", { path: '/' });
        cookie.remove("validationKey", { path: '/' });
        console.log(cookie.get("brand"));
        if (cookie.get("brand") === "undefined") {
            this.setState({
                isLoggedIn: false
            });
        }
        window.location.replace(window.location.protocol + '//' + window.location.host);
    }

    validateUser() {
        // console.log(`isLoggedIn = ${this.state.isLoggedIn}`);
        if (cookie.get("validationKey")) {
            var config = {
                method: "POST",
                url: `http://localhost/api/users/${cookie.get("brand")}`,
                headers: { },
            };
    
            axios(config)
                .then((response) => {
                    var validationKeyInDb = response.data.message.user.validationKey;
                    var brandInDb = response.data.message.user.brand;
                    if (validationKeyInDb !== cookie.get("validationKey") || brandInDb !== cookie.get("brand")) {
                        this.setState({
                            isLoggedIn: false
                        });
                        cookie.remove("brand");
                        cookie.remove("validationKey");
                    }
                })
                .catch((err) => {
                    console.log(err.response.data.error.message);
                })
        } else if (!this.state.isLoggedIn) {
            this.setState({
                isLoggedIn: false
            });
            cookie.remove("brand");
            cookie.remove("validationKey");
        }
    }

    render() {
        return(
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Navbar.Brand href="/">PDFeast</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link href="#features">Features</Nav.Link>
                        <Nav.Link href="#pricing">Pricing</Nav.Link>
                    </Nav>
                    {!this.state.isLoggedIn ? (
                    <Nav>
                        <Nav.Link href="login">Login</Nav.Link>
                        <Nav.Link href="join">Try For Free</Nav.Link>
                    </Nav>
                    ) : (
                    <Nav>
                        <NavDropdown title="My Account" id="collasible-nav-dropdown">
                            <NavDropdown.Item href="/dashboard/">Dashboard</NavDropdown.Item>
                            <NavDropdown.Item href="/dashboard/my-account">Manage Account</NavDropdown.Item>
                            <NavDropdown.Item href="/dashboard/mypdfs">MyPdfs</NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link onClick={this.logout}>Logout</Nav.Link>
                    </Nav>
                    )}
                </Navbar.Collapse>
            </Navbar>
        );
    }

}

export default Header;