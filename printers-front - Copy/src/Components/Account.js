import axios from 'axios';
import React from 'react';
// import md5 from "md5";
import { Container, InputGroup, FormControl, Row, Col, Jumbotron } from 'react-bootstrap';
import Cookie from "universal-cookie";

const cookie = new Cookie();
const path = window.location.protocol + '//' + window.location.host.replace(":3000", "");

class Account extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            user: null,
            show: false,
            // apiKey: "",
            // currentModal: "",
            // modalText: ""
        }
        this.getUserDetails();
        // this.handleClose = this.handleClose.bind(this);
        // this.handleShow = this.handleShow.bind(this);
        // this.handleConfirm = this.handleConfirm.bind(this);
    }

    getUserDetails() {
        var config = {
            method: "POST",
            url: `${path}/api/users/${cookie.get("brand")}`,
            headers: { },
        }

        axios(config)
            .then((response) => {
                this.setState({user: response.data.message.user});
            })
            .catch((err) => {
                console.log(err);
            });
    }
    
    // handleShow(e) {
    //     var btnID = e.target.id;
    //     switch(btnID) {
    //         case "changeemail":
    //             this.setState({currentModal: btnID, modalText: "Are you sure you want to change your email?"});
    //             break
    //         case "resetpw":
    //             this.setState({currentModal: btnID, modalText: "Are you sure you want to reset your password?"});
    //             break;
    //         case "apikey":
    //             this.setState({currentModal: btnID, modalText: "Are you sure you want to generate a new Api Key?"});
    //             break;
    //     }
    //     this.setState({show: true});
    // }
    //
    // handleConfirm() {
    //     var currentModal = this.state.currentModal;
    //     console.log(currentModal);
    //     switch(currentModal) {
    //         case "email":
    //             // Update email in mongodb
    //             break;
    //         case "password":
    //             var pw = document.getElementById("password").value;
    //             var pwConfirm = document.getElementById("confirmPassword").value;
    //             if (pw === pwConfirm) {
    //                 pw = md5(pw);
    //                 console.log("Should update password to - " + pw);
    //                 // Update password in mongodb
    //             } else {
    //                 window.alert("Passwords do not match");
    //             }
    //             break;
    //         case "apikey":
    //             var newApiKey = this.generateApiKey();
    //             console.log(newApiKey);
    //             // Update api key in mongodb
    //             this.setState({apiKey: newApiKey});
    //             break;
    //     }
    //     this.handleClose();
    // }
                
    // handleClose() {
    //     this.setState({show: false});
    // }

    render() {
        return(
           <Container>
               <Jumbotron className="rounded-bottom" fluid>
                   <Container>
                       <h2>Account</h2>
                   </Container>
               </Jumbotron>
               <Row style={{marginBottom: "25px"}}>
                    <Col>
                        <label htmlFor="email">Email:</label>
                        <InputGroup>
                            <FormControl
                                id="email"
                                placeholder="Email"
                                defaultValue={this.state.user ? this.state.user.email : ""}
                                aria-label="Email"
                                disabled
                                // aria-describedby="basic-addon2"
                            />
                            {/* <InputGroup.Append>
                                <Button id="changeemail" variant="outline-secondary" onClick={this.handleShow}>Update</Button>
                            </InputGroup.Append> */}
                        </InputGroup>
                    </Col>
               </Row>
               {/* <Row style={{marginBottom: "25px"}}>
                    <Col>
                        <InputGroup>
                            <FormControl
                                id="password"
                                name="password"
                                placeholder="Password"
                                aria-label="Password"
                            />
                        </InputGroup>
                    </Col>
                    <Col>
                        <InputGroup>
                            <FormControl
                                id="confirmPassword"
                                name="confirmPassword"
                                placeholder="Confirm password"
                                aria-label="Confirm password"
                            />
                            <InputGroup.Append>
                                <Button id="resetpw" variant="outline-secondary" onClick={this.handleShow}>Update</Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </Col>
               </Row> */}
               <Row>
                    <Col>
                        <label htmlFor="apikey">Api Key:</label>
                        <InputGroup>
                            <FormControl
                                id="apikey"
                                defaultValue={this.state.user ? this.state.user.apiKey : ""}
                                placeholder="Api Key"
                                aria-label="Api Key"
                                disabled
                            />
                            {/* <InputGroup.Append>
                                <Button id="apikey" variant="outline-secondary" onClick={this.handleShow}>Generate</Button>
                                <Modal show={this.state.show} onHide={this.handleClose} centered>
                                    <Modal.Header closeButton>
                                    <Modal.Title>Confirm Action</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>{this.state.modalText}</Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={this.handleClose}>
                                            Cancel
                                        </Button>
                                        <Button variant="primary" onClick={this.handleConfirm}>
                                            Confirm
                                        </Button>
                                    </Modal.Footer>
                                </Modal>
                            </InputGroup.Append> */}
                        </InputGroup>
                    </Col>
                </Row>
           </Container>
        );
    }
}

export default Account;