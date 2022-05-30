import React from "react";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import clock from "../icons/clock.svg";
// import down from '../icons/down.svg';
import Book from "../icons/Book.svg";
import quiz from "../images/quiz.svg";
import $ from "jquery";

export const getDigits = digit => {
  if (digit.length < 2) {
    return "0" + digit;
  } else {
    return digit;
  }
};

class MobileAccordions extends React.Component {
  state = {
    defTopic: "",
    defSubTopic: "",
    k: this.props.defKey
  };

  // currentActive = () => {
  //   if(this.props.defKey){
  //     this.setState({
  //       defTopic: ,
  //       defSubTopic:
  //     })
  //   }
  //   else{
  //     console.log('k');
  //   }
  // }

  checkState = () => {
    return this.renderKey(this.props.defKey).slice(0, 2);
  };

  renderKey = key => {
    if (key) {
      console.log("y", key);
      return key;
    } else {
      console.log("n");
      return "abcdef";
    }
  };

  update = () => {
    return this.renderKey(this.props.defKey).slice(0, 4);
  };

  componentDidMount() {}

  componentDidUpdate() {}

  renderVideos = (chapters, subtopic_index, topic_index, type = "topics") => {
    if (type === "quiz") {
      return chapters.map((chapter, index) => {
        if (chapter.quiz_status === "Completed") {
          return (
            <div className="container pt-3" key={chapter.quiz_id}>
              <div className="row py-2">
                <div className="col-5 px-0">
                  <img src={quiz} alt={quiz} />
                  <span className="f-14 p-regular ml-2">
                    {" "}
                    {chapter.quiz_name}{" "}
                  </span>
                </div>
                <div className="col-3 px-0">
                  <span
                    className="f-12 p-regular text-center"
                    style={{
                      background: "#EDF0FD",
                      color: "#6C63FF",
                      padding: "5px",
                      width: "55px"
                    }}
                  >
                    {chapter.total_time} min
                  </span>
                </div>
                <div className="col-4 px-0 ">
                  <span
                    className="f-12 p-regular success px-3"
                    style={{padding: "5px"}}
                  >
                    Attempted
                  </span>
                </div>
              </div>
              <div className="row py-2">
                <div className="col-12">
                  <button
                    id={chapter.quiz_id}
                    quiz_index={index}
                    coursequiz_index={topic_index}
                    className="btn success f-16 w-100"
                    style={{color: "white"}}
                    onClick={this.props.onQuiz}
                  >
                    Attempt Again
                  </button>
                </div>
              </div>
            </div>
          );
        } else {
          return (
            <div className="container pt-3" key={chapter.quiz_id}>
              <div className="row">
                <div className="col-5 px-0">
                  <img src={quiz} alt={quiz} />
                  <span className="f-14 p-regular ml-2">
                    {chapter.quiz_name}
                  </span>
                </div>
                <div className="col-3 px-0">
                  <div
                    className="f-12 p-regular text-center"
                    style={{
                      background: "#EDF0FD",
                      color: "#6C63FF",
                      padding: "5px",
                      borderRadius: "5px",
                      width: "55px"
                    }}
                  >
                    {chapter.total_time} min
                  </div>
                </div>
                <div className="col-4 px-0">
                  <span
                    className="f-12 p-regular error"
                    style={{padding: "5px"}}
                  >
                    Not Attempted
                  </span>
                </div>
              </div>
              <div className="row py-2">
                <div className="col-12">
                  <button
                    id={chapter.quiz_id}
                    quiz_index={index}
                    coursequiz_index={topic_index}
                    className="btn error f-16 w-100"
                    style={{color: "white"}}
                    onClick={this.props.onQuiz}
                  >
                    Attempt Now
                  </button>
                </div>
              </div>
            </div>
          );
        }
      });
    } else {
      return chapters.map((chapter, index) => {
        if (chapter.percentage_watched > 99) {
          return (
            <div
              id={`${getDigits(topic_index.toString())}${getDigits(
                subtopic_index.toString()
              )}${getDigits(index.toString())}`}
              key={chapter.chapter_id}
            >
              <div className="row">
                <div
                  className="col-5 d-flex px-0"
                  style={{placeSelf: "center"}}
                >
                  <img src={Book} alt={Book} />
                  <span className="f-14 p-regular ml-2">
                    {" "}
                    {chapter.chapter_name}
                  </span>
                </div>
                <div className="col-3 px-0">
                  <div
                    className="f-12 p-regular text-center"
                    style={{
                      background: "#EDF0FD",
                      color: "#6C63FF",
                      padding: "5px",
                      borderRadius: "5px",
                      width: "70px"
                    }}
                  >
                    {chapter.duration} min
                  </div>
                </div>
                <div className="col-4 px-0">
                  <span
                    className="f-12 p-regular success px-3"
                    style={{padding: "5px"}}
                  >
                    Watched
                  </span>
                </div>
              </div>
              <div className="row py-2">
                <div className="col-12">
                  <button
                    href="#player"
                    id={chapter.chapter_id}
                    chapter_index={index}
                    subtopic_index={subtopic_index}
                    topic_index={topic_index}
                    className="btn error f-16 w-100 text-capitalize"
                    style={{color: "white"}}
                    onClick={this.props.onVidPlay}
                  >
                    watch again
                  </button>
                </div>
              </div>
            </div>
          );
        } else {
          return (
            <div
              id={`${getDigits(topic_index.toString())}${getDigits(
                subtopic_index.toString()
              )}${getDigits(index.toString())}`}
              key={chapter.chapter_id}
            >
              <div className="row">
                <div
                  className="col-5 d-flex px-0"
                  style={{placeSelf: "center"}}
                >
                  <img src={Book} alt={Book} />
                  <span className="f-14 p-regular ml-2">
                    {chapter.chapter_name}
                  </span>
                </div>
                <div className="col-3 px-0">
                  <div
                    className="f-12 p-regular text-center"
                    style={{
                      background: "#EDF0FD",
                      color: "#6C63FF",
                      padding: "5px",
                      borderRadius: "5px",
                      width: "70px"
                    }}
                  >
                    {chapter.duration} min
                  </div>
                </div>
                <div className="col-4 px-0">
                  <span
                    className="f-12 p-regular error"
                    style={{padding: "3px"}}
                  >
                    Not Watched
                  </span>
                </div>
              </div>
              <div className="row">
                <div className="col-12 pt-3">
                  <button
                    href="#player"
                    id={chapter.chapter_id}
                    chapter_index={index}
                    subtopic_index={subtopic_index}
                    topic_index={topic_index}
                    className="btn error f-16 w-100"
                    style={{color: "white"}}
                    onClick={this.props.onVidPlay}
                  >
                    Watch Now
                  </button>
                </div>
              </div>
            </div>
          );
        }
      });
    }
  };

  renderSubtopics = (sub_topics, topic_index) => {
    return sub_topics.map((subtopic, index) => {
      return (
        <Card key={subtopic.module_id}>
          <Accordion.Toggle
            id={`${getDigits(topic_index.toString())}${getDigits(
              index.toString()
            )}`}
            style={{background: "#FEEFEE"}}
            as={Card.Header}
            eventKey={`${getDigits(topic_index.toString())}${getDigits(
              index.toString()
            )}`}
          >
            <div className="row">
              <div className="col-10">
                <span className="f-20 p-bold">{subtopic.module_name}</span>
              </div>
              <div className="col-2 text-end">
                <div
                  className=""
                  style={{
                    background: "#FEEFEE",
                    width: "max-content",
                    borderRadius: "5px"
                  }}
                >
                  <i className="fas fa-chevron-down"></i>
                </div>
              </div>
            </div>
          </Accordion.Toggle>
          <Accordion.Collapse
            eventKey={`${getDigits(topic_index.toString())}${getDigits(
              index.toString()
            )}`}
          >
            <Card.Body>
              <div className="container p-0">
                <Accordion defaultActiveKey={""}>
                  {this.renderVideos(subtopic.chapters, index, topic_index)}
                </Accordion>
              </div>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      );
    });
  };

  renderTopics = (type = "topic") => {
    if (type === "quiz") {
      return this.props.course.course_quizes.map((quiz, index) => {
        return (
          <Card key={quiz.course_quiz_id}>
            <Accordion.Toggle
              style={{background: "white"}}
              as={Card.Header}
              eventKey={`${quiz.course_quiz_id}`}
            >
              <div className="row">
                <div className="col text-center">
                  <span className="f-20 p-bold">{quiz.heading}</span>
                </div>
              </div>
              <div className="row py-2">
                <div className="col-6">
                  <img src={clock} alt="time" className="" />
                  <span className="duration f-14 p-regular ml-1">
                    Duration {quiz.duration}
                  </span>
                </div>
                <div className="col-6">
                  <span className="duration f-14 p-regular ml-1">
                    <i className="fas fa-play"></i>{" "}
                    {`${quiz.total_quizes} quizes`}
                  </span>
                </div>
              </div>
              <div className="row py-2">
                <div className="col-12 text-center">
                  <div
                    className="pl-2 pr-2 mx-auto my-2"
                    style={{
                      background: "#FEEFEE",
                      width: "max-content",
                      borderRadius: "5px"
                    }}
                  >
                    <i className="fas fa-chevron-down"></i>
                  </div>
                </div>
              </div>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={`${quiz.course_quiz_id}`}>
              <Card.Body>
                <div className="container p-0">
                  <Accordion defaultActiveKey="">
                    {this.renderVideos(quiz.quizes, null, index, "quiz")}
                  </Accordion>
                </div>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        );
      });
    } else {
      return this.props.course.topics.map((topic, index) => {
        return (
          <Card key={topic.topic_id}>
            <Accordion.Toggle
              id={`${getDigits(index.toString())}`}
              style={{background: "white"}}
              as={Card.Header}
              eventKey={`${getDigits(index.toString())}`}
            >
              <div className="row">
                <div className="col text-center">
                  <span className="f-20 p-bold">{topic.topic_name}</span>
                </div>
              </div>
              <div className="row py-2">
                <div className="col-6">
                  <img src={clock} alt="time" className="" />
                  <span className="duration f-14 p-regular ml-1">
                    Duration {topic.duration}
                  </span>
                </div>
                <div className="col-6">
                  <span className="duration f-14 p-regular ml-1">
                    <i className="fas fa-play"></i> {topic.totalVideos} Videos
                  </span>
                </div>
              </div>
              <div className="row py-2">
                <div className="col-12">
                  <div className="btn-outline success-text f-16 p-regular border p-2 w-100">
                    {`${Math.floor(topic.percentage_watched)}%`} completed
                  </div>
                </div>
                <div className="col-12 text-center">
                  <div
                    className=" pl-2 pr-2 mx-auto my-2"
                    style={{
                      background: "#FEEFEE",
                      width: "max-content",
                      borderRadius: "5px"
                    }}
                  >
                    <i className="fas fa-chevron-down"></i>
                  </div>
                </div>
              </div>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={`${getDigits(index.toString())}`}>
              <Card.Body>
                <div className="container p-0">
                  <Accordion id="" defaultActiveKey={this.update()}>
                    {this.renderSubtopics(topic.sub_topics, index)}
                  </Accordion>
                </div>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        );
      });
    }
  };

  render() {
    return (
      <div className="scrollable-div">
        <Accordion id="topic-" defaultActiveKey={this.checkState()}>
          {this.renderTopics()}
          {this.renderTopics("quiz")}
        </Accordion>
      </div>
    );
  }
}

export default MobileAccordions;
