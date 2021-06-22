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
            <Container className="header" fluid>
                <Row className="demoPdf">
                    <Col className="systemBar" lg={12}>
                        <span className="demoPdfSystem File">File</span>
                        <span className="demoPdfSystem Edit">Edit</span>
                        <span className="demoPdfSystem View">View</span>
                        <span className="demoPdfSystem Sign">Sign</span>
                        <span className="demoPdfSystem Window">Window</span>
                        <span className="demoPdfSystem Help">Help</span>
                    </Col>
                </Row>
                <Row className="demoPdf demoPdfTabContainer">
                    <Col lg={1} className="demoPdfTab active">
                        <Link className="navBtn" to="/">
                            <div className="demoPdfTabInner active" >
                                <span className="demoPdfFileName">Home</span>
                                <span className="demoPdfCloseTab">x</span>
                            </div>
                        </Link>
                    </Col>
                    <Col lg={1} className="demoPdfTab">
                        <Link className="navBtn" to="/#features">
                            <div className="demoPdfTabInner" >
                                <span className="demoPdfFileName">Features</span>
                                <span className="demoPdfCloseTab">x</span>
                            </div>
                        </Link>
                    </Col>
                    <Col lg={1} className="demoPdfTab">
                        <Link className="navBtn" to="/#pricing">
                            <div className="demoPdfTabInner" >
                                <span className="demoPdfFileName">Pricing</span>
                                <span className="demoPdfCloseTab">x</span>
                            </div>
                        </Link>
                    </Col>
                    <Col lg={9} className="demoPdfTab"></Col>
                </Row>
            </Container>
        );
    }

}

export default Header;