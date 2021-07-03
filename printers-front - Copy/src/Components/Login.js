import React from "react";
import axios from "axios";
import { Container, Row, Col, Card, Form, InputGroup, Button } from "react-bootstrap";
const md5 = require("md5");

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.onLogin = this.onLogin.bind(this);
    }

    onLogin(e) {

        e.preventDefault();

        var data = {
            email: document.getElementById("login_email").value, // formData.login_email,
            password: md5(document.getElementById("login_password").value)
        }
        
        var config = {
            method: "POST",
            url: "http://localhost/api/users/login",
            headers: { },
            data: data
        };

        axios(config) 
            .then((response) => {
                if (response.status === 200) {
                    this.props.loginCB(response.data.user);
                }
            })
            .catch((err) => {
                // setErrorMsg(err.response.data.error.message);
                console.log(err);
            })
    };

    render() {
        return (
            <Container style={{height: "94vh"}}>
                <Row style={{height: "94vh"}}>
                    <Col className="d-flex justify-content-center align-items-center flex-column" style={{height: "94vh"}}>
                        <h2>
                            PDFeast
                        </h2>
                        <h4>It's good to see you</h4>
                        <Card>
                            {/* <Card.Header className="text-center">Login</Card.Header> */}
                            <Card.Body>
                                <Form onSubmit={this.onLogin}>
                                <Form.Group>
                                    <Form.Control id="login_email" name="login_email" type="email" placeholder="Email" required/>
                                </Form.Group>
                                <Form.Group>
                                    <InputGroup>
                                        <InputGroup.Prepend>
                                            <Form.Control id="login_password" name="login_password" type="password" placeholder="Password" required/>
                                        </InputGroup.Prepend>
                                    </InputGroup>
                                </Form.Group>
                                <Button type="submit" value="login">
                                    Login
                                </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }

}

export default Login;