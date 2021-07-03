import React from 'react';
import {
    Container
} from 'react-bootstrap';
// import {
//     Container,
//     Row,
//     Col
// } from 'react-bootstrap';
// import {
//     BiSave,
//     BiStar,
//     BiPrinter,
//     BiChevronDown,
//     BiFullscreen,
//     BiWindows
// } from 'react-icons/bi'
// import {
//     RiUploadCloud2Line
// } from 'react-icons/ri';
// import {
//     CgSearchLoading
// } from 'react-icons/cg';
// import {
//     FaRegFilePdf
// } from 'react-icons/fa';
// import {
//     FiArrowDownCircle,
//     FiArrowUpCircle,
//     FiZoomIn,
//     FiZoomOut
// } from 'react-icons/fi';
// import {
//     VscChromeMinimize
// } from 'react-icons/vsc';
// import {
//     AiOutlineClose
// } from 'react-icons/ai';
// 
// import '../Styles/demoPdf.css';

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            step: 0
        };
    }

    render() {
        return(
            <div>
                <Container>
                    <h1>Here will be the homepage</h1>
                </Container>
            </div>
            // <Container fluid>
            //     <Row>
            //         <Col className="section01 test" lg={12}>
            //             <h1>PDFeast</h1>
            //             <h3>Automate Pdf files generation</h3>
            //             <h3>Intuitive drag and drop template creator</h3>
            //             <h3>Generate Pdfs files using an API</h3>
            //         </Col>
            //     </Row>
            //     <Row>
            //         <Col lg={3}></Col>
            //         <Col lg={6}>
            //             <div className="demoPdf demoPdfContainer">
            //                 <div className="demoPdfHeader">
            //                     <Row className="programBar" >
            //                         <Col lg={10}>
            //                             <span className="barIcon"><FaRegFilePdf /></span>
            //                             <span className="barTitle">Example_Pdf.pdf</span>
            //                         </Col>
            //                         <Col className="windowControlContainer" lg={2}>
            //                             <span className="windowControl lower"><VscChromeMinimize /></span>
            //                             <span className="windowControl resize"><BiWindows /></span>
            //                             <span className="windowControl close_program"><AiOutlineClose /></span>
            //                         </Col>
            //                     </Row>
            //                     <Row className="demoPdf">
            //                         <Col className="systemBar" lg={12}>
            //                             <span className="demoPdfSystem File">File</span>
            //                             <span className="demoPdfSystem Edit">Edit</span>
            //                             <span className="demoPdfSystem View">View</span>
            //                             <span className="demoPdfSystem Sign">Sign</span>
            //                             <span className="demoPdfSystem Window">Window</span>
            //                             <span className="demoPdfSystem Help">Help</span>
            //                         </Col>
            //                     </Row>
            //                     <Row className="demoPdf demoPdfTabContainer">
            //                         <Col lg={3} className="demoPdfTab">
            //                             <div className="demoPdfTabInner">
            //                                 <span className="demoPdfFileName">Example1.pdf</span>
            //                                 <span className="demoPdfCloseTab">x</span>
            //                             </div>
            //                         </Col>
            //                         <Col lg={3} className="demoPdfTab active">
            //                             <div className="demoPdfTabInner active">
            //                                 <span className="demoPdfFileName">Example2.pdf</span>
            //                                 <span className="demoPdfCloseTab">x</span>
            //                             </div>
            //                         </Col>
            //                         <Col lg={6} className="demoPdfTab"></Col>
            //                     </Row>
            //                     <Row className="demoPdf actionsAndNavs">
            //                         <Col lg={3}>
            //                             <span className="demoPdfActions Save"><BiSave /></span>
            //                             <span className="demoPdfActions Favorite"><BiStar /></span>
            //                             <span className="demoPdfActions Upload"><RiUploadCloud2Line /></span>
            //                             <span className="demoPdfActions Print"><BiPrinter /></span>
            //                             <span className="demoPdfActions Search"><CgSearchLoading /></span>
            //                         </Col>
            //                         <Col className="demoPdfNavContainer" lg={6}>
            //                             <span className="demoPdfNav PageUp"><FiArrowUpCircle /></span>
            //                             <span className="demoPdfNav PageDown"><FiArrowDownCircle /></span>
            //                             <span className="demoPdfNav Pages">1/11</span>
            //                             <span className="demoPdfNav ZoomOut"><FiZoomOut /></span>
            //                             <span className="demoPdfNav ZoomOut"><FiZoomIn /></span>
            //                             <span className="demoPdfNav ZoomList">100% <BiChevronDown /></span>
            //                             <span className="demoPdfNav FullScreen"><BiFullscreen /></span>
            //                         </Col>
            //                         <Col lg={3}></Col>
            //                     </Row>
            //                     <Row className="demoPdf pageViewContainer">
            //                         <Col className="pdfPageSide" lg={1}></Col>
            //                         <Col lg={10}>
            //                             <Row className="pageContainer">
            //                                 <Col lg={2}></Col>
            //                                 <Col className="pdfPage" lg={8}>
            //                                     <h3>PDFeast</h3>
            //                                     <p>Automate Pdf files generation using templates build with an intuitive drag and drop interface or with good old HTML</p>
            //                                 </Col>
            //                                 <Col lg={2}></Col>
            //                             </Row>
            //                         </Col>
            //                         <Col className="pdfPageSide" lg={1}></Col>
            //                     </Row>
            //                 </div>
            //             </div>
            //         </Col>
            //         <Col lg={3}></Col>
            //     </Row>
            // </Container>
        );
    }
}

export default Home;