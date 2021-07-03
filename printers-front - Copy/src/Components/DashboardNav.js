import React from 'react';
import Cookie from 'universal-cookie';
import {
    Col,
    Nav
} from 'react-bootstrap';

const cookie = new Cookie();


class DashboardNav extends React.Component {
    
    // const { path, url } = useRouteMatch();
    constructor(props) {
        super(props);
        this.state = {
            active: "dashboard"
        }
        // var self = this;
    }

    render() {
        return(
            <Col>
                <Nav defaultActiveKey="#" className="flex-column flex-grow-1">
                    {/* <Nav.Link href={`${url}/`}>Dashboard</Nav.Link>
                    <Nav.Link href={`${url}/mypdfs`}>Link</Nav.Link> */}
                    <Nav.Link href="/dashboard/">Active</Nav.Link>
                    <Nav.Link href="/dashboard/mypdfs">Link</Nav.Link>
                </Nav>
            </Col>
        );
    }

}

export default DashboardNav;