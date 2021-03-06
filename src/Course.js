import React from 'react';
import './App.css';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Accordion from 'react-bootstrap/Accordion';
import Warning from './Warning';


class Course extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      showModal: false,
      showHelp: false,
      showConfirm: false
    }
  }

  closeHelp(){
    this.setState({showHelp: false});
  }
  
  showHelpModal(){
    console.log("here");
    this.setState({showHelp: true});
  }

  showConfirm(){
    this.setState({showConfirm: true, showModal:false});
    
  }

  closeConfirm(){
    this.setState({showConfirm: false, showModal:true});
  }


  render() {
    if(this.props.cartMode === true){
      return (
        <Card style={{width: '33%', marginTop: '5px', marginBottom: '5px'}}>
          <Card.Body>
            <Button variant="info" onClick={()=>this.showHelpModal()}>Help</Button>
            <Modal show={this.state.showHelp} onHide={() => this.closeHelp()}>
                <Modal.Header closeButton>
                  <Modal.Title id="contained-modal-title-vcenter">
                  Help page
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <h4>How to Remove a Section or Subsection</h4>
                  <ol>
                    <li>Click View Sections</li>
                    <li>Find the section you added to cart</li>
                    <li>Click the Remove Section or Remove Subsection button to remove a section or subsection </li>
                  </ol>
                </Modal.Body>
                <Modal.Footer>
                  <Button onClick={() => this.closeHelp()}>Close</Button>
                </Modal.Footer>
              </Modal>

            <Card.Title> 
              <div style={{maxWidth: 250}}>
                {this.props.data.name}
              </div>
              {this.getExpansionButton()}
            </Card.Title>
            <Card.Subtitle className="mb-2 text-muted">{this.props.data.number} - {this.getCredits()}</Card.Subtitle>
            {this.getDescription()}
            <Warning data={this.props.data} compCourses={this.props.compCourses}/>
            <Button variant='dark' onClick={() => this.openModal()}>View sections</Button>
          </Card.Body>

          <Modal show={this.state.showModal} onHide={() => this.closeModal()} centered>
            <Modal.Header closeButton>
              <Modal.Title>{this.props.data.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {this.getSections()}
            </Modal.Body>
            <Modal.Footer>
              {this.getCourseButton()}
              <Button variant="secondary" onClick={() => this.closeModal()}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>

          {/* {<Modal show={this.state.showConfirm} onHide={() => this.closeConfirm()}>
          <Modal.Header closeButton>
            </Modal.Header>
            <Modal.Body>Are you sure you want to delete this Section or Subsection?</Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={()=>this.confirmRemove()}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => this.closeConfirm}>
                Remove Section 
              </Button>
            </Modal.Footer>
          </Modal>} */}

        </Card>
      )
    } else{
      return (
        <Card style={{width: '33%', marginTop: '5px', marginBottom: '5px'}}>
          <Card.Body>
            <Card.Title>
              <div style={{maxWidth: 250}}>
                {this.props.data.name}
              </div>
              {this.getExpansionButton()}
            </Card.Title>
            <Card.Subtitle className="mb-2 text-muted">{this.props.data.number} - {this.getCredits()}</Card.Subtitle>
            {this.getDescription()}
            <Button variant='dark' onClick={() => this.openModal()}>View sections</Button>
          </Card.Body>
          <Modal show={this.state.showModal} onHide={() => this.closeModal()} centered>
            <Modal.Header closeButton>
              <Modal.Title>{this.props.data.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {this.getSections()}
            </Modal.Body>
            <Modal.Footer>
              {this.getCourseButton()}
              <Button variant="secondary" onClick={() => this.closeModal()}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </Card>
      )
    }
    
  }

  getCourseButton() {
    let buttonVariant = 'dark';
    let buttonOnClick = () => this.addCourse();
    let buttonText = 'Add Course';

    if(this.props.courseKey in this.props.cartCourses) {
      buttonVariant = 'outline-dark';
      buttonOnClick = () => this.removeCourse();
      buttonText = 'Remove Course'
    }

    return (
      <Button variant={buttonVariant} onClick={buttonOnClick}>
        {buttonText}
      </Button>
    )
  }

  getSections() {
    let sections = [];
    
    for (let i =0; i < this.props.data.sections.length; i++){
      sections.push (
          <Card key={i}>
            <Accordion.Toggle as={Card.Header} variant="link" eventKey={i} style={{height: 63, display: 'flex', alignItems: 'center'}}>
              {"Section " + i}
              {this.getSectionButton(i)}
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={i}>
              <Card.Body>
                {JSON.stringify(this.props.data.sections[i].time)}
                {this.getSubsections(i, this.props.data.sections[i])}
              </Card.Body>
            </Accordion.Collapse>
          </Card>
      )
    }

    return (
      <Accordion defaultActiveKey="0">
        {sections}
      </Accordion>
    )
  }

  getSectionButton(section) {
    let buttonVariant = 'dark';
    let buttonOnClick = (e) => this.addSection(e, section);
    let buttonText = 'Add Section';

    if(this.props.courseKey in this.props.cartCourses) {
      if(section in this.props.cartCourses[this.props.courseKey]) {
        buttonVariant = 'outline-dark';
        buttonOnClick = (e) => this.removeSection(e, section);
        buttonText = 'Remove Section';
      }
    }

    return <Button variant={buttonVariant} onClick={buttonOnClick} style={{position: 'absolute', right: 20}}>{buttonText}</Button>
  }

  addCourse() {
    this.props.addCartCourse (
      {
        course: this.props.courseKey
      }
    );
  }
  
  removeCourse() {
    this.props.removeCartCourse (
      {
        course: this.props.courseKey
      }
    );
  }

  addSection(e, section) {
    e.stopPropagation();
    this.props.addCartCourse (
      {
        course: this.props.courseKey,
        section: section
      }
    );
  }

  removeSection(e, section) {
    e.stopPropagation();
    this.props.removeCartCourse (
      {
        course: this.props.courseKey,
        section: section
      }
    );
  }

  //   closeConfirm(){
  //     this.setState({confirmSectionModal: false });
  //   }
    
  //   showConfirm(){
  //     this.setState({confirmSectionModal: !this.state.confirmModal});
  //   }

  confirmRemove(e,section){
    this.showConfirm();
  
  }

  addSubsection(e, section, subsection) {
    e.stopPropagation();
    this.props.addCartCourse (
      {
        course: this.props.courseKey,
        section: section,
        subsection: subsection
      }
    );
  }

  removeSubsection(e, section, subsection) {
    e.stopPropagation();
    this.props.removeCartCourse (
      {
        course: this.props.courseKey,
        section: section,
        subsection: subsection
      }
    );

  }
  // confirmShowSubsectionModal(){
  //   this.setState({confirmRemoveSubsection: !this.state.confirmSubsectionModal});
  // }
  
  // closeSubsectionModal(){
  //   this.setState({confirmRemoveSubsection: false});
  // }

  // confirmRemoveSubsection(e, section, subsection){
  //   return(  
  //     <Modal show={this.state.confirmRemoveModal} onHide={this.closeSubsectionModal()}>
  //       <Modal.Header closeButton>
  //       </Modal.Header>
  //       <Modal.Body>Are you sure you want to delete this Subsection?</Modal.Body>
  //       <Modal.Footer>
  //         <Button variant="danger" onClick={this.confirmShowSubsectionModal}>
  //           Cancel
  //         </Button>
  //         <Button variant="primary" onClick={this.removeSubsection(e,section,subsection)}>
  //           Remove Subsection
  //         </Button>
  //       </Modal.Footer>
  //     </Modal>
  //     )
  // }

  getSubsections(sectionKey, sectionValue) {
    let subsections = [];

    for (let i =0; i < sectionValue.subsections.length; i++){  
    subsections.push (
        <Card key={i}>
          <Accordion.Toggle as={Card.Header} variant="link" eventKey={i} style={{height: 63, display: 'flex', alignItems: 'center'}}>
            {i}
            {this.getSubsectionButton(sectionKey, i)}
          </Accordion.Toggle>
          <Accordion.Collapse eventKey={i}>
            <Card.Body>
              {JSON.stringify(sectionValue.subsections[i].time)}
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      )
    }

    return (
      <Accordion defaultActiveKey="0">
        {subsections}
      </Accordion>
    )
  }

  getSubsectionButton(section, subsection) {
    let buttonVariant = 'dark';
    let buttonOnClick = (e) => this.addSubsection(e, section, subsection);
    let buttonText = 'Add Subsection';

    if(this.props.courseKey in this.props.cartCourses) {
      if(section in this.props.cartCourses[this.props.courseKey]) {
        if(this.props.cartCourses[this.props.courseKey][section].indexOf(subsection) > -1) {
          buttonVariant = 'outline-dark';
          buttonOnClick = (e) => this.removeSubsection(e,section,subsection);
          buttonText = 'Remove Subsection';
        }
      }
    }

    return <Button variant={buttonVariant} onClick={buttonOnClick} style={{position: 'absolute', right: 20}}>{buttonText}</Button>
  }

  openModal() {
    this.setState({showModal: true});
  }

  closeModal() {
    this.setState({showModal: false});
  }

  setExpanded(value) {
    this.setState({expanded: value});
  }

  getExpansionButton() {
    let buttonText = '???';
    let buttonOnClick = () => this.setExpanded(true);

    if(this.state.expanded) {
      buttonText = '???';
      buttonOnClick = () => this.setExpanded(false)
    }

    return (
      <Button variant='outline-dark' style={{width: 25, height: 25, fontSize: 12, padding: 0, position: 'absolute', right: 20, top: 20}} onClick={buttonOnClick}>{buttonText}</Button>
    )
  }

  getDescription() {
    if(this.state.expanded) {
      return (
        <div>
          {this.props.data.description}
        </div>
      )
    }
  }

  getCredits() {
    if(this.props.data.credits === 1)
      return '1 credit';
    else
      return this.props.data.credits + ' credits';
  }

}

export default Course;
