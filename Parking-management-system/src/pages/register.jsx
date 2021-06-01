import React from 'react';
import { Form, Button, Row, Container } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
//import { v4 as uuidv4 } from 'uuid';

const RegisterForm = ({ validated, signUpHandler, inputChangeHandler, user: { u_name, u_email, u_password, u_type }, loginError, errorMessage }) => {
    return (
        <Form noValidate validated={validated} onSubmit={signUpHandler}>
            <h4>Welcome to Parking Management</h4>
            <Form.Group controlId="signinEmail">
                <Form.Label>Name*</Form.Label>
                <Form.Control type="name" placeholder="Enter name" name="u_name" value={u_name} onChange={inputChangeHandler} required />
            </Form.Group>

            <Form.Group controlId="signinEmail">
                <Form.Label>Email address*</Form.Label>
                <Form.Control type="email" placeholder="Enter email" name="u_email" value={u_email} onChange={inputChangeHandler} required />
            </Form.Group>

            <Form.Group controlId="signinPassword">
                <Form.Label>Password*</Form.Label>
                <Form.Control type="password" placeholder="Password" name="u_password" value={u_password} onChange={inputChangeHandler} required />
            </Form.Group>

            <Form.Group controlId="signinPassword">
                <Form.Label>User Type*</Form.Label>
                <Form.Control as="select" placeholder="Type" name="u_type" value={u_type} onChange={inputChangeHandler} required>
                    <option key={1} value={"agent"}>User</option>
                    <option key={2} value={"assistant"}>Admin</option>
                </Form.Control>
            </Form.Group>

            {loginError ? <div className="error m-10"><span>{errorMessage}</span></div> : null}
            <Button variant="primary" type="submit">
                Register
            </Button>
            <Button variant="outline-secondary" type="submit" href="/" className="ml-2">
                Login
            </Button>
        </Form>
    );
}

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            validated: false,
            userDetail: {
                u_id: '',
                u_name: '',
                u_email: '',
                u_password: '',
                u_type: ''
            },
            loginError: false,
            errorMessage: ''
        }
    }
    
    inputChangeHandler(e) {
        let { name, value } = e.currentTarget;
        let { userDetail: userData } = this.state;
        userData[name] = value;
        this.setState({ userDetail: userData })
    }
    
    signUpHandler(e) {
        e.preventDefault();
        const form = e.currentTarget;
        
        if (!form.checkValidity()) {
            e.stopPropagation();
            this.setState({ validated: true });
            return false;
        }

        let { u_name: name, u_password: password, u_email: email, u_type: type } = this.state.userDetail;
        let body = {
            name,
            password,
            email,
            type
        };
        
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(body)
        };
        
        fetch('http://localhost:3005/api/register', requestOptions)
            .then(res => res.json())
            .then(data => {
                console.log(data)
                if (data.success) {
                    console.log(" data ", data);
                    window.location.pathname = "/";
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
                        <Col xs="12" md="6"><RegisterForm validated={this.state.validated} user={this.state.userDetail} loginError={this.state.loginError} errorMessage={this.state.errorMessage} inputChangeHandler={this.inputChangeHandler.bind(this)} signUpHandler={this.signUpHandler.bind(this)}></RegisterForm></Col>
                        <Col></Col>
                    </Row>
                </Container>
            </div>
        )
    }
}

export default Register;