import React from "react";
import MobileAccordions from "./MobileAccordions";
import ReactPlayer from "react-player";
import search from "../icons/search.svg";
// import ProgressBar from 'react-bootstrap/ProgressBar'
// import vid from '../video/180_out.m3u8'
import Api from "./APIs/Api";
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

class MobilePlayer extends React.Component {
  player = {};
  state = {
    counter: 0,
    src: null,
    chapter_index: this.props.chapter_index,
    subtopic_index: this.props.subtopic_index,
    topic_index: this.props.topic_index,
    playNext: false,
    showMe: true
  };

  onPlaybtn = evt => {
    $(window).scrollTop(0);
    this.fetchUrl(evt.target.id);
    console.log("src updated", evt);
    // console.log('src updated',evt.target.getAttribute('chapter_index'));
    this.setState({
      chapter_index: evt.target.getAttribute("chapter_index"),
      subtopic_index: evt.target.getAttribute("subtopic_index"),
      topic_index: evt.target.getAttribute("topic_index")
    });
  };

  fetchUrl = async chapter_id => {
    const response = await Api.get(
      `/fetch_video_url?user_id=${this.props.userID}&course_id=${this.props.course.course_id}&chapter_id=${chapter_id}`
    );
    this.setState({
      src: `${response.data.data.video_src}`,
      chapter_name: `${response.data.data.chapter_name}`,
      chapter_duration: `${response.data.data.chapter_duration}`
    });
  };

  // fetchLastVid = async () => {
  //   const response = await Api.get(`/get_lecture_record?user_id=${this.props.userID}&course_id=${this.props.course.course_id}`);
  //   if (response.data.status === 'failure'){
  //     this.fetchUrl(this.props.course.topics[0].sub_topics[0].chapters[0].chapter_id);
  //   }
  //   else{
  //     this.fetchUrl(response.data.data.last_chapter_id);
  //   }
  // }

  onPlayerReady(player) {
    console.log("Player is ready: ", player);
    this.player = player;
  }

  onVideoPlay(duration) {
    console.log("Video played at: ", duration);
  }

  onVideoPause(duration) {
    console.log("Video paused at: ", duration);
  }

  onVideoTimeUpdate(duration) {
    console.log("Time updated: ", duration);
  }

  onVideoSeeking(duration) {
    console.log("Video seeking: ", duration);
  }

  onVideoSeeked(from, to) {
    console.log(`Video seeked from ${from} to ${to}`);
  }

  onVideoEnd() {
    console.log("Video ended");
  }

  updateLastLec = async () => {
    const settings = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    };
    const update = await Api.post(
      `/update_lecture_record?&user_id=${this.props.userID}&course_id=${
        this.props.course.course_id
      }&chapter_id=${this.state.chapter_id}&module_id=${
        this.props.course.topics[Number(this.state.topic_index)].sub_topics[
          Number(this.state.subtopic_index)
        ].module_id
      }`,
      settings
    );
    if (update.data.status === "success") {
      console.log(update.data.msg);
    } else {
      // this.fetchUrl(update.data.last_chapter_id);
    }
  };

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
      `/update_lecture_record?user_id=${this.props.userID}&course_id=${
        this.props.course.course_id
      }&chapter_id=${this.state.chapter_id}&module_id=${
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
    this.setState({
      showMe: false
    });
  };

  handleProgress = async data => {
    console.log("playing Seconds", Math.floor(data.playedSeconds));

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

  componentDidMount() {
    $("#search2").keyup(() => {
      $("#result2").html("");
      var searchField = $("#search2").val();
      var expression = new RegExp(searchField, "i");
      if (searchField === "") {
        $("#result2").html("");
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
                $("#result2").append(`<div class='list-group-item'>
                  <div class='row'><div class='col-7'>
                    <p class='pt-2 mb-0'>${this.props.course.topics[x].sub_topics[y].chapters[z].chapter_name}</p>
                  </div>
                  <div class='col-5 text-right'>
                    <button id='${this.props.course.topics[x].sub_topics[y].chapters[z].chapter_id}' chapter_index='${z}' subtopic_index='${y}' topic_index='${x}' class='btn error f-16'>Watch Now</button>
                  </div>
                  </div>
                </div>`);
                $(
                  `#result2 div.text-right button#${this.props.course.topics[x].sub_topics[y].chapters[z].chapter_id}`
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
      $("button#next-btn-mplayer").attr("disabled", "");
      console.log("j");
    } else {
      $("button#next-btn-mplayer").removeAttr("disabled");
    }
  }

  ready = () => {
    this.updateLastLec();
  };

  render() {
    return (
      <div className="container">
        <div id="player" className="react-vid-player pb-1 row">
          <ReactPlayer
            controls
            url={this.state.src}
            config={{file: {forceHLS: true}}}
            width="100%"
            height="100%"
            onReady={this.ready}
            onProgress={this.handleProgress}
            onDuration={this.handleDuration}
          />
          {this.state.playNext && (
            <button className="btn f-18 next-btn" onClick={this.next}>
              next
            </button>
          )}
        </div>
        <div className=" pb-2">
          <div
            className="duration p-2 mt-2 left"
            style={{background: "#FEF9E5"}}
          >
            <a
              href={`${this.props.course.telegram_grp}`}
              className="duration p-0"
              style={{background: "#FEF9E5", border: "none"}}
            >
              <i className="far fa-comment-dots"></i>Discussion
            </a>
          </div>
          <div
            className="duration p-2 mt-2  ml-auto right"
            style={{background: "#FEEFEE", color: "#F56962"}}
          >
            <a
              href={URL + "/partner"}
              style={{background: "#FEEFEE", color: "#F56962", border: "none"}}
            >
              Refer & Earn
            </a>
          </div>
        </div>
        <hr className="mt-5" />
        <div className="contents">
          <h3 className="text-center p-medium text-capitalize">
            {this.state.chapter_name}
          </h3>
          <div className="container">
            <div className="row my-1">
              <button
                id="next-btn-mplayer"
                className="btn error f-20 w-100"
                style={{color: "white"}}
                onClick={this.next}
              >
                Next Lessons
              </button>
            </div>
            <div className="row my-1">
              <button
                className="btn error f-20 w-100"
                style={{color: "white"}}
                onClick={this.props.resetfunction}
              >
                Go Back
              </button>
            </div>
          </div>
          <div className="course-content pb-4">
            <div className="container">
              <p
                className="font-poppins-r pt-2 f-16 text-center"
                style={{color: "#5F5982"}}
              >
                Use the Search Bar Below To Search for the Video You Want to
                Watch
              </p>
            </div>
            <div className="bg-shade">
              <div className=" s-component w-25 d-inline-block text-center bg-shade pb-2 pt-2">
                <img src={search} alt={search} />
              </div>
              <input
                type="text"
                placeholder="Search"
                id="search2"
                className="s-component w-75 border-1 pt-2 bg-shade"
                style={{paddingBottom: "10px"}}
              />
            </div>
            <ul className="list-group" id="result2"></ul>
            <h5
              className="p-semi-bold text-center p-3"
              style={{fontSize: "20px"}}
            >
              Here is the Complete List of all the Lessons Available in this
              Course
            </h5>
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
    );
  }
}

export default MobilePlayer;
