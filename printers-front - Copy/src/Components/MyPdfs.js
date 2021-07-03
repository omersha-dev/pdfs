import React from "react";
import axios from "axios";
import { Container, Row, Col, Form, ListGroup, Pagination } from "react-bootstrap";

const path = window.location.protocol + '//' + window.location.host.replace(":3000", "");
const perPage = 8;

class MyPdfs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            doneLoading: false,
            pdfs: null,
            pagination: [],
            page: 1
        }
        this.changePage = this.changePage.bind(this);
        this.getPdfs();
    }

    setPagination() {
        if (!this.state.pdfs) {
            return;
        }
        var pagesCount = Math.ceil(this.state.pdfs.length / perPage);
        var tempPagination = [];
        for (var i = pagesCount - 2; i <= pagesCount + 2; i++) {
            if (i < 0) {
                i = 0;
                continue;
            } else if (i === 0) {
                continue;
            }
            if (pagesCount < 3 && i === pagesCount + 1) {
                break;
            }
            tempPagination.push(
                <Pagination.Item key={i} pagenum={i} active={i === this.state.page} onClick={this.changePage} style={{cursor: "pointer"}} >
                    {i}
                </Pagination.Item>,
            );
        }
        this.setState({
            pagination: tempPagination
        });
    }

    changePage(e) {
        var clickedPage = e.currentTarget.getAttribute("pagenum");
        if (clickedPage == this.state.page) {
            return;
        }
        var currentActive = document.querySelector(".page-item.active")
        currentActive.classList.remove("active");
        // currentActive.children[0].tagName = "a";
        e.currentTarget.closest(".page-item").classList.add("active");
        this.setState({page: clickedPage});
    }

    getPdfs() {
        var config = {
            method: 'get',
            url: `${path}/api/pdfs/${this.props.brand}`,
            headers: { }
        };
        
        axios(config)
            .then((response) => {
                if (!response.data.pdfs.length) {
                    this.setState({ doneLoading: true });
                    return;
                }
                var pdfs = response.data.pdfs.reverse();
                this.setState({
                    doneLoading: true,
                    pdfs: pdfs
                });
                this.setPagination();
            })
            .catch((error) => {
                console.log(error);
            });
    }

    render() {
        if (this.state.doneLoading && this.state.pdfs) {
            return(
                <Container fluid>
                    <Row>
                        <Col>
                            {this.state.pdfs.slice(perPage * (this.state.page - 1), perPage * this.state.page).map((pdf, index) => {
                                return(
                                    <iframe title={this.state.pdf} src={path + "/pdf/" + this.props.brand + '/' + pdf.filename} />
                                )
                            })}
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Pagination>
                                <Pagination.First />
                                <Pagination.Prev />
                                {this.state.pdfs.length % perPage > 1 ? (
                                    <>
                                        {this.state.page > 3 ? (
                                            <Pagination.Ellipsis />
                                        ) : (
                                            <></>
                                        )}
                                        {this.state.pagination ? (
                                            this.state.pagination
                                        ) : (
                                            <></>
                                        )}
                                        {this.state.page < Math.floor(this.state.pdfs.length / perPage) ? (
                                            <Pagination.Ellipsis />
                                        ) : (
                                            <></>
                                        )}
                                    </>
                                ) : (
                                <></>
                                )}
                            </Pagination>
                        </Col>
                    </Row>
                </Container>
            )
        } else if (this.state.doneLoading && !this.state.pdfs) {
            this.getPdfs();
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