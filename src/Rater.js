import React from 'react';
import Form from 'react-bootstrap/Form';

class Rater extends React.Component{
    constructor(props){
        super(props);
        this.state={
            rating:'',
            rec: []
        };
        this.handleRatingChange = this.handleRatingChange.bind(this);
    }
    
    handleRatingChange = async event => {
       
        let promise = this.setState({rating: event.target.value});
        let result = await promise; 
        this.props.getRec(this.props.data, this.state.rating);
    }



    render(){
        return(
            <Form.Group controlId="formRating">
                 <Form.Label style={{fontWeight: "bold", fontSize:"18px"}}>Rating: </Form.Label>
                 <Form.Control as="select" onChange={this.handleRatingChange}>
                    <option value="Not Rating">No Rating</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </Form.Control>
            </Form.Group>
            
        )       
    }
}

export default Rater;