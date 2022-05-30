import React from "react";
import "./VidPlayer.css";
import MobileAccordions from "./MobileAccordions";
import ReactPlayer from "react-player";
import backIcon from "../icons/back-button.png";
import search from "../icons/search.svg";
import ProgressBar from "react-bootstrap/ProgressBar";
// import vid from '../video/180_out.m3u8'
// import VideoPlayer from 'react-video-js-player';
// import videojs from 'video.js'
import Api from "./APIs/Api";
// import { data } from 'jquery';
import $ from "jquery";
import URL from "../config";

export const getDigits = digit => {
  if (digit) {
    if (digit.length < 2) {
      return "0" + digit;
    } else {
      return digit;
    }
  } else {
    return "";
  }
};

var currAct = "";

class VidPlayer extends React.Component {
  player = {};
  state = {
    url: null,
    playing: true,
    controls: true,
    light: false,
    muted: false,
    totalDuration: 0,
    played: 0,
    loaded: 0,
    duration: 0,
    playbackRate: 1.0,
    loop: false,
    chapter_index: this.props.chapter_index,
    subtopic_index: this.props.subtopic_index,
    topic_index: this.props.topic_index,
    chapter_id: this.props.chapter_id,
    showMe: true,
    playNext: false,
    prevchap: this.props.chapter_index,
    prevsubtopic: this.props.subtopic_index,
    prevtopic: this.props.topic_index
  };

  onPlaybtn = evt => {
    this.fetchUrl(evt.target.id);
    console.log("src updated", evt.target.getAttribute("chapter_index"));
    this.setState({
      showMe: true,
      chapter_index: evt.target.getAttribute("chapter_index"),
      subtopic_index: evt.target.getAttribute("subtopic_index"),
      topic_index: evt.target.getAttribute("topic_index")
    });
    // console.log(this.state.chapter_index);
  };

  fetchUrl = async chapter_id => {
    this.setState({chapter_id: chapter_id});
    const response = await Api.get(
      `/fetch_video_url?user_id=${this.props.userID}&course_id=${this.props.course.course_id}&chapter_id=${chapter_id}`
    );
    // console.log(this.props.chapter_id);
    this.setState({
      src: `${response.data.data.video_src}`,
      chapter_name: `${response.data.data.chapter_name}`,
      chapter_duration: `${response.data.data.chapter_duration}`
    });
  };

  // fetchLastVid = async () => {
  //   const response = await Api.get(`/get_lecture_record?user_id=${this.props.userID}&course_id=${this.props.course.course_id}`);
  //   if (response.data.status === 'failure'){
  //     this.setState({
  //       chapter_index: 0,
  //       subtopic_index: 0,
  //       topic_index: 0,
  //     });
  //     this.fetchUrl(this.props.course.topics[0].sub_topics[0].chapters[0].chapter_id);
  //   }
  //   else if(response.data.status === 'success'){
  //     var abort = false;
  //     for(var x = 0 ; x < this.props.course.topics.length && !abort; x++){
  //       for(var y = 0 ; y < this.props.course.topics[x].sub_topics.length && !abort; y++){
  //         for(var z = 0; z < this.props.course.topics[x].sub_topics[y].chapters.length && !abort; z++){
  //           if(this.props.course.topics[x].sub_topics[y].chapters[z].chapter_id === response.data.data.last_chapter_id ){
  //             this.setState({
  //               chapter_index: z,
  //               subtopic_index: y,
  //               topic_index: x,
  //             });
  //             abort = true;
  //             console.log('hi');
  //           }
  //         }
  //       }
  //     }
  //     this.fetchUrl(response.data.data.last_chapter_id);
  //   }
  // }

  updateLastLec = async () => {
    const settings = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    };
    const update = await Api.post(
      `/update_lecture_record?active=${currAct}&user_id=${
        this.props.userID
      }&course_id=${this.props.course.course_id}&chapter_id=${
        this.state.chapter_id
      }&module_id=${
        this.props.course.topics[Number(this.state.topic_index)].sub_topics[
          Number(this.state.subtopic_index)
        ].module_id
      }`,
      settings
    );
    if (update.data.status === "success") {
      console.log(update.data.msg);
    } else {
      this.fetchUrl(update.data.last_chapter_id);
    }
  };

  onPlayerReady(player) {
    this.setState({
      playNext: false
    });
    this.player = player;
    this.updateLastLec();
  }

  onVideoPause() {
    // add time variable on onVideoPause to see data
    // console.log("Video paused at: ", time);
  }

  updatePercentage = async () => {
    const response = await Api.post(
      `/chapter_watched?user_id=${this.props.userID}&course_id=${this.props.course.course_id}&chapter_id=${this.state.chapter_id}&percentage=100`
    );
    const settings = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    };
    const update = await Api.post(
      `/update_lecture_record?active=${currAct}&user_id=${
        this.props.userID
      }&course_id=${this.props.course.course_id}&chapter_id=${
        this.state.chapter_id
      }&module_id=${
        this.props.course.topics[Number(this.state.topic_index)].sub_topics[
          Number(this.state.subtopic_index)
        ].module_id
      }`,
      settings
    );
    if (update.data.status === "success") {
      console.log(update.data.msg);
    } else {
      this.fetchUrl(update.data.last_chapter_id);
    }
  };

  handleProgress = async data => {
    this.setState({
      played: ((data.playedSeconds / this.state.totalDuration) * 100).toFixed(2)
    });
    console.log(
      "playing Seconds",
      Math.floor(data.playedSeconds),
      this.state.played
    );
    // this for show or hide the next button in video player
    if (Math.floor(data.playedSeconds) > this.state.totalDuration - 12) {
      this.setState({playNext: true});
    }
  };

  handleDuration = async totalDuration => {
    console.log("Total Duration", Math.floor(totalDuration));
    this.setState({
      totalDuration: Number(Math.floor(totalDuration) - Number(10))
    });
  };
  handleEnded() {
    // console.log("Video ended");
    this.next();
  }

  next = () => {
    this.setState({playNext: false});
    this.updatePercentage();
    if (
      this.props.course.topics[Number(this.state.topic_index)].sub_topics[
        Number(this.state.subtopic_index)
      ].chapters[Number(this.state.chapter_index) + 1]
    ) {
      console.log("an increment in chapter exists");
      this.fetchUrl(
        this.props.course.topics[Number(this.state.topic_index)].sub_topics[
          Number(this.state.subtopic_index)
        ].chapters[Number(this.state.chapter_index) + 1].chapter_id
      );
      this.setState({
        chapter_index: Number(this.state.chapter_index) + 1
      });
      console.log(this.state.chapter_index);
    } else {
      console.log("an increment in chapter does not exists");
      console.log(this.state.chapter_index);
      // this.setState({
      //   chapter_index : 0,
      //   subtopic_index: Number(this.state.subtopic_index) + 1
      // })
      console.log(this.state.chapter_index);
      if (
        this.props.course.topics[Number(this.state.topic_index)].sub_topics[
          Number(this.state.subtopic_index) + 1
        ]
      ) {
        console.log("an increment in subtopic exists");
        $(
          `#${getDigits(`${Number(this.state.topic_index)}`)}${getDigits(
            `${Number(this.state.subtopic_index) + 1}`
          )}`
        ).click();
        this.setState({
          subtopic_index: String(Number(this.state.subtopic_index) + 1),
          chapter_index: "0"
        });
        this.fetchUrl(
          this.props.course.topics[Number(this.state.topic_index)].sub_topics[
            Number(this.state.subtopic_index) + 1
          ].chapters[0].chapter_id
        );
      } else {
        console.log("an increment in subtopic does not exists");
        // this.setState({
        //   chapter_index: Number(0),
        // })
        if (this.props.course.topics[Number(this.state.topic_index) + 1]) {
          console.log("an increment in topic exists");
          this.fetchUrl(
            this.props.course.topics[Number(this.state.topic_index) + 1]
              .sub_topics[Number(0)].chapters[Number(0)].chapter_id
          );
          $(
            `#${getDigits(`${Number(this.state.topic_index)}`)}${getDigits(
              `${Number(this.state.subtopic_index)}`
            )}`
          ).click();
          this.setState({
            topic_index: String(Number(this.state.topic_index) + 1),
            subtopic_index: "0",
            chapter_index: "0"
          });
          $(`#${getDigits(`${Number(this.state.topic_index) + 1}`)}`).click();
          $(
            `#${getDigits(`${Number(this.state.topic_index) + 1}`)}${getDigits(
              `00`
            )}`
          ).click();
        } else {
          this.setState({
            showMe: false,
            playNext: false
          });
          console.log("an increment in topic does not exists");
          // this.hideComponent(".nextbutton");
        }
      }
    }
  };

  // prev = () => {
  //   if (this.state.counter > 0){
  //     this.setState({counter:this.state.counter - 1})
  //   }
  //   else{
  //     this.setState({counter:0})
  //   }
  // }

  componentDidMount() {
    console.log(this.state);
    $("#search1").keyup(() => {
      $("#result1").html("");
      var searchField = $("#search1").val();
      var expression = new RegExp(searchField, "i");
      if (searchField === "") {
        $("#result1").html("");
      } else {
        for (var x = 0; x < this.props.course.topics.length; x++) {
          for (
            var y = 0;
            y < this.props.course.topics[x].sub_topics.length;
            y++
          ) {
            for (
              var z = 0;
              z < this.props.course.topics[x].sub_topics[y].chapters.length;
              z++
            ) {
              if (
                this.props.course.topics[x].sub_topics[y].chapters[
                  z
                ].chapter_name.search(expression) !== -1
              ) {
                $("#result1").append(`<div class='list-group-item'>
                  <div class='row'><div class='col-7'>
                    <p class='pt-2 mb-0'>${this.props.course.topics[x].sub_topics[y].chapters[z].chapter_name}</p>
                  </div>
                  <div class='col-5 px-0 text-right'>
                    <button id='${this.props.course.topics[x].sub_topics[y].chapters[z].chapter_id}' chapter_index='${z}' subtopic_index='${y}' topic_index='${x}' class='btn error f-16'>Watch Now</button>
                  </div>
                  </div>
                </div>`);
                $(
                  `#result1 div.text-right button#${this.props.course.topics[x].sub_topics[y].chapters[z].chapter_id}`
                ).click(this.onPlaybtn);
              }
            }
          }
        }
      }
    });
    this.setState({
      chapter_id: this.props.chapter_id
    });
    this.fetchUrl(this.props.chapter_id);
  }

  componentDidUpdate() {
    if (
      !this.props.course.topics[Number(this.state.topic_index) + 1] &&
      !this.props.course.topics[Number(this.state.topic_index)].sub_topics[
        Number(this.state.subtopic_index) + 1
      ] &&
      !this.props.course.topics[Number(this.state.topic_index)].sub_topics[
        Number(this.state.subtopic_index)
      ].chapters[Number(this.state.chapter_index) + 1]
    ) {
      $("button#next-btn-player").attr("disabled", "");
      console.log("j");
    } else {
      $("button#next-btn-player").removeAttr("disabled");
    }
  }

  render() {
    return (
      <div className="d-flex">
        <div
          className="side-bar w-25 d-inline-block left"
          style={{maxHeight: "100vh"}}
        >
          <div className="side-section error">
            <div
              className="back-button p-regular"
              onClick={this.props.resetfunction}
            >
              <img
                src={backIcon}
                alt="back"
                style={{width: "40px", height: "40px"}}
              />{" "}
              Back
            </div>
            <h1
              className="text-center py-5 p-medium"
              style={{fontSize: "36px"}}
            >
              {this.props.course.course_name}
            </h1>
            <ProgressBar
              className="nbr"
              now={this.props.course.percentage_watched}
              label={`${this.props.course.percentage_watched}` + "%"}
              variant="success"
            />
          </div>
          <div className="course-contents">
            <div>
              <div className="d-flex justify-content-center">
                <p
                  className="p-regular pt-3 f-16 text-center col-11"
                  style={{color: "#5F5982"}}
                >
                  Use the Search Bar Below To Search for the Video You Want to
                  Watch
                </p>
              </div>
              <div className="bg-none">
                <div className="s-component w-25 d-inline-block text-center bg-shade pb-2 pt-2">
                  <img src={search} alt={search} />
                </div>
                <input
                  type="text"
                  placeholder="Search"
                  id="search1"
                  name="search"
                  className="p-regular w-75 border-1 pt-2 mb-2 bg-shade s-component"
                  style={{paddingBottom: "10px"}}
                />
              </div>
              <ul className="list-group" id="result1"></ul>
              <MobileAccordions
                defKey={`${getDigits(this.state.topic_index)}${getDigits(
                  this.state.subtopic_index
                )}${getDigits(this.state.chapter_index)}`}
                onQuiz={this.props.onQuiz}
                userID={this.props.userID}
                course={this.props.course}
                onVidPlay={this.onPlaybtn}
              />
            </div>
          </div>
        </div>
        <div
          className="w-75 d-inline-block container-fluid pt-2"
          style={{maxHeight: "100vh"}}
        >
          <div className="row">
            <div className="col-9">
              <h1
                className="f-40 d-inline p-medium text-capitalize"
                style={{fontSize: "36px"}}
              >
                {this.state.chapter_name}
              </h1>
              <span
                className=" ml-3 f-20 p-2 p-regular "
                style={{
                  background: "#FEEFEE",
                  color: "#F56962",
                  borderRadius: "5px",
                  position: "relative",
                  bottom: "5px"
                }}
              >
                {this.state.chapter_duration}
              </span>
            </div>
            {/* <div className='col-2'>
              <button className='btn error f-20' style={{color:'white'}} onClick={this.prev}>Previous</button>
            </div> */}
            <div className="col-3 text-right">
              {this.state.showMe ? (
                <button
                  id="next-btn-player"
                  className="btn error f-20 nextbutton"
                  style={{color: "white"}}
                  onClick={this.next}
                >
                  Next Lesson
                </button>
              ) : null}
            </div>
          </div>
          <div className="react-vid-player pt-5 px-1 pb-1">
            <ReactPlayer
              controls={true}
              url={this.state.src}
              // poster={this.state.video.poster}
              width="100%"
              height="100%"
              onReady={this.onPlayerReady.bind(this)}
              onPause={this.onVideoPause.bind(this)}
              onProgress={this.handleProgress}
              onDuration={this.handleDuration}
              onEnded={this.handleEnded.bind(this)}
            />
            {this.state.playNext && (
              <button className="btn f-18 next-btn" onClick={this.next}>
                next
              </button>
            )}
          </div>
          <div className="">
            <div
              className="duration p-2 mt-2 left p-regular"
              style={{background: "#FEF9E5"}}
            >
              <a href={`${this.props.course.telegram_grp}`}>
                <i className="far fa-comment-dots"></i>
                <span> Discussion</span>
              </a>
            </div>
            <div
              className="duration p-2 mt-2  ml-auto right p-regular"
              style={{background: "#FEEFEE", color: "#F56962"}}
            >
              <a href={URL + "/partner"}>
                <span> Refer & Earn</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default VidPlayer;

//
//
