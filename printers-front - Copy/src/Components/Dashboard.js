import React from "react";
import axios from "axios";
import { BrowserRouter as Router, Route } from "react-router-dom";
import {
    Row,
    Col,
    Container
} from "react-bootstrap"
import moment from "moment";
// import DashboardNav from "./DashboardNav";
import Statistics from "./Statistics";
import MyPdfs from "./MyPdfs";
import Account from "./Account";
import Cookie from "universal-cookie";
import ManageAccounts from "./ManageAccounts";

const cookie = new Cookie();
const path = window.location.protocol + '//' + window.location.host.replace(":3000", "");

class Dashboard extends React.Component {
    
    constructor(props) {

        
        super(props);
        this.state = {
            pdfs: null,
            pdfsByDates: {
                total: [],
                today: [],
                lastWeek: [],
                lastMonth: []
            },
            printByDates: {
                total: [],
                today: [],
                lastWeek: [],
                lastMonth: []
            }
        }
        var self = this;
        this.validateUser();
        var config = {
            method: 'get',
            url: `${path}/api/pdfs/${cookie.get("brand")}`,
            headers: { }
        };
        
        // Get the current website's pdfs
        axios(config)
        .then(function (response) {
            var pdfs = response.data.pdfs;
            self.setState({pdfs: pdfs});
            self.pdfByDates();
            self.printByDates();
        })
        .catch(function (error) {
            console.log(error);
        });
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
                        this.setState({
                            isLoggedIn: false
                        });
                        cookie.remove("brand");
                        cookie.remove("validationKey");
                        window.location.replace(window.location.protocol + '//' + window.location.host);
                    }
                })
                .catch((err) => {
                    console.log(err.response.data.error.message);
                })
        } else if ((cookie.get("brand") || cookie.get("validationKey")) && !this.state.isLoggedIn) {
            this.setState({
                isLoggedIn: false
            });
            cookie.remove("brand");
            cookie.remove("validationKey");
            window.location.replace(window.location.protocol + '//' + window.location.host);
        }
    }

    // Sort
    pdfByDates() {
        if (!this.state.pdfs) {
            return null;
        }

        var pdfsByDates = {
            total: [],
            today: [],
            lastWeek: [],
            lastMonth: []
        };
        var today = moment();
        // Run through all the pdfs creation date and push it into the right `pdfsByDates` key (today, lastWeek or lastMonth)
        // Also, increment the total pdfs count
        for (const [key, value] of Object.entries(this.state.pdfs)) {
            pdfsByDates.total.push(value);
            var pdfDate = moment(value["createdTime"]);
            var gap = today.diff(pdfDate, "days");
            if (gap === 0) {
                pdfsByDates.today.push(value);
            }
            if (gap >= 0 && gap <= 7) {
                pdfsByDates.lastWeek.push(value);
            }
            if (gap >= 0 && gap <= 30) {
                pdfsByDates.lastMonth.push(value);
            }
        };
        this.setState({pdfsByDates: pdfsByDates});
    }

    printByDates() {
        if (!this.state.pdfs) {
            return null;
        }

        var printByDates = {
            total: [],
            today: [],
            lastWeek: [],
            lastMonth: []
        };
        var today = moment();
        for (const [value] of Object.entries(this.state.pdfs)) {
            if (!value["printTime"]) {
                continue;
            }

            printByDates.total.push(value);
            var pdfDate = moment(value["printTime"]);
            var gap = today.diff(pdfDate, "days");
            console.log(value["createdTime"] + " | Gap = " + gap);
            if (gap === 0) {
                printByDates.today.push(value);
            }
            if (gap >= 0 && gap <= 7) {
                printByDates.lastWeek.push(value);
            }
            if (gap >= 0 && gap <= 30) {
                printByDates.lastMonth.push(value);
            }
        };
        this.setState({printByDates: printByDates});
    }
    
    // Continue MainView
    render() {
        return (
            <Container fluid>
                <Row>
                    {/* <Col lg={2}>
                        <DashboardNav />
                    </Col> */}
                    <Col>
                        <Router>
                            <Route
                                path="/dashboard"
                                render={({ match: { url } }) => (
                                    <>
                                        <Route path={`${url}/`} component={Statistics} exact />
                                        <Route path={`${url}/my-account`} component={Account} />
                                        <Route path={`${url}/accounts`} component={ManageAccounts} />
                                        <Route path={`${url}/mypdfs`} >
                                            <MyPdfs brand={this.props.brand ? this.props.brand : null} />
                                        </Route>
                                    </>
                                )}
                            />
                        </Router>
                    </Col>
                </Row>
            </Container>
            );
        }
        
    }
    
    export default Dashboard;