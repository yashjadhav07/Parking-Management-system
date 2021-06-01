import React from 'react';
import { Table } from 'react-bootstrap';

class ViewMyFeedback extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            feedbackData: []
        }
    }
    componentDidMount() {
        let loggedinUser = localStorage.getItem("loggedinUser");
        loggedinUser = JSON.parse(loggedinUser);

        fetch(`http://localhost:3005/api/myfeedback/${loggedinUser.u_name}`)
            .then(res => res.json())
            .then(res => {
                console.log(loggedinUser.u_name)
                if (res.success === true) {
                    this.setState({ feedbackData: res.feedback })
                }
            })
            .catch(err => console.log(err))
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
                                <th>Reply</th>
                            </tr>
                        </thead>
                        <tbody>
                            {feedbackData && feedbackData.map((v, i) => (
                                <tr key={i}>
                                    <td>{v.title}</td>
                                    <td>{v.description}</td>
                                    <td>{v.reply}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div>
        )
    }
}
export default ViewMyFeedback;