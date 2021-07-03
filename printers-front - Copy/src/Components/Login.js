import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Container, Row, Col, Card, Form, InputGroup, Button } from "react-bootstrap";
import Cookie from 'universal-cookie';
// import { useHistory } from "react-router-dom";
const md5 = require("md5");
const cookie = new Cookie();

export default function Login(props) {

    // let history = useHistory();
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
            url: "http://localhost/api/users/login",
            headers: { },
            data: data
        };

        axios(config) 
            .then((response) => {
                if (response.status === 200) {
                    cookie.set("brand", response.data.user.brand, {secure: true, sameSite: 'none'});
                    cookie.set("validationKey", response.data.user.validationKey, {secure: true, sameSite: 'none'});
                    window.location.replace("/");
                    // history.push("/");
                    // props.callback(response.data.user.brand);
                }
            })
            .catch((err) => {
                // setErrorMsg(err.response.data.error.message);
                console.log(err);
            })

    };

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
