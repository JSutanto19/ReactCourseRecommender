import React from 'react';
import Card from 'react-bootstrap/Card';
import Rater from './Rater';


class Completed extends React.Component{

    render(){
        return(
            <div>
              <Card style={{width: '33%', marginTop: '12px', marginBottom: '5px'}}>
                  <Card.Body>
                    <Card.Title>
                        <div style={{maxWidth: 250}}>
                            {this.props.data.name}
                        </div>
                    </Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{this.props.data.number} - {this.props.data.credits} Credits</Card.Subtitle>
                    <Rater data={this.props.data} getRec={this.props.getRec}/>
                  </Card.Body>
              </Card>
            </div>
       )       
    }
}

export default Completed;