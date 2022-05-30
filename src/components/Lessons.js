import React from "react";
import Accordions from './Accordions'
import MobileAccordions from './MobileAccordions'

class Lessons extends React.Component {
  render() {
    // console.log(this.props.quiz)
    if (this.props.display >= 700){
      return(
        <Accordions onQuiz={this.props.onQuiz} userID={this.props.userID} course={this.props.course} onvidPlay={this.props.onPlayVid} />
      );
    }
    else{
      return(
        <MobileAccordions onQuiz={this.props.onQuiz} userID={this.props.userID} course={this.props.course} onVidPlay={this.props.onPlayVid} />
      );
    }
  }
}

export default Lessons;
