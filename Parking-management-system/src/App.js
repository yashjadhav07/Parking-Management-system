import React from 'react';
import './App.css';
import { Container } from 'react-bootstrap';

import { Switch, Route, Redirect } from 'react-router';
import Dashboard from './pages/dashboard';
import Index from './pages';
import { BrowserRouter } from 'react-router-dom';
import Initialize from './pages/initialize';
import Feedback from './pages/giveFeedback';
import ViewAllFeedback from './pages/viewAllFeedback';
import Register from './pages/register';
import Report from './pages/report';
import Header from './components/header';
import Notfound from './pages/notfound';
import ViewMyFeedback from './pages/viewMyFeedback';


function App() {
    let loggedinUser = localStorage.getItem("loggedinUser");
    let isLoggedIn = false;
    
    if (loggedinUser !== undefined && loggedinUser !== null && loggedinUser !== "") isLoggedIn = true;
    else isLoggedIn = false;
    
    return (
        <Container fluid >
            <Header></Header>
            <Container>
                <BrowserRouter>
                    <Switch>
                        <Route exact path="/"> {isLoggedIn ? <Dashboard /> : <Index />}</Route>
                        <Route path="/register"> {isLoggedIn ? <Dashboard /> : <Register />}</Route>
                        <Route path="/dashboard">{isLoggedIn ? <Dashboard /> : <Redirect to="/" />}</Route>
                        <Route path="/initialize">{isLoggedIn ? <Initialize /> : <Redirect to="/" />}</Route>
                        <Route path="/give_feedback">{isLoggedIn ? <Feedback /> : <Redirect to="/" />}</Route>
                        <Route path="/view_all_feedbacks">{isLoggedIn ? <ViewAllFeedback /> : <Redirect to="/" />}</Route>
                        <Route path="/report">{isLoggedIn ? <Report /> : <Redirect to="/" />}</Route>
                        <Route path="/view_my_feedbacks">{isLoggedIn ? <ViewMyFeedback /> : <Redirect to="/" />}</Route>
                        <Route ><Notfound /></Route>
                    </Switch>
                </BrowserRouter>
            </Container>
        </Container>
    );
}

export default App;
