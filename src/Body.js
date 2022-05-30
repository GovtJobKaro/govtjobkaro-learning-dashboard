import React from "react";
import live_icon from "./icons/live-tv.svg";
import eye from "./icons/eye.svg";
import notification from "./icons/notification.svg";
import help from "./icons/help.svg";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
// import {Navbar,Nav} from 'react-bootstrap'
import Lessons from "./components/Lessons";
import DemoVids from "./components/DemoVids";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Body.css";
import "./index.css";
import search from "./icons/search.svg";
import Api from "./components/APIs/Api";
import $ from "jquery";
import Book from "./icons/Book.svg";
import URL from "./config";

const getDigits = digit => {
  if (digit.length < 2) {
    return "0" + digit;
  } else {
    return digit;
  }
};

class Body extends React.Component {
  state = {
    vidId: null,
    chapter_index: this.props.chapter_index,
    subtopic_index: this.props.subtopic_index,
    topic_index: this.props.topic_index,
    chapter_id: ""
  };

  fetchLastVid = async () => {
    const response = await Api.get(
      `/get_lecture_record?user_id=${this.props.user.user_id}&course_id=${this.props.course.course_id}`
    );
    if (response.data.status === "failure") {
      this.setState({
        chapter_index: 0,
        subtopic_index: 0,
        topic_index: 0,
        chapter_id: this.props.course.topics[0].sub_topics[0].chapters[0]
          .chapter_id
      });
    } else if (response.data.status === "success") {
      var abort = false;
      for (var x = 0; x < this.props.course.topics.length && !abort; x++) {
        for (
          var y = 0;
          y < this.props.course.topics[x].sub_topics.length && !abort;
          y++
        ) {
          for (
            var z = 0;
            z < this.props.course.topics[x].sub_topics[y].chapters.length &&
            !abort;
            z++
          ) {
            if (
              this.props.course.topics[x].sub_topics[y].chapters[z]
                .chapter_id === response.data.data.last_chapter_id
            ) {
              this.setState({
                chapter_index: z,
                subtopic_index: y,
                topic_index: x,
                chapter_id: response.data.data.last_chapter_id
              });
              abort = true;
              console.log("hi");
            }
          }
        }
      }
    }
  };

  delete_cookie(name) {
    document.cookie =
      name +
      "=; Domain=govtjobkaro.com; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  }

  onLogOut = async () => {
    await Api.post("/logout");
    document.cookie = "isSignedIn=false; ";
    this.delete_cookie("token");
    window.location.replace(URL + "/course-logout");
  };

  componentDidMount(props) {
    if (this.props.course.course_type !== "test") {
      this.fetchLastVid();
    }
    $(window).scroll(function () {
      if (
        $(window).scrollTop() + $(window).height() >
        $(document).height() - 440
      ) {
        // $(".fixed-bottom").css("display", "none");

        $(".fixed-bottom").fadeOut(300);
      } else {
        $(".fixed-bottom").fadeIn(300);
        // $(".fixed-bottom").css("display", "block");
      }
    });

    $(document).ready(() => {
      console.log("5");
      $("#search").keyup(() => {
        $("#result").html("");
        var searchField = $("#search").val();
        var expression = new RegExp(searchField, "i");
        if (searchField === "") {
          $("#result").html("");
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
                  if (this.props.display > 700) {
                    $("#result").append(`
                        <div class='list-group-item'>
                          <div class='row'>
                            <div class='col-8'>
                              <p class='pt-2 mb-0'>${this.props.course.topics[x].sub_topics[y].chapters[z].chapter_name}</p>
                            </div>
                            <div class='col-4 text-right' >
                              <button id='${this.props.course.topics[x].sub_topics[y].chapters[z].chapter_id}' chapter_index='${z}' subtopic_index='${y}' topic_index='${x}' class='btn error f-16'>Watch Now</button>
                            </div>
                          </div>
                        </div>`);
                  } else {
                    $("#result").append(`
                        <div class='list-group-item'>
                          <div class='row'>
                            <div class='col-7'>
                              <p class='pt-2 mb-0'>${this.props.course.topics[x].sub_topics[y].chapters[z].chapter_name}</p>
                            </div>
                            <div class='col-5 px-0 text-right' >
                              <button id='${this.props.course.topics[x].sub_topics[y].chapters[z].chapter_id}' chapter_index='${z}' subtopic_index='${y}' topic_index='${x}' class='btn error f-16'>Watch Now</button>
                            </div>
                          </div>
                        </div>`);
                  }
                  $(
                    `#result div.text-right button#${this.props.course.topics[x].sub_topics[y].chapters[z].chapter_id}`
                  ).click(this.props.onPlay);
                }
              }
            }
          }
        }
      });
    });
  }

  componentDidUpdate() {
    $(document).ready(() => {
      $("#search").keyup(() => {
        $("#result").html("");
        var searchField = $("#search").val();
        var expression = new RegExp(searchField, "i");
        if (searchField === "") {
          $("#result").html("");
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
                  if (this.props.display > 700) {
                    $("#result").append(`
                        <div class='list-group-item'>
                          <div class='row'>
                            <div class='col-8'>
                              <p class='pt-2 mb-0'>${this.props.course.topics[x].sub_topics[y].chapters[z].chapter_name}</p>
                            </div>
                            <div class='col-4 text-right' >
                              <button id='${this.props.course.topics[x].sub_topics[y].chapters[z].chapter_id}' chapter_index='${z}' subtopic_index='${y}' topic_index='${x}' class='btn error f-16'>Watch Now</button>
                            </div>
                          </div>
                        </div>`);
                  } else {
                    $("#result").append(`
                        <div class='list-group-item'>
                          <div class='row'>
                            <div class='col-7'>
                              <p class='pt-2 mb-0'>${this.props.course.topics[x].sub_topics[y].chapters[z].chapter_name}</p>
                            </div>
                            <div class='col-5 px-0 text-right' >
                              <button id='${this.props.course.topics[x].sub_topics[y].chapters[z].chapter_id}' chapter_index='${z}' subtopic_index='${y}' topic_index='${x}' class='btn error f-16'>Watch Now</button>
                            </div>
                          </div>
                        </div>`);
                  }
                  $(
                    `#result div.text-right button#${this.props.course.topics[x].sub_topics[y].chapters[z].chapter_id}`
                  ).click(this.props.onPlay);
                }
              }
            }
          }
        }
      });
    });
  }

  renderTabs = () => {
    if (this.props.display > 800) {
      return (
        <Tabs
          className="col-12 font-popins-r"
          defaultActiveKey="View Course"
          id="uncontrolled-tab-example"
        >
          <Tab
            tabClassName=" text-center ml-5"
            eventKey="View Course"
            title="View Course"
          >
            <hr className="tab-divider w-100 mt-0" />
            <div className="">
              <p
                className="font-popins-r f-14 text-center"
                style={{ color: "#5F5982" }}
              >
                Use the Search Bar Below To Search for the Video You Want to
                Watch
              </p>
              <div className="bg-none">
                <div className=" s-component w-25 d-inline-block text-center bg-none pb-2 pt-2">
                  <img src={search} alt="search-icon" />
                </div>
                <input
                  type="text"
                  placeholder="Search"
                  id="search"
                  name="search"
                  className="font-popins-r w-75 border-1 pt-2  s-component"
                  style={{ paddingBottom: "9px" }}
                />
              </div>
              <ul className="list-group" id="result"></ul>
            </div>
            <h3
              className="text-center f-22 p-semi-bold mt-3 mb-3"
              style={{ color: "#302D3A" }}
            >
              Here is the Complete List of all the Lessons Available in this
              Course
            </h3>
            <div className="container">
              <Lessons
                onQuiz={this.props.onQuiz}
                userID={this.props.user.user_id}
                course={this.props.course}
                display={this.props.display}
                onPlayVid={this.props.onPlay}
              />
            </div>
          </Tab>
          <Tab
            tabClassName=" text-center mr-auto ml-auto"
            eventKey="Live-Sessions"
            title="Live Sessions"
          >
            <hr className="tab-divider w-100 mt-0" />
            <h3 className="text-center f-22 p-semi-bold mt-2 mb-5">
              Clear your Doubts Now in your Live Sessions
            </h3>
            <div className="container pt-1">
              <div className="container live-sessions">
                <div
                  className="notes-card gray-card text-center"
                  style={{ borderTop: "10px solid  #707070", miHeight: "225px" }}
                >
                  <h3 className="p-medium pt-4">
                    This Course doesn't contain Live Sessions
                  </h3>
                </div>
              </div>
            </div>
          </Tab>
          <Tab
            tabClassName="text-center mr-5"
            eventKey="Announcements"
            title="Announcements"
          >
            <hr className="tab-divider w-100 mt-0" />
            <h3 className="text-center f-22 p-semi-bold mt-2 mb-5">
              Stay Updated on the Latest Developments
            </h3>
            <div className="container pt-1">
              <DemoVids display={this.props.display} />
            </div>
          </Tab>
        </Tabs>
      );
    } else {
      return (
        <div>
          <div className="mobile-nav-bottom fixed-bottom shadow">
            <ul
              className="w-100 justify-content-center bg-white nav nav-pills mobile-nav-bottom"
              id="pills-tab"
              role="tablist"
              style={{ flex: "0 0 25% !important" }}
            >
              <li className=" pt-2 nav-item" role="presentation">
                <a
                  className="nav-link active f-12"
                  onClick={() => {
                    $(window).scrollTop(0);
                  }}
                  id="pills-home-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-home"
                  type="button"
                  role="tab"
                  aria-controls="pills-home"
                  aria-selected="true"
                >
                  <div className="tab-icon f-22 text-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32.265"
                      height="21.51"
                      viewBox="0 0 32.265 21.51"
                    >
                      <defs>
                        <style></style>
                      </defs>
                      <path
                        style={{ fontSize: "12px" }}
                        class="a"
                        d="M32.07,14.437A17.967,17.967,0,0,0,16.133,4.5,17.969,17.969,0,0,0,.195,14.438a1.812,1.812,0,0,0,0,1.635A17.967,17.967,0,0,0,16.133,26.01,17.969,17.969,0,0,0,32.07,16.072,1.812,1.812,0,0,0,32.07,14.437ZM16.133,23.321A8.066,8.066,0,1,1,24.2,15.255,8.066,8.066,0,0,1,16.133,23.321Zm0-13.444a5.339,5.339,0,0,0-1.418.212,2.68,2.68,0,0,1-3.747,3.747,5.365,5.365,0,1,0,5.165-3.96Z"
                        transform="translate(0 -4.5)"
                      />
                    </svg>
                  </div>
                  Course
                </a>
              </li>
              <li className=" pt-2 nav-item" role="presentation">
                <a
                  className="nav-link f-12"
                  onClick={() => {
                    $(window).scrollTop(0);
                  }}
                  id="pills-profile-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-profile"
                  type="button"
                  role="tab"
                  aria-controls="pills-profile"
                  aria-selected="false"
                >
                  <div className="tab-icon f-22 text-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25.355"
                      height="23.05"
                      viewBox="0 0 25.355 23.05"
                    >
                      <path
                        d="M24.55,7.61H15.8l3.792-3.792L18.788,3l-4.61,4.61L9.568,3l-.818.818,3.8,3.792H3.805A2.3,2.3,0,0,0,1.5,9.915v13.83A2.312,2.312,0,0,0,3.805,26.05H24.55a2.312,2.312,0,0,0,2.305-2.305V9.915A2.3,2.3,0,0,0,24.55,7.61Zm0,16.135H3.805V9.915H24.55ZM10.72,12.22v9.22l8.068-4.61Z"
                        transform="translate(-1.5 -3)"
                      />
                    </svg>
                  </div>
                  Sessions
                </a>
              </li>
              <li className=" pt-2 nav-item" role="presentation">
                <a
                  className="nav-link f-12"
                  onClick={() => {
                    $(window).scrollTop(0);
                  }}
                  id="pills-contact-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-contact"
                  type="button"
                  role="tab"
                  aria-controls="pills-contact"
                  aria-selected="false"
                >
                  <div className="tab-icon f-22 text-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="30"
                      height="30"
                      viewBox="0 0 30 30"
                    >
                      <path
                        style={{ fontSize: "11px" }}
                        d="M30,3H6A3,3,0,0,0,3.015,6L3,33l6-6H30a3.009,3.009,0,0,0,3-3V6A3.009,3.009,0,0,0,30,3ZM19.5,16.5h-3v-9h3Zm0,6h-3v-3h3Z"
                        transform="translate(-3 -3)"
                      />
                    </svg>
                  </div>
                  Notification
                </a>
              </li>
              <li className=" pt-2 nav-item" role="button">
                <a
                  href="https://wa.me/917717303376/?text=Hello%2C%20I%20am%20facing%20an%20issue%20with%20the%20partner%20dashboard"
                  className="nav-link f-12"
                >
                  <div className="tab-icon f-22 text-center">
                    <img width="25px" src={help} alt={help} />
                  </div>
                  support
                </a>
              </li>
            </ul>
            <div className="logout-mobile">
              <a
                href={this.props.course.telegram_grp}
                className="btn error p-3 w-100"
                style={{ borderRadius: "0" }}
              >
                Click here to Join Discussion Group
              </a>
            </div>
          </div>
          <div className="tab-content" id="pills-tabContent">
            <div
              className="tab-pane fade show active"
              id="pills-home"
              role="tabpanel"
              aria-labelledby="pills-home-tab"
            >
              <hr className="tab-divider w-100 mt-0" />
              <div className="container">
                <p
                  className="font-poppins-r f-14 text-center"
                  style={{ color: "#5F5982" }}
                >
                  Use the Search Bar Below To Search for the Video You Want to
                  Watch
                </p>
                <div className="bg-none">
                  <div className=" s-component w-25 d-inline-block text-center bg-none pb-2 pt-2">
                    <img src={search} alt="search-icon" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search"
                    id="search"
                    name="search"
                    className="font-popins-r w-75 border-1 pt-2"
                    style={{ paddingBottom: "9px" }}
                  />
                </div>
                <ul className="list-group" id="result"></ul>
              </div>
              <h3 className="text-center f-22 p-semi-bold mt-2 mb-5 px-1">
                Here is the Complete List of all the Lessons Available in this
                Course
              </h3>
              <div className="container">
                <Lessons
                  onQuiz={this.props.onQuiz}
                  userID={this.props.user.user_id}
                  display={this.props.display}
                  course={this.props.course}
                  onPlayVid={this.props.onPlay}
                />
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="pills-profile"
              role="tabpanel"
              aria-labelledby="pills-profile-tab"
            >
              <hr className="tab-divider w-100 mt-0" />
              <div className="container pt-1">
                <h3 className="text-center f-22 p-semi-bold mt-2 mb-5">
                  Clear your Doubts Now in your Live Sessions
                </h3>
                <div className="container live-sessions">
                  <div
                    className="notes-card gray-card text-center"
                    style={{
                      borderTop: "10px solid  #707070",
                      miHeight: "225px"
                    }}
                  >
                    <h3 className="p-medium">
                      This Course doesn't contain Live Sessions
                    </h3>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="pills-contact"
              role="tabpanel"
              aria-labelledby="pills-contact-tab"
            >
              <hr className="tab-divider w-100 mt-0" />
              <h3 className="text-center f-22 p-semi-bold mt-2 mb-5">
                Stay Updated on the Latest Developments
              </h3>
              <div className="container pt-1">
                <DemoVids display={this.props.display} />
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  render() {
    // console.log('body',this.props.quiz)
    if (this.props.display < 500) {
      return (
        // section 1
        <div className="container-fluid p-0 pb-5">
          <div className="course-dashboard container-fluid">
            <div className="container">
              <h1 className="font-popins-b fm">
                Welcome to {this.props.course.course_name}
              </h1>
            </div>
            {/* <img src={Pattern} alt="" /> */}
          </div>
          <div className="container d-flex justify-content-between">
            <div className="col-12 user-details shadow">
              <div className="row">
                <div className="col-xs-12 col-md-4 d-table">
                  <h4
                    id="top"
                    className="font-popins-sb text-center d-table-cell"
                  >
                    Welcome {this.props.user.full_name}
                  </h4>
                </div>
                <div className={this.props.course.course_type === "test" ? "col-xs-12 col-md-4 d-table invisible" : "col-xs-12 col-md-4 d-table"}>
                  <a
                    className="course-button btn w-100"
                    href="#"
                    id={this.state.chapter_id}
                    chapter_index={this.state.chapter_index}
                    subtopic_index={this.state.subtopic_index}
                    topic_index={this.state.topic_index}
                    onClick={this.props.onPlay}
                  >
                    Continue Where You Left Off &#62;
                  </a>
                  <div className="d-lg-table-row text-center font-popins-r color-grey">
                    <p>Click to Continue Watching</p>
                  </div>
                </div>
                <div className="col-xs-12 col-md-4 d-table">
                  <a
                    className="course-button btn w-100 text-capitalize"
                    href={URL + "/user-dashboard"}
                    id="discussion-button"
                  >
                    Go back to your courses
                  </a>
                  <div className="d-lg-table-row text-center font-popins-r color-grey">
                    <p>Click here to View Your Courses</p>
                  </div>
                </div>
                {this.renderTabs()}
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        // section 1
        <div className="container-fluid p-0 pb-5">
          <div className="course-dashboard container-fluid">
            <div className="container">
              <h1 className="font-popins-b fm">
                Welcome to {this.props.course.course_name}
              </h1>
            </div>
            {/* <img src={Pattern} alt="" /> */}
          </div>
          <div className="container d-flex justify-content-between">
            <div className="col-12 user-details shadow">
              <div className="row">
                <div className="col-xs-12 col-md-4 d-table">
                  <h4 className="font-popins-sb text-center d-table-cell">
                    Welcome {this.props.user.full_name}
                  </h4>
                </div>
                <div className={this.props.course.course_type === "test" ? "col-xs-12 col-md-4 d-table invisible" : "col-xs-12 col-md-4 d-table"}>
                  <a
                    className="course-button btn w-100"
                    href="#"
                    id={this.state.chapter_id}
                    chapter_index={this.state.chapter_index}
                    subtopic_index={this.state.subtopic_index}
                    topic_index={this.state.topic_index}
                    onClick={this.props.onPlay}
                  >
                    Continue Where You Left Off &#62;
                  </a>
                  <div className="d-lg-table-row text-center font-popins-r color-grey">
                    <p>Click to Continue Watching</p>
                  </div>
                </div>
                <div className="col-xs-12 col-md-4 d-table">
                  <a
                    href={this.props.course.telegram_grp}
                    className="course-button btn w-100 text-capitalize"
                    id="discussion-button"
                  >
                    Go to Discussion
                  </a>
                  <div className="d-lg-table-row text-center font-popins-r color-grey">
                    <p>Click here to Join telegram Group</p>
                  </div>
                </div>
                {this.renderTabs()}
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default Body;

// <div id={`${getDigits(x.toString())}${getDigits(y.toString())}${getDigits(z.toString())}`}>
//   <div className='row'>
//     <div className='col-8 px-0'>
//       <img src={Book} alt={Book}/><span className='f-14 p-regular ml-2'> {this.props.course.topics[x].sub_topics[y].chapters[z].chapter_name}</span>
//     </div>
//     <div className='col-4 px-0'>
//       <div className='f-12 p-regular text-center' style={{background:'#EDF0FD',color:'#6C63FF',padding:'5px',borderRadius:'5px', width:"70px"}}>{this.props.course.topics[x].sub_topics[y].chapters[z].duration} min</div>
//     </div>
//   </div>
//   <div className='row py-3'>
//     <div className='col-12'>
//       <button href="#player" id={this.props.course.topics[x].sub_topics[y].chapters[z].chapter_id} chapter_index={z} subtopic_index={y} topic_index={x} className='btn error f-16 w-100'  style={{color:'white'}}>watch again</button>
//     </div>
//   </div>
// </div>
