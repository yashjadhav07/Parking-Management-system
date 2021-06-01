import React from 'react';
import { Form, Button, Row, Container, Col } from 'react-bootstrap';

const FeedbackForm = ({ validated, feedbackHandler, inputChangeHandler, feedback: { f_title, f_description }, feedbackError, errorMessage }) => {
    return (
        <Form noValidate validated={validated} onSubmit={feedbackHandler}>
            <h4>Feedback</h4>
            <Form.Group controlId="feedbackTitle">
                <Form.Label>Title *</Form.Label>
                <Form.Control type="title" placeholder="Enter Title" name="f_title" value={f_title} onChange={inputChangeHandler} required />
            </Form.Group>

            <Form.Group controlId="feedbackDescription">
                <Form.Label>Description *</Form.Label>
                <Form.Control type="text" placeholder="Enter Description" name="f_description" value={f_description} onChange={inputChangeHandler} required />
            </Form.Group>

            {feedbackError ? <div className="error m-10"><span>{errorMessage}</span></div> : null}
            <Button variant="primary" type="submit">
                Submit
            </Button>
        </Form>
    );
}

class GiveFeedback extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            validated: false,
            feedbackDetail: {
                f_title: '',
                f_description: ''
            },
            loginError: false,
            errorMessage: ''
        }
    }
    
    inputChangeHandler(e) {
        let { name, value } = e.currentTarget;
        let { feedbackDetail: feedbackData } = this.state;
        feedbackData[name] = value;
        this.setState({ feedbackDetail: feedbackData })
    }
    
    feedbackHandler(e) {
        e.preventDefault();
        const form = e.currentTarget;
        let loggedinUser = localStorage.getItem("loggedinUser");
        loggedinUser = JSON.parse(loggedinUser);
        
        if (!form.checkValidity()) {
            e.stopPropagation();
            this.setState({ validated: true });
            return false;
        }

        let { f_title: title, f_description: description } = this.state.feedbackDetail;
        let body = {
            title,
            description,
            byuser: loggedinUser.u_name
        };
        
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(body)
        };
        
        fetch('http://localhost:3005/api/givefeedback', requestOptions)
            .then(data => {
                if (data.success) {
                    console.log(" data ", data);
                    window.location.reload(false);
                } else {
                    this.setState({ loginError: true, errorMessage: data.message });
                }
            })
            .catch(error => console.log('error', error));
    }
    render() {
        console.log(this.state)
        return (
            <div>
                <Container>
                    <Row style={{ margin: 50 }}>
                        <Col></Col>
                        <Col xs="6" md="6"><FeedbackForm validated={this.state.validated} feedback={this.state.feedbackDetail} loginError={this.state.loginError} errorMessage={this.state.errorMessage} inputChangeHandler={this.inputChangeHandler.bind(this)} feedbackHandler={this.feedbackHandler.bind(this)}></FeedbackForm></Col>
                        <Col></Col>
                    </Row>
                </Container>
            </div>
        )
    }
}

export default GiveFeedback;