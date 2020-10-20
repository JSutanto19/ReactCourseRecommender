import React from 'react';
import Alert from 'react-bootstrap/Alert'

class Warning extends React.Component{
    
    getRequisites(){
        let reqs = [];
        let temp = this.props.data.requisites;
        
        for(let i = 0; i < temp.length; i+=1){
            reqs.push(temp[i].join(" OR "));
        }
    
        if(reqs.length === 0 ){
            return "Requisites: None";
        }
    
        return reqs.join(" AND ");
        
    }

    getWarning(){
       let reqs = this.getRequisites();
       let passOr = false;
       if(reqs === "Requisites: None"){
         return (<Alert variant="success"><p>All requisites met</p></Alert>)
       }else{
        if(reqs.includes("AND")){
            var splitAnd = reqs.split("AND")
            for(let i = 0; i< splitAnd.length; ++i){
              let temp = splitAnd[i].split("OR")
               //check OR
               for(let j = 0; j < temp.length; ++j){
                   if(this.checkReq(temp[j].trim())){
                    passOr = true; 
                    break;
                   }  
               }
               //if or is false break because their is an AND
               if(passOr === false){
                //    return(<Alert variant="danger"><p>Warning: Requisites are not met. Can't Enroll in course because you need to take Course 1 and Course 2 first</p></Alert>)
                return this.missingReqs(this.props.data.number);
            } else{
                   //OR is true so reset passOr to false and check other OR
                   passOr = false;
               }
            }
            //nothing returned so all ORs were true so return sucess message 
            return(<Alert variant="success"><p>All requisites met</p></Alert>);
        } else{
           let splitOr = reqs.split("OR");
           for(let i = 0; i < splitOr.length;++i){
               if(this.checkReq(splitOr[i].trim()) === true){
                return(<Alert variant="success"><p>All requisites met</p></Alert>)
               }
           }
           return this.missingReqs(this.props.data.number);
        }

       }
    }

    

    checkReq(courseNum){
       for(let i = 0; i < this.props.compCourses.length;++i){
           if(this.props.compCourses[i].number === courseNum){
               return true;
           }
       }
       return false;
    }

    missingReqs(cNum){
        if(cNum === "COMP SCI 537"){
            return(<Alert variant="danger"><p>Warning: Requisites are not met. Can't Enroll in course because you need to take COMP SCI 354 first</p></Alert>)
        } else if(cNum === "COMP SCI 354"){
            return(<Alert variant="danger"><p>Warning: Requisites are not met. Can't Enroll in course because you need to take COMP SCI 252 first</p></Alert>)
        }
    }

    render(){
        return(
           <div>{this.getWarning()}</div>
        )       
    }
}

export default Warning;