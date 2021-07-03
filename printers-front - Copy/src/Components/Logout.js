import React from 'react';
import Cookie from 'universal-cookie';

const cookie = new Cookie();

class Logout extends React.Component {

    constructor(props) {
        super(props);
        this.logout();
    }

    logout() {
        console.log("Logout");
        cookie.remove("brand");
        cookie.remove("validationKey");
        console.log(cookie.get("brand"));
        this.setState({
            isLoggedIn: false
        });
        window.location.replace(window.location.protocol + '//' + window.location.host);
    }

}

export default Logout;