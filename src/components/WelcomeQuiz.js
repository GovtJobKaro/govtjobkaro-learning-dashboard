import React from "react";
import { Navbar, Container, Row } from "react-bootstrap";
import QuizScreen from "./QuizScreen";
import Api from "./APIs/Api";
import $ from "jquery";

class WelcomeQuiz extends React.Component {
  state = {
    view: window.innerWidth,
    quizPage: false,
    quizData: null,
    quiz_index: this.props.quiz_index,
    courseQuiz_index: this.props.courseQuiz_index,
    scores: null,
    lastScore: null,
    lastTime: null
  };

  renderScores = () => {
    if (!this.state.quizData) {
      this.setState({
        lastScore: "loading",
        lastTime: "loading"
      });
    } else {
      if (
        this.state.quizData.score === "---"
      ) {
        this.setState({
          lastScore: "N/A",
          lastTime: "N/A"
        });
      } else {
        this.setState({
          lastScore: this.state.quizData.score,
          lastTime: this.state.quizData.time
        });
      }
    }
  };

  handleSizeChange = () => {
    this.setState({ view: window.innerWidth });
  };

  fetchQuiz = async (quiz_id = this.props.quiz_id) => {
    const response = await Api.get(
      `/quiz_questions?user_id=${this.props.user_id}&course_id=${this.props.course_id}&quiz_id=${quiz_id}`
    );
    const scores = await Api.get(
      `get_quiz_scores?user_id=${this.props.user_id}&course_id=${this.props.course_id}`
    );
    console.log(response.data.data);
    this.setState({
      quizData: response.data.data,
      scores: scores.data.data
    });
    this.renderScores();
  };

  onQuizPage = () => {
    this.setState({ quizPage: !this.state.quizPage });
  };

  onNextQuiz = () => {
    this.setState({ quizPage: !this.state.quizPage });
    if (
      this.props.course.course_quizes[Number(this.state.courseQuiz_index)]
        .quizes[Number(this.state.quiz_index) + 1]
    ) {
      console.log("an increment in quiz exists");
      this.fetchQuiz(
        this.props.course.course_quizes[Number(this.state.courseQuiz_index)]
          .quizes[Number(this.state.quiz_index) + 1].quiz_id
      );
      this.setState({
        quiz_index: Number(this.state.quiz_index) + 1
      });
      console.log(this.state.quiz_index);
    } else {
      console.log("an increment in quiz does not exists");
      console.log(this.state.quiz_index);
      // this.setState({
      //   chapter_index : 0,
      //   subtopic_index: Number(this.state.subtopic_index) + 1
      // })
      console.log(this.state.quiz_index);
      if (
        this.props.course.course_quizes[Number(this.state.courseQuiz_index) + 1]
      ) {
        console.log("an increment in courseQuiz exists");
        this.fetchquiz(
          this.props.course.course_quizes[
            Number(this.state.courseQuiz_index) + 1
          ].quizes[Number(0)].quiz_id
        );
        this.setState({
          courseQuiz_index: Number(this.state.courseQuiz_index + 1),
          quiz_index: 0
        });
      } else {
        console.log("an increment in topic does not exists");
        // this.hideComponent(".nextbutton");
      }
    }
  };

  checkDisplay = () => {
    if (this.props.display < 700) {
      $("div.w-100.quiz-border .col-5").addClass("f-12");
      $("div.row.my-5.mx-auto div.col-2").css("padding-left", "5px");
      $("div.w-100.quiz-border .col-5 p")
        .removeClass("p-3")
        .addClass("py-3");
      $("div.w-100.quiz-border .col-1").css(
        "padding-left",
        "0px",
        "padding-right",
        "0px"
      );
      // $('#')
    } else {
      $("div.w-100.quiz-border .col-5").removeClass("f-12");
      $("div.row.my-5.mx-auto div.col-2").css("padding-left", "15px");
      $("div.w-100.quiz-border .col-5 p")
        .removeClass("py-3")
        .addClass("p-3");
      $("div.w-100.quiz-border .col-1").css(
        "padding-left",
        "15px",
        "padding-right",
        "15px"
      );
    }
  };

  componentDidMount() {
    window.addEventListener("resize", this.handleSizeChange);
    this.fetchQuiz();
    this.checkDisplay();
  }

  componentDidUpdate() {
    window.removeEventListener("resize", this.handleWindowSizeChange);
    this.checkDisplay();
  }

  renderName = () => {
    if (!this.state.quizData) {
      return "loading";
    } else {
      return this.state.quizData.quiz_name;
    }
  };

  renderMaxMarks = () => {
    if (!this.state.quizData) {
      return "loading";
    } else {
      return this.state.quizData.total_marks;
    }
  };

  renderCount = () => {
    if (!this.state.quizData) {
      return "loading";
    } else {
      return this.state.quizData.total_questions;
    }
  };

  renderTime = () => {
    if (!this.state.quizData) {
      return "loading";
    } else {
      return this.state.quizData.total_time;
    }
  };

  renderNav = view => {
    if (view > 700) {
      return (
        <Navbar className="bg-shade">
          <div className="container">
            <Navbar.Brand href="#home">
              <h3 className="font-popins-m" style={{ color: "#5F5982" }}>
                {this.props.courseName}
              </h3>
            </Navbar.Brand>
            <Navbar.Text className="ml-auto">
              <button
                className="btn font-popins-m error p-2 f-18 text-capitalize"
                onClick={this.props.resetfunction}
              >
                Go Back to dashboard
              </button>
            </Navbar.Text>
          </div>
        </Navbar>
      );
    } else {
      return (
        <Container className="mb-5">
          <Row className="text-center">
            <h3 className="font-popins-m mx-1" style={{ color: "#5F5982" }}>
              {this.props.courseName}
            </h3>
          </Row>
          <Row>
            <button
              className="btn error p-2 f-18 w-100 mx-2 text-capitalize"
              onClick={this.props.resetfunction}
            >
              Go back to dashboard
            </button>
          </Row>
        </Container>
      );
    }
  };

  render() {
    if (!this.state.quizPage) {
      return (
        <div className="">
          {this.renderNav(this.state.view)}
          <div className="container">
            <h1 className="font-popins-m f-40 text-center py-2">
              {this.renderName()}
            </h1>
            <p
              className=" container font-poppins-r f-18 text-justify"
              style={{ color: "#5F5982", lineHeight: 1.5 }}
            >
              <h5>
                Read the instructions given below carefully before attempting
                the quiz:-
              </h5>
              <ul>
                <li>
                  The quiz consists of <b>{this.renderCount()} questions</b>{" "}
                  carefully designed to help you self-assess your comprehension
                  of the information presented on the topics covered in the
                  Course.
                </li>
                <li>
                  The maximum duration for completing this quiz is{" "}
                  <b>{this.renderTime()} minutes.</b>
                </li>
                <li>
                  Each question in the quiz is of multiple-choice and carries{" "}
                  <b>1 mark</b> and Maximum marks for this quiz are{" "}
                  <b>{this.renderMaxMarks()}</b>.
                </li>
                <li>
                  Read each question carefully, and click on the appropriate
                  option amongst the given options to select your response.
                </li>
                <li>
                  Click on the "Next Question" button at the bottom to go to the
                  next question
                </li>
                <li>
                  Click on the "Previous question" button at the bottom to visit
                  the previous question attempted.
                </li>
                <li>
                  After responding to the last question, click on "Submit"
                  button on the bottom of the window to Submit the quiz.
                </li>
                <li>
                  The total score for the quiz is based on your responses to all
                  questions and your final result will be displayed after
                  successful submission of this quiz.
                </li>
                <li>
                  To successfully clear this quiz you must obtain a minimum of{" "}
                  <b>XYZ marks</b>.
                </li>
              </ul>
              <h5 className="d-inline">Note:</h5> No data will be collected on
              the website regarding how many times you take the quiz however,
              your last score will be collected every time you successfully
              submit the quiz.
            </p>
            <div className="container">
              <div className="my-5">
                <div className="w-100 quiz-border mx-auto row">
                  <div className="col-5">
                    <p
                      className="p-3 mb-0 text-center font-popins-m"
                      style={{ color: "#F56962" }}
                    >
                      {this.renderCount()} Questions
                    </p>
                  </div>
                  <div className="col-1 f-22">
                    <p
                      className="p-3 mb-0 text-center font-popins-m"
                      style={{ color: "#F56962" }}
                    >
                      |
                    </p>
                  </div>
                  <div className="col-5">
                    <p
                      className="p-3 mb-0 text-center font-popins-m"
                      style={{ color: "#F56962" }}
                    >
                      Time Limit: {this.renderTime()} min
                    </p>
                  </div>
                </div>
              </div>
              <div className="my-5">
                <div className="w-100 quiz-border mx-auto row">
                  <div className="col-5">
                    <p
                      className="p-3 mb-0 text-center font-popins-m"
                      style={{ color: "#F56962" }}
                    >
                      Previous Score : {this.state.lastScore}
                    </p>
                  </div>
                  <div className="col-1 f-22">
                    <p
                      className="p-3 mb-0 text-center font-popins-m"
                      style={{ color: "#F56962" }}
                    >
                      |
                    </p>
                  </div>
                  <div className="col-5">
                    <p
                      className="p-3 mb-0 text-center font-popins-m"
                      style={{ color: "#F56962" }}
                    >
                      Previous Time : {this.state.lastTime}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-100 text-center my-5">
              <button
                className="btn success p-2 w-25 f-18 mx-auto text-capitalize mb-100"
                onClick={this.onQuizPage}
              >
                Start Mock Test
              </button>
            </div>
            <div className="w-100 text-center my-5">
              <button
                className="btn error p-2 w-25 f-18 mx-auto text-capitalize mb-100"
                onClick={this.props.resetfunction}
              >
                Go to dashboard
              </button>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="">
          {this.renderNav(this.state.view)}
          <QuizScreen
            display={this.state.view}
            user_id={this.props.user_id}
            course_id={this.props.course_id}
            next={this.onNextQuiz}
            dashboard={this.props.resetfunction}
            quizData={this.state.quizData}
          />
        </div>
      );
    }
  }
}

export default WelcomeQuiz;
