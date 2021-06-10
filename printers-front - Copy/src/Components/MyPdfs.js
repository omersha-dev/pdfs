import React from "react";
import axios from "axios";
import { Row, Col, Form, ListGroup } from "react-bootstrap";

class MyPdfs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            doneLoading: false,
            pdfs: null,
            displayPdfs: null,
            currentPdf: null
        }
        var self = this;
        var config = {
            method: 'get',
            url: `/api/pdfs/${this.props.website}`,
            headers: { }
        };
        
        axios(config)
        .then((response) => {
            if (!response.data.pdfs.length) {
                self.setState({ doneLoading: true });
                return;
            }
            var pdfs = response.data.pdfs.reverse();
            self.setState({
                doneLoading: true,
                pdfs: pdfs,
                displayPdfs: pdfs,
                currentPdf: pdfs["0"].filename
            });
        })
        .catch((error) => {
            console.log(error);
        });

        this.search = this.search.bind(this);
        this.changePdf = this.changePdf.bind(this);
    }

    search(e) {
        var searchQuery = e.target.value;
        if (this.state.pdfs) {
            var pdfs = [];
            for (const [key, value] of Object.entries(this.state.pdfs)) {
                // console.log(value);
                if (value["filename"].includes(searchQuery)) {
                    pdfs.push(value);
                }
            }
            this.setState({displayPdfs: pdfs});
        }
    }

    changePdf(e) {
        this.setState({currentPdf: e.target.value});
    }

    render() {
        if (this.state.doneLoading && this.state.pdfs) {
            return(
                // <Container fluid>
                    <Row>
                        <Col lg={2}>
                            <Form>
                                <Form.Control size="lg" type="text" placeholder="Pdf name" onChange={this.search} />
                            </Form>
                            <ListGroup style={{height: "550px", overflowY: "scroll"}}>
                                {this.state.displayPdfs.map((pdf, index) => {
                                    return(
                                        <ListGroup.Item
                                            action
                                            key={pdf}
                                            variant="light"
                                            style={{
                                                textAlign: "center",
                                                cursor: "pointer"
                                            }}
                                            onClick={this.changePdf}
                                            value={pdf.filename}
                                        >{pdf.filename}</ListGroup.Item>
                                    );
                                })}
                            </ListGroup>
                        </Col>
                        <Col lg={10}>
                            <iframe title={this.state.currentPdf} src={"http://pdfeast.com/pdf/" + this.props.website + '/' + this.state.currentPdf} style={{width: "98%", height: "100%", border: "none"}}/>
                        </Col>
                    </Row>
                // </Container>
            )
        } else if (this.state.doneLoading && !this.state.pdfs) {
            return(
                <p>No pdf's found</p>
            );
        } else {
            return(
                <p>Loading Pdf's...</p>
            );
        }
    }
}

export default MyPdfs;