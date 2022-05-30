import React from 'react'
import Header from './Header';
import Footer from './Footer';
import Body from './Body';
import VidPlayer from './components/VidPlayer'
import MobilePlayer from './components/MobilePlayer'
// import Api from './components/APIs/Api'
import WelcomeQuiz from './components/WelcomeQuiz'
import $ from 'jquery'

class App extends React.Component {

  state = {
    play: false,
    quiz: false,
    view: window.innerWidth,
    course: this.props.course,
    quiz_data: null,
    chapter_id: null,
    chapter_index: null,
    topic_index: null,
    subtopic_index: null,
    quiz_index: null,
    courseQuiz_index: null
  }



  toggleQuiz = (evt) => {
    this.setState({
      play: false,
      quiz: true,
      quiz_data: evt.target.id,
      quiz_index: evt.target.getAttribute("quiz_index"),
      courseQuiz_index: evt.target.getAttribute("courseQuiz_index"),
    });
    console.log(this.state.quiz_index);
  }

  resetFn = () => {
    this.setState({
      play: false,
      quiz: false
    });
    window.location.reload()
  }


  handleSizeChange = () => {
    this.setState({ view: window.innerWidth });
  }

  togglePlay = (evt) => {
    // console.log('toggleplay function', evt.target.id);
    // console.log('event', evt.target.getAttribute("chapter_index"))
    this.setState({ play: true, chapter_id: evt.target.id, chapter_index: evt.target.getAttribute("chapter_index"), subtopic_index: evt.target.getAttribute("subtopic_index"), topic_index: evt.target.getAttribute("topic_index") });
    $(window).scrollTop(0);
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleSizeChange);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowSizeChange);
  }


  render() {
    if (this.state.play === false && this.state.quiz === false) {
      return (
        <>
          <Header user={this.props.user} display={this.state.view} />
          <Body onQuiz={this.toggleQuiz} display={this.state.view} user={this.props.user.User} course={this.state.course} onPlay={this.togglePlay} />
          <Footer mb={true} />
        </>
      );
    }
    else if (this.state.play === true && this.state.quiz === false) {
      if (this.state.view < 700) {
        return (
          <>
            < MobilePlayer resetfunction={this.resetFn} onQuiz={this.toggleQuiz} userID={this.props.user.User.user_id} course={this.state.course} onPlay={this.togglePlay} chapter_id={this.state.chapter_id} chapter_index={this.state.chapter_index} subtopic_index={this.state.subtopic_index} topic_index={this.state.topic_index} />
            <Footer mb={false} />
          </>
        );
      }
      return (
        < VidPlayer resetfunction={this.resetFn} onQuiz={this.toggleQuiz} userID={this.props.user.User.user_id} course={this.state.course} display={this.state.view} onPlay={this.togglePlay} chapter_id={this.state.chapter_id} chapter_index={this.state.chapter_index} subtopic_index={this.state.subtopic_index} topic_index={this.state.topic_index} />
      );
    }
    else {
      return (
        <WelcomeQuiz user_id={this.props.user.User.user_id} course={this.state.course} courseQuiz_index={this.state.courseQuiz_index} quiz_index={this.state.quiz_index} quiz_id={this.state.quiz_data} course_id={this.state.course.course_id} courseName={this.state.course.course_name} resetfunction={this.resetFn} display={this.state.view} />
      );
    }
  }
}


export default App;
