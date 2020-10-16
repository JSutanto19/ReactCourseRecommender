import React from 'react';
import './App.css';
import Sidebar from './Sidebar';
import CourseArea from './CourseArea';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allCourses: [],
      filteredCourses: [],
      subjects: [],
      cartCourses: {},
      showComp: false,
      completed: [],
      keywords: [],
      recommendedCourses: [],
      compRec:[]
    };
    this.getRecommendedCourses = this.getRecommendedCourses.bind(this);
  }



  componentDidMount() {
   this.loadInitialState()
   this.loadCompletedCourses()
  }

  async loadInitialState(){
    let courseURL = "http://mysqlcs639.cs.wisc.edu:53706/api/react/classes";
    let courseData = await (await fetch(courseURL)).json()


    this.setState({allCourses: courseData, filteredCourses: courseData, subjects: this.getSubjects(courseData), keywords: this.getKeywords(courseData)});
  }

  async loadCompletedCourses(){
    let url = "http://mysqlcs639.cs.wisc.edu:53706/api/react/students/5022025924/classes/completed";
    let response = await fetch(url);
    let courseData = await response.json()
    
    let arr = courseData.data;
    let comp = [];

    for(let i = 0; i < this.state.allCourses.length; ++i){
      for(let j = 0; j < arr.length; ++j){
         if(this.state.allCourses[i].number === arr[j]){
             comp.push(this.state.allCourses[i]);
         }
      }
    }
    this.setState({completed: comp});
  }


  getSubjects(data) {
    let subjects = [];
    subjects.push("All");

    for(let i = 0; i < data.length; i++) {
      if(subjects.indexOf(data[i].subject) === -1)
        subjects.push(data[i].subject);
    }

    return subjects;
  }

  getKeywords(data){
    let keywords = [];
    keywords.push("All");

    for(let i = 0; i < data.length; i++){
      for(let j = 0; j < data[i].keywords.length; ++j){
        if(keywords.indexOf(data[i].keywords[j]) === -1)
           keywords.push(data[i].keywords[j]);
      }
    }


    return keywords;
  }

  setCourses(courses) {
    this.setState({filteredCourses: courses})
  }

  addCartCourse(data) {
    let newCartCourses = JSON.parse(JSON.stringify(this.state.cartCourses))// I think this is a hack to deepcopy
    let courseIndex = this.state.allCourses.findIndex((x) => {return x.number===data.course})
    if (courseIndex === -1)
    {
      return 
    }

    if('subsection' in data) {
      if(data.course in this.state.cartCourses) {
        if(data.section in this.state.cartCourses[data.course]) {
          newCartCourses[data.course][data.section].push(data.subsection);
        }
        else {
          newCartCourses[data.course][data.section] = [];
          newCartCourses[data.course][data.section].push(data.subsection);
        }
      }
      else {
        newCartCourses[data.course] = {};
        newCartCourses[data.course][data.section] = [];
        newCartCourses[data.course][data.section].push(data.subsection);
      }
    }
    else if('section' in data) {
      if(data.course in this.state.cartCourses) {
        newCartCourses[data.course][data.section] = [];

        for(let i = 0; i < this.state.allCourses[courseIndex].sections[data.section].subsections.length; i++) {
          newCartCourses[data.course][data.section].push(this.state.allCourses[courseIndex].sections[data.section].subsections[i]);
        }
      
      
      }
      else {
        newCartCourses[data.course] = {};
        newCartCourses[data.course][data.section] = [];
        for(let i = 0; i < this.state.allCourses[courseIndex].sections[data.section].subsections.length; i++) { 
          newCartCourses[data.course][data.section].push(this.state.allCourses[courseIndex].sections[data.section].subsections[i]);
        }
      }
    }
    else {
      newCartCourses[data.course] = {};


      for (let i = 0; i < this.state.allCourses[courseIndex].sections.length; i++){
        newCartCourses[data.course][i] = [];

         for(let c= 0; c < this.state.allCourses[courseIndex].sections[i].subsections.length; c ++){
          newCartCourses[data.course][i].push(this.state.allCourses[courseIndex].sections[i].subsections[c]);
        }

      }


    }
    this.setState({cartCourses: newCartCourses});
  }

  removeCartCourse(data) {
    let newCartCourses = JSON.parse(JSON.stringify(this.state.cartCourses))

    if('subsection' in data) {
      newCartCourses[data.course][data.section].splice(newCartCourses[data.course][data.section].indexOf(data.subsection), 1);
      if(newCartCourses[data.course][data.section].length === 0) {
        delete newCartCourses[data.course][data.section];
      }
      if(Object.keys(newCartCourses[data.course]).length === 0) {
        delete newCartCourses[data.course];
      }
    }
    else if('section' in data) {
      delete newCartCourses[data.course][data.section];
      if(Object.keys(newCartCourses[data.course]).length === 0) {
        delete newCartCourses[data.course];
      }
    }
    else {
      delete newCartCourses[data.course];
    }
    this.setState({cartCourses: newCartCourses});
  }

  getCartData() {
    let cartData = [];

    for(const courseKey of Object.keys(this.state.cartCourses)) {
      let course = this.state.allCourses.find((x) => {return x.number === courseKey})

      cartData.push(course);
    }
    return cartData;
  }
  
  //iterate through courses and select courses from interest area 
     //score interest area by rating of completed courses that match interest areas 
     //based on scores then show courses with high interest area scores 
  
  getRecommendedCourses(course, rating){
    //let check = JSON.parse(JSON.stringify(this.state.compRec));
    let filtered = [];
    let check = [];

    if(rating !== 'No rating' && parseInt(rating, 10) >= 3){
      if(this.state.compRec.length === 0){
          //filter courses by keywords of passed in courses
          check.push(course);

          for(let i = 0; i < check[0].keywords.length; ++i){
            for(let j = 0; j < this.state.allCourses.length; ++j){
              for(let k = 0; k < this.state.allCourses[j].keywords.length; ++k){
                if(check[0].keywords[i] === this.state.allCourses[j].keywords[k]){
                  if(filtered.length === 0){
                    filtered.push(this.state.allCourses[j]);
                  } else {
                    if(this.checkRecsForDups(filtered, this.state.allCourses[j]) === -1){
                      filtered.push(this.state.allCourses[j]);
                    }
                  }
                }
              }
            }
          }
          filtered = this.deleteCompletedCourses(filtered);
          let temp = this.state.compRec;
          temp.push(course);
          this.setState({compRec: temp, recommendedCourses: filtered});

      }else{ 
          
          let duplicate = -1;
          //check for duplicates 

          for(let i = 0; i < check.length;++i){
            if(check[i] === course.number){
              duplicate = i;
            }
          }

          if(duplicate === -1){
            check.push(course);
          } 
          
          for(let i = 0; i < check.length; i++){
            for(let j = 0; j < check[i].keywords.length; ++j){
               for(let k = 0; k < this.state.allCourses.length; ++k){
                   if(this.state.allCourses[k].keywords.includes(check[i].keywords[j])){                        
                      if(filtered.length === 0){
                        filtered.push(this.state.allCourses[k]);
                      }else{
                        if(this.checkRecsForDups(filtered, this.state.allCourses[k]) === -1){
                          filtered.push(this.state.allCourses[k])
                        }
                      }
                   }
                 }
               }
            }
        
            filtered = this.deleteCompletedCourses(filtered);
            if(this.checkCompRec(course) === true){
              let temp = this.state.compRec;
              temp.push(course);
              this.setState({compRec: temp, recommendedCourses: filtered});
            } else{
              this.setState({recommendedCourses: filtered});
            }
            
       }
     } else{
      //check for duplicates 
      let duplicate = -1;
      check = this.state.compRec
       for(let i = 0; i < this.state.compRec.length;++i){
           if(check[i].number === course.number){
             duplicate = i;
           }
       }

       if(duplicate !== -1){
          check.splice(duplicate,1);
       }
       
       for(let i = 0; i < check.length; i++){
        for(let j = 0; j < check[i].keywords.length; ++j){
           for(let k = 0; k < this.state.allCourses.length; ++k){
               if(this.state.allCourses[k].keywords.includes(check[i].keywords[j])){                        
                  if(filtered.length === 0){
                    filtered.push(this.state.allCourses[k]);
                  }else{
                    if(this.checkRecsForDups(filtered, this.state.allCourses[k]) === -1){
                      filtered.push(this.state.allCourses[k])
                    }
                  }
               }
             }
           }
        }
        filtered = this.deleteCompletedCourses(filtered)
        this.setState({compRec: check, recommendedCourses: filtered});
    }
  }

  checkRecsForDups(arr, course){

    for(let i = 0; i < arr.length; ++i){
      if(arr[i].number === course.number){
        return i;
      }
    }

      return -1;
  }

  deleteCompletedCourses(arr){
    let newArr = arr;

    for(let i = 0; i < arr.length; ++i){
      for(let j = 0; j < this.state.completed.length;++j){
        if(arr[i].number === this.state.completed[j].number){
           newArr.splice(i,1);
        }
      }
    }
    return newArr;
  }

  checkCompRec(course){
     for(let i = 0; i < this.state.compRec.length;++i){
       if(this.state.compRec[i].number === course.number){
         return false;
       }
     }
     return true;
  }

  render() {
    return (
      <>
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
          integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
          crossOrigin="anonymous"
        />

        <Tabs defaultActiveKey="search" style={{position: 'fixed', zIndex: 1, width: '100%', backgroundColor: 'white'}}>
          <Tab eventKey="search" title="Search" style={{paddingTop: '5vh'}}>
            <Sidebar setCourses={(courses) => this.setCourses(courses)} courses={this.state.allCourses} subjects={this.state.subjects} keywords={this.state.keywords}/>
            <div style={{marginLeft: '20vw'}}>
              <CourseArea data={this.state.filteredCourses} addCartCourse={(data) => this.addCartCourse(data)} removeCartCourse={(data) => this.removeCartCourse(data)} cartCourses={this.state.cartCourses} compMode={false} cartMode={false}/>
            </div>
          </Tab>
          <Tab eventKey="cart" title="Cart" style={{paddingTop: '5vh'}}>
            <div style={{marginLeft: '20vw'}}>
              <CourseArea data={this.getCartData()} addCartCourse={(data) => this.addCartCourse(data)} removeCartCourse={(data) => this.removeCartCourse(data)} cartCourses={this.state.cartCourses} compMode={false} cartMode={true} compCourses={this.state.completed}/>
            </div>
          </Tab>
          <Tab eventKey="completed" title="Completed Courses" style={{paddingTop: '5vh'}}>
            <div style={{marginLeft: '20vw'}}>
              <CourseArea data={this.state.completed} addCartCourse={(data) => this.addCartCourse(data)} removeCartCourse={(data) => this.removeCartCourse(data)} cartCourses={this.state.cartCourses} compMode={true} getRec={this.getRecommendedCourses} cartMode={false}/>
            </div>
          </Tab>
          <Tab eventKey="recommended" title="Recommended Courses" style={{paddingTop: '5vh'}}>
            <div style={{marginLeft: '20vw'}}>
              <CourseArea data={this.state.recommendedCourses} addCartCourse={(data) => this.addCartCourse(data)} removeCartCourse={(data) => this.removeCartCourse(data)} cartCourses={this.state.cartCourses} compMode={false} cartMode={false}/>
            </div>
          </Tab>
        </Tabs>
      </>
    )
  }
}

export default App;
