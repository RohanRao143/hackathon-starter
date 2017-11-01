import React from 'react';
//import ReactDOM from 'react-dom';
import axios from 'axios';


class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: []
        };
    }

    componentDidMount() {
        axios.get(`api/venueslist`)
            .then(res => {
                const venueslist= res.data.venuelist;
                this.setState({data:venueslist})
                console.log(this.state.data)
            });
    }


    render() {
        return (
                <tbody>
                {this.state.data.map((venue,i)=>
                    <TableRow key={i} data={venue} />
                )}
                </tbody>
        );
    }
}

class TableRow extends React.Component{
    render(){
        return(
            <tr>
                <td>{this.props.data.name}</td>
                <td>{this.props.data._id}</td>
            </tr>
        );
    }
}

export default App;