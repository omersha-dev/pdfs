import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Container, Row, Col, Card, Form, InputGroup, Button } from "react-bootstrap";
const md5 = require("md5");

function generateApiKey() {
    var length           = 32;
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export default function Register() {

    const [errorMsg, setErrorMsg] = useState("");

    // const { register, handleSubmit, errors } = useForm();
    const { handleSubmit } = useForm();
    
    const onRegister = () => {

        var validationKey = md5(document.getElementById("register_band") + document.getElementById("register_password").value); 
        
        var data = {
            email: document.getElementById("register_email").value,
            password: md5(document.getElementById("register_password").value),
            apiKey: generateApiKey(),
            brand: document.getElementById("register_brand").value,
            validationKey: validationKey,
            privileges: "customer"
        }

        var confirmPassword = md5(document.getElementById("confirm_register_password").value);

        if (data.password !== confirmPassword) {
            setErrorMsg("Passwords do not match");
            return;
        }

        var config = {
            method: "POST",
            url: 'http://localhost/api/users/register',
            // url: 'http://localhost/api/users/register',
            headers: {
                'Content-Type': 'application/json'
            },
            data : data
        };

        axios(config)
            .then((response) => {
                setErrorMsg("Successfully registered, welcome!");
                console.log(JSON.stringify(response.data));
            })
            .catch((err) => {
                // setErrorMsg(err.response.data.error.message);
                // console.log(err.response.data.error.message);
                console.log(err);
            })
    }

    return (
        <Container style={{height: "94vh"}}>
            <Row style={{height: "94vh"}}>
                <Col className="d-flex justify-content-center align-items-center flex-column" style={{height: "94vh"}}>
                    <h2>
                        PDFeast
                    </h2>
                    <h4>It's nice to meet you</h4>
                    <Card>
                        {/* <Card.Header className="text-center">Register</Card.Header> */}
                        <Card.Body>
                            <p style={{color: "red"}}>{errorMsg}</p>
                            <Form onSubmit={handleSubmit(onRegister)}>
                            <Form.Group>
                                <Form.Control id="register_email" name="register_email" type="email" placeholder="Email" required/>
                            </Form.Group>
                            <Form.Group>
                                <InputGroup>
                                    {/* <InputGroup.Prepend> */}
                                        <Form.Control id="register_password" name="register_password" type="password" placeholder="Password" required/>
                                    {/* </InputGroup.Prepend> */}
                                </InputGroup>
                            </Form.Group>
                            <Form.Group>
                                <InputGroup>
                                    <Form.Control id="confirm_register_password" name="confirm_register_password" type="password" placeholder="Confirm password" required/>
                                </InputGroup>
                            </Form.Group>
                            <Form.Group>
                                <InputGroup>
                                    <Form.Control id="register_brand" name="register_brand" type="text" placeholder="brand" required/>
                                    {/* <InputGroup.Append>
                                        <InputGroup.Text>example.com</InputGroup.Text>
                                    </InputGroup.Append> */}
                                </InputGroup>
                            </Form.Group>
                            <Button type="submit" value="register" style={{width: "100%"}}>
                                Register
                            </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
        // // "handleSubmit" will validate your inputs before invoking "onSubmit"
        // <form className="register" onSubmit={handleSubmit(onRegister)}>
        //     <p>{errorMsg}</p>
        //     {/* register your input into the hook by invoking the "register" function */}
        //     <input type="email" name="register_email" placeholder="email" ref={register({ required: true })} />

        //     {/* include validation with required or other standard HTML validation rules */}
        //     <input type="password" name="register_password" placeholder="password" ref={register({ required: true })} />
        //     <input type="text" name="register_website" placeholder="website" ref={register({ required: true })} />
        //     {/* errors will return when field validation fails  */}
        //     {errors.username && <span>This field is required</span>}
        //     {errors.password && <span>This field is required</span>}

        //     <input type="submit" value="Register"/>
        // </form>
    );
}