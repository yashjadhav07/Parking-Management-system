import React from 'react';
import { Accordion, Button, Card, Form, InputGroup, Table } from 'react-bootstrap';

class ViewAllFeedback extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            feedbackData: [],
            reply: ''
        }
    }
    
    componentDidMount() {
        fetch("http://localhost:3005/api/feedback")
            .then(res => res.json())
            .then(res => {
                console.log(res.feedback)
                if (res.success === true) {
                    this.setState({ feedbackData: res.feedback })
                }
            })
            .catch(err => console.log(err))
    }
    
    inputChangeHandler(e) {
        let { value } = e.currentTarget;
        this.setState({ reply: value });
    }
    
    replySubmit(id, reply) {
        let body = {
            id,
            reply
        };
        
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: JSON.stringify(body)
        };
        
        if (reply !== "") {
            fetch('http://localhost:3005/api/givefeedback/reply', requestOptions)
                .then(data => {
                    if (data.success) {
                        window.location.reload(false);
                    } else {
                        this.setState({ loginError: true, errorMessage: data.message });
                    }
                })
                .catch(error => console.log('error', error));
        }
    }
    
    render() {
        let { feedbackData } = this.state;
        return (
            <div>
                <div>
                    <Table responsive="sm">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Description</th>
                                <th>by User</th>
                                <th>Reply</th>
                            </tr>
                        </thead>
                        <tbody>
                            {feedbackData && feedbackData.map((v, i) => (
                                <tr key={i}>
                                    <td>{v.title}</td>
                                    <td>{v.description}</td>
                                    <td>{v.byuser}</td>
                                    <td>
                                    <Accordion>
                                        <Card>
                                            <Card.Header>
                                                <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                                    Give Reply
                                                </Accordion.Toggle>
                                            </Card.Header>
                                            <Accordion.Collapse eventKey="0">
                                                <Card.Body>
                                                    {v.reply ? "Previous Reply : "+v.reply : null}
                                                    <Form onSubmit={this.replySubmit(v.id, this.state.reply)}>
                                                        <InputGroup>
                                                            <Form.Control type="text" placeholder="Enter Title" name={v.id} value={this.state.reply} onChange={this.inputChangeHandler.bind(this)} aria-describedby="basic-addon2" required />
                                                            <InputGroup.Append>
                                                                <Button type="submit" variant="outline-secondary">
                                                                    Reply
                                                                </Button>
                                                            </InputGroup.Append>
                                                        </InputGroup>
                                                    </Form>
                                                </Card.Body>
                                            </Accordion.Collapse>
                                        </Card>
                                    </Accordion>    
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div>
        )
    }
}
export default ViewAllFeedback;