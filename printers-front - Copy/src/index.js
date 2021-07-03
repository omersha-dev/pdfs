import React from 'react';
import ReactDOM from 'react-dom';
// import Cookie from 'universal-cookie';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Header from './Components/FrontHeader';
import Home from './Components/Home';
import Login from './Components/Login';
import Register from './Components/Register';
import Dashboard from './Components/Dashboard';

// const cookie = new Cookie();

// Packages declarations

ReactDOM.render(
	<div>
		<Header />
		<Router>
			<main>
				<Switch>
					<Route path="/" component={Home} exact />
					<Route path="/pricing" component={Home} />
					<Route path="/login" component={Login} />
					<Route path="/join" component={Register} />
					<Route path="/features" component={Home} />
					<Route path="/about-us" component={Home} />
					<Route path="/ask-for-feature" component={Home} />
					<Route path="/updates" component={Home} />
					<Route path="/contact-us" component={Home} />
					<Route path="/dashboard" component={Dashboard} />
				</Switch>
			</main>
		</Router>
		{/* <Dashboard /> */}
	</div>,
	document.getElementById('root')
);