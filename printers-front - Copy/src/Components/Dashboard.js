import React from "react";
import axios from "axios";
import {
    Row,
    CardDeck,
    Card,
    Container
} from "react-bootstrap"
import moment from "moment";
import Cookie from "universal-cookie";

const cookie = new Cookie();

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
        var config = {
            method: 'get',
            url: `http://3.66.248.51/api/pdfs/${cookie.get("website")}`,
            headers: { }
        };
        
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
                <h3>Transformations</h3>
                <Row>
                    <CardDeck style={{width: "100%"}}>
                        <Card>
                            <Card.Header>Total</Card.Header>
                            <Card.Body>
                                <Card.Title>{this.state.pdfsByDates ? this.state.pdfsByDates.total.length : 0}</Card.Title>
                            </Card.Body>
                        </Card>
                        <Card>
                            <Card.Header>Today</Card.Header>
                            <Card.Body>
                                <Card.Title>{this.state.pdfsByDates ? this.state.pdfsByDates.today.length : 0}</Card.Title>
                            </Card.Body>                        
                        </Card>
                        <Card>
                            <Card.Header>Last Week</Card.Header>
                            <Card.Body>
                                <Card.Title>{this.state.pdfsByDates ? this.state.pdfsByDates.lastWeek.length : 0}</Card.Title>
                            </Card.Body>                        
                            </Card>
                        <Card>
                            <Card.Header>Last Month</Card.Header>
                            <Card.Body>
                                <Card.Title>{this.state.pdfsByDates ? this.state.pdfsByDates.lastMonth.length : 0}</Card.Title>
                            </Card.Body>                       
                            </Card>
                    </CardDeck>
                </Row>
                <h3>Prints</h3>
                <Row>
                    <CardDeck style={{width: "100%"}}>
                        <Card>
                            <Card.Header>Total</Card.Header>
                            <Card.Body>
                                <Card.Title>{this.state.printByDates ? this.state.printByDates.total.length : 0}</Card.Title>
                            </Card.Body>
                        </Card>
                        <Card>
                            <Card.Header>Today</Card.Header>
                            <Card.Body>
                                <Card.Title>{this.state.printByDates ? this.state.printByDates.today.length : 0}</Card.Title>
                            </Card.Body>                        
                        </Card>
                        <Card>
                            <Card.Header>Last Week</Card.Header>
                            <Card.Body>
                                <Card.Title>{this.state.printByDates ? this.state.printByDates.lastWeek.length : 0}</Card.Title>
                            </Card.Body>                        
                            </Card>
                        <Card>
                            <Card.Header>Last Month</Card.Header>
                            <Card.Body>
                                <Card.Title>{this.state.printByDates ? this.state.printByDates.lastMonth.length : 0}</Card.Title>
                            </Card.Body>                       
                            </Card>
                    </CardDeck>
                </Row>
            </Container>
            );
        }
        
    }
    
    export default Dashboard;