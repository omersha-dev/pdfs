import React from "react";
import Register from './Register';
import Login from "./Login";

class LoginForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showRegister: false,
            // showLogin: cookies.get("login") ? true : false
        }
    }

    callbackFunc() {
        console.log("TEST");
    }

    render() {
        return(
            <div>
                <Register />
                <Login cb={this.callbackFunc} />
            </div>
        );
    }
}

export default LoginForm;