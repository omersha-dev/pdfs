// Packages imports
import React from "react";
import Cookie from 'universal-cookie';
import {
    HashRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";
import {
    Container,
    Col,
    Row,
    ButtonGroup,
    Button,
    Nav,
    DropdownButton,
    Dropdown,
    Navbar
} from "react-bootstrap";

// Components imports
import Register from './Register';
import Login from "./Login";
import Dashboard from "./Dashboard";
import MyPdfs from "./MyPdfs";
import Account from "./Account";

// Packages declarations
const cookie = new Cookie();

class Header extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: (cookie.get("loggedIn")) ? true : false
        }
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
    }

    login(website) {
        cookie.set("website", website, {path: '/'});
        cookie.set("loggedIn", true, {path: '/'});
        this.setState(state => ({
            isLoggedIn: true
        }))
    }

    logout() {
        cookie.remove("loggedIn");
        cookie.remove("website");
        this.setState(state => ({
            isLoggedIn: false
        }))
    }

    render() {
        if (this.state.isLoggedIn) {
            return(
                <Router>
                    <Container fluid>
                        <Row>
                            <Col>
                                <Navbar bg="dark" variant="dark">
                                    <Navbar.Brand to="/admin/dashboard">PrintDF</Navbar.Brand>
                                    <Nav className="mr-auto">
                                        {/* <Nav.Link href="#home">Home</Nav.Link>
                                        <Nav.Link href="#features">Features</Nav.Link>
                                        <Nav.Link href="#pricing">Pricing</Nav.Link> */}
                                    </Nav>
                                    <DropdownButton id="dropdown-basic-button" title="My Account">
                                        <Dropdown.Item><Link to="/admin/account" style={{display: "block"}}>Account</Link></Dropdown.Item>
                                        <Dropdown.Item><Link to="/login" style={{display: "block"}} onClick={this.logout}>Logout</Link></Dropdown.Item>
                                    </DropdownButton>
                                </Navbar>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={2}>
                                <Nav defaultActiveKey="/admin/dashboard" className="flex-column">
                                    <ButtonGroup vertical style={{display: "flex"}}>
                                        <Button className="rounded-0" size="lg" style={{flex: 1}}><Link to="/admin/dashboard" style={{display: "block", color: "#fff"}}>Dashboard</Link></Button>
                                        <Button size="lg" style={{flex: 1}}><Link to="/admin/mypdfs" style={{display: "block", color: "#fff"}}>My Pdf's</Link></Button>
                                    </ButtonGroup>
                                </Nav>
                            </Col>
                            <Col lg={10}>
                                <Switch>
                                    <Route exact path="/">
                                        <Redirect to="/admin/dashboard" />
                                    </Route>
                                    <Route exact path="/admin/dashboard">
                                        <Dashboard />
                                    </Route>
                                    <Route exact path="/admin/mypdfs">
                                        <MyPdfs website={cookie.get("website")}/>
                                    </Route>
                                    <Route>
                                        <Account />
                                    </Route>
                                    <Route exact path="/register">
                                        {this.state.isLoggedIn ? <Redirect to="/admin/dashboard" /> : <Register />}
                                    </Route>
                                    <Route exact path="/login">
                                        {this.state.isLoggedIn ? <Redirect to="/admin/dashboard" /> : <Login callback={this.login}/>}
                                    </Route>
                                </Switch>
                            </Col>
                        </Row>
                    </Container>
                </Router>
            );
        } else {
            return(
                <Router>
                    <Container fluid>
                        <Row>
                            <Col lg={2} style={{height: "92vh"}}>
                                <Nav defaultActiveKey="/home" className="flex-column">
                                    <ButtonGroup vertical style={{display: "flex"}}>
                                        <Button size="lg" style={{flex: 1}}><Link to="/Register" style={{display: "block", color: "#fff"}}>Register</Link></Button>
                                        <Button size="lg" style={{flex: 1}}><Link to="/login" style={{display: "block", color: "#fff"}}>Login</Link></Button>
                                    </ButtonGroup>
                                </Nav>
                            </Col>
                            <Col lg={10}>
                                <Switch>
                                    <Route exact path="/">
                                        <Redirect to="/login" />
                                    </Route>
                                    <Route exact path="/register">
                                       <Register />
                                    </Route>
                                    <Route exact path="/login">
                                       <Login callback={this.login}/>
                                    </Route>
                                    <Route path="/admin/dashboard">
                                        {!this.state.isLoggedIn ? <Redirect to="/login" /> : <Dashboard />}
                                    </Route>
                                    <Route path="/admin/mypdfs">
                                        {!this.state.isLoggedIn ? <Redirect to="/login" /> : <Dashboard />}
                                    </Route>
                                </Switch>
                            </Col>
                        </Row>
                    </Container>
                </Router>
            );
        }
    }

}

export default Header;