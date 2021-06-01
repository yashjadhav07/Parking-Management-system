import React from 'react';
import { Navbar, NavLink, Button, Nav } from 'react-bootstrap';

function signoutFunction() {
    console.log("Sign out");
    localStorage.removeItem("loggedinUser");
    window.location.pathname = "/";
}
const Header = () => {
    let loggedinUser = localStorage.getItem("loggedinUser");
    let canInitialize = false;
    let canSeeReports = false;
    let canSeeFeedbacks = false;
    let canGiveFeedback = false;
    let canSeeMyFeedbacks = false;

    if (loggedinUser) {
        loggedinUser = JSON.parse(loggedinUser);
        canInitialize = loggedinUser.previlage.canInitialize;
        canSeeReports = loggedinUser.previlage.canSeeReports;
        canSeeFeedbacks = loggedinUser.previlage.canSeeFeedbacks;
        canGiveFeedback = loggedinUser.previlage.canGiveFeedback;
        canSeeMyFeedbacks = loggedinUser.previlage.canSeeMyFeedbacks;
    }
    return (
        <Navbar bg="light" expand="lg">
            <Navbar.Brand href="/dashboard">Parking Management</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav" >
                <Nav className="mr-auto">
                    {loggedinUser !== null ? <NavLink href="/dashboard">Dashboard</NavLink> : null}
                    {canInitialize ? <NavLink href="/initialize">Initialize</NavLink> : null}
                    {canSeeReports ? <NavLink href="/report">Reports</NavLink> : null}
                    {canSeeFeedbacks ? <NavLink href="/view_all_feedbacks">View Feedback</NavLink> : null}
                    {canSeeMyFeedbacks ? <NavLink href="/view_my_feedbacks">View My Feedback</NavLink> : null}
                    {canGiveFeedback ? <NavLink href="/give_feedback">Give Feedback</NavLink> : null}
                </Nav>
                <span className="mlr-10">{loggedinUser !== null ? loggedinUser.u_name : null}</span>
                {loggedinUser !== null ? <Button variant="outline-success" onClick={signoutFunction.bind()}>Sign Out</Button> : null}
            </Navbar.Collapse>
        </Navbar>
    );
}

export default Header;