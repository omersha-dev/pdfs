import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Container } from 'react-bootstrap';
import Cookie from 'universal-cookie';
import axios from 'axios';
import Header from './Header';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';

const cookie = new Cookie();

class App extends React.Component {

    
    constructor(props) {
        super(props);
        let isCookieSet = cookie.get("brand");
        this.state = {
            isLoggedIn: isCookieSet ? true : false,
            currentUser: null
        }
        this.validateUser();
        this.login = this.login.bind(this);
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
                        this.logout();
                    } else {
                        this.setState({
                            isLoggedIn: true,
                            currentUser: response.data.message.user
                        });
                    }
                })
                .catch((err) => {
                    console.log(err.response.data.error.message);
                })
        } else if (!this.state.isLoggedIn && (cookie.get("brand") || cookie.get("validationKey"))) {
            this.logout();
        }
    }

    logout() {
        cookie.remove("brand", { path: '/' });
        cookie.remove("validationKey", { path: '/' });
        if (cookie.get("brand") === "undefined") {
            this.setState({
                isLoggedIn: false
            });
        }
        window.location.replace(window.location.protocol + '//' + window.location.host);
    }

    login(user) {
        cookie.set("brand", user.brand, {secure: true, sameSite: 'none'});
        cookie.set("validationKey", user.validationKey, {secure: true, sameSite: 'none'});
        this.setState({
            isLoggedIn: true,
            currentUser: user
        });
        window.location.replace(window.location.protocol + '//' + window.location.host + '/dashboard');
    }

    render() {
        return(
            <Container fluid style={{padding: "0"}}>
                <Header isLoggedIn={this.state.isLoggedIn} logoutCB={this.logout} user={this.state.currentUser ? this.state.currentUser : null}/>
                <Router>
                    <main>
                        <Switch>

                            <Route path="/" exact >
                                <Home user={this.state.currentUser}/>
                            </Route>

                            <Route path="/login" >
                                <Login loginCB={this.login} />
                            </Route>
                            
                            <Route path="/pricing" component={Home} />
                            <Route path="/join" component={Register} />
                            <Route path="/features" component={Home} />
                            <Route path="/about-us" component={Home} />
                            <Route path="/ask-for-feature" component={Home} />
                            <Route path="/updates" component={Home} />
                            <Route path="/contact-us" component={Home} />
                            <Route path="/dashboard" >
                                <Dashboard user={this.state.currentUser ? this.state.currentUser : null} />
                            </Route>
                        </Switch>
                    </main>
                </Router>
            </Container>
        )
    }

}

export default App;