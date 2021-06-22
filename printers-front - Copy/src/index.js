import React from 'react';
import ReactDOM from 'react-dom';
import Cookie from 'universal-cookie';
import { HashRouter as Router } from "react-router-dom";

import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Header from './Components/Header';
import Home from './Components/Home';

const cookie = new Cookie();

// Packages declarations

ReactDOM.render(
	<div>
		<Router>
			<Header />
			<Router exact path="/">
				<Home />
			</Router>
			{/* <Route exact path="/">
				<Redirect to="/admin/dashboard" />
			</Route>
			<Route exact path="/admin/dashboard">
				<Dashboard />
			</Route>
			<Route exact path="/admin/mypdfs">
				<MyPdfs website={cookie.get("website")}/>
			</Route> */}
		</Router>
	</div>,
	document.getElementById('root')
);