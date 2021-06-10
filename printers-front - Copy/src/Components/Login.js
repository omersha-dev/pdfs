import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Container, Row, Col, Card, Form, InputGroup, Button } from "react-bootstrap";
const md5 = require("md5");

export default function Login(props) {
    // const [errorMsg, setErrorMsg] = useState("");
    // const { register, handleSubmit, errors } = useForm();
    const { handleSubmit } = useForm();
    const onLogin = () => {
        
        var data = {
            email: document.getElementById("login_email").value, // formData.login_email,
            password: md5(document.getElementById("login_password").value)
        }
        
        var config = {
            method: "POST",
            url: "/api/users/login",
            headers: { },
            data: data
        };

        axios(config) 
            .then((response) => {
                if (response.status === 200) {
                    props.callback(response.data.user.website);
                }
            })
            .catch((err) => {
                // setErrorMsg(err.response.data.error.message);
                console.log(err.response.data.error.message);
            })

    };

    return (
        <Container style={{height: "100vh"}}>
            <Row style={{height: "100vh"}}>
                <Col className="d-flex justify-content-center align-items-center" style={{height: "100vh"}}>
                    <Card>
                        <Card.Header className="text-center">Login</Card.Header>
                        <Card.Body>
                            <Form onSubmit={handleSubmit(onLogin)}>
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
