import React from "react";
import {
    Navbar,
    NavDropdown,
    Nav
} from "react-bootstrap";

class Header extends React.Component {

    constructor(props) {
        super(props);
        this.logout = this.logout.bind(this);
    }

    logout = () => {
            this.props.logoutCB();
    }

    render() {
        return(
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" style={{padding: ".5rem 3rem .5rem 1rem"}}>
                <Navbar.Brand href="/">PDFeast</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link href="#features">Features</Nav.Link>
                        <Nav.Link href="#pricing">Pricing</Nav.Link>
                    </Nav>
                    {!this.props.isLoggedIn ? (
                    <Nav>
                        <Nav.Link href="login">Login</Nav.Link>
                        <Nav.Link href="join">Try For Free</Nav.Link>
                    </Nav>
                    ) : (
                    <Nav>
                        <NavDropdown title={this.props.user !== null ? this.props.user.brand : "My Account"} id="collasible-nav-dropdown">
                            <NavDropdown.Item href="/dashboard/">Dashboard</NavDropdown.Item>
                            <NavDropdown.Item href="/dashboard/my-account">My Account</NavDropdown.Item>
                            {(this.props.user !== null && this.props.user.privileges === "admin") ? (
                                <NavDropdown.Item href="/dashboard/accounts">Manage Accounts</NavDropdown.Item>
                            ) : ( <></> )}
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