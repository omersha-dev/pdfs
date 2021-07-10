import React from "react";
import axios from "axios";
// import { Document, Page } from 'react-pdf';
import { Container, Row, Col, Pagination } from "react-bootstrap";
import '../Styles/MyPdfs.css';

const path = window.location.protocol + '//' + window.location.host.replace(":3000", "");

class MyPdfs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            perPage: this.setPerPage(),
            doneLoading: false,
            pdfs: null,
            pagination: [],
            page: 1
        }
        this.changePage = this.changePage.bind(this);
        this.setPerPage();
        this.getPdfs();
    }   
    
    handleResize = (e) => {
        this.setState({
            perPage: this.setPerPage()
        });
        this.setPagination();
    };

    componentDidMount() {
        window.addEventListener("resize", this.handleResize);
    }

    setPerPage() {
        if (window.innerWidth > 768) {
            return 4;
        } else if (768 >= window.innerWidth && window.innerWidth > 480) {
            return 2;
        } else {
            return 1;
        }
    }

    setPagination() {
        if (!this.state.pdfs) {
            return;
        }
        var pagesCount = Math.ceil(this.state.pdfs.length / this.state.perPage);
        var tempPagination = [];
        for (var i = 0; i <= pagesCount; i++) {
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
                <Pagination.Item key={i} className="pageLink" pagenum={i} active={i === 1} onClick={this.changePage} style={{cursor: "pointer"}} >
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
        var pagesCount = Math.ceil(this.state.pdfs.length / this.state.perPage);
        var newPagination = this.state.pagination;
        newPagination[0] =
            <Pagination.Item key={1} className="pageLink" pagenum={1} onClick={this.changePage} style={{cursor: "pointer"}} >
                {1}
            </Pagination.Item>
        newPagination[pagesCount - 1] =
            <Pagination.Item key={pagesCount} className="pageLink" pagenum={pagesCount} active={true} onClick={this.changePage} style={{cursor: "pointer"}} >
                {pagesCount}
            </Pagination.Item>
        this.setState({
            pagination: newPagination
        });
        if (clickedPage === this.state.page) {
            return;
        }
        var pageButtons = document.getElementsByClassName("pageLink");
        console.log(Math.ceil(this.state.pdfs.length / this.state.perPage));
        for (let btn of pageButtons) {
            btn.classList.remove("active");
        }
        if (parseInt(clickedPage) === 1) {
            document.getElementsByClassName("pageLink")[0].classList.add("active");
        } else if (parseInt(clickedPage) === Math.ceil(this.state.pdfs.length / this.state.perPage)) {
            newPagination[pagesCount - 1] =
                <Pagination.Item key={pagesCount} className="pageLink" pagenum={pagesCount} active={true} onClick={this.changePage} style={{cursor: "pointer"}} >
                    {pagesCount}
                </Pagination.Item>
            this.setState({
                pagination: newPagination
            });
        } else {
            var clickedPageButton = document.querySelector(`.page-link[pagenum="${clickedPage}"]`).parentElement;
            clickedPageButton.classList.add("active");
        }
        this.setState({page: parseInt(clickedPage)});
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
                            {this.state.pdfs.slice(this.state.perPage * (this.state.page - 1), this.state.perPage * this.state.page).map((pdf, index) => {
                                return(
                                    <Col key={index} style={{textAlign: "center"}}>
                                        {/* <Document
                                            file={path + "/pdf/" + this.props.brand + '/' + pdf.filename}
                                            // onLoadSuccess={onDocumentLoadSuccess}
                                        >
                                        </Document> */}
                                        <iframe title={this.state.pdf} className="pdf-view" src={path + "/pdf/" + this.props.brand + '/' + pdf.filename} />
                                    </Col>
                                )
                            })}
                    </Row>
                    <Row>
                        <Col style={{textAlign: "center"}}>
                            <Pagination style={{justifyContent: "center"}}>
                                <Pagination.First pagenum={1} onClick={this.changePage} />
                                {/* <Pagination.Prev pagenum={"-1"} onClick={this.changePage} /> */}
                                {Math.ceil(this.state.pdfs.length / this.state.perPage) > 1 ? (
                                    <>
                                        {/* {this.state.page > 3 ? (
                                            <Pagination.Ellipsis />
                                        ) : (
                                            <></>
                                        )} */}
                                        {this.state.pagination ? (
                                            // this.state.pagination
                                            this.state.page > 1 ? (
                                                    this.state.pagination.slice(this.state.page - 2, this.state.page + 1)
                                            ) : (
                                                this.state.pagination.slice(this.state.page - 1, this.state.page + 1)
                                            )
                                        ) : (
                                            <></>
                                        )}
                                        {/* <Pagination.Next pagenum={"+1"} onClick={this.changePage} /> */}
                                        {/* {this.state.page < Math.floor(this.state.pdfs.length / this.state.perPage) ? (
                                            <Pagination.Ellipsis />
                                        ) : (
                                            <></>
                                        )} */}
                                    </>
                                ) : (
                                <></>
                                )}
                                <Pagination.Last pagenum={Math.ceil(this.state.pdfs.length / this.state.perPage)} onClick={this.changePage} />
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