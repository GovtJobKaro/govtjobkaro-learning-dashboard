import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import Api from "./components/APIs/Api";
import "./index.css";
import Login from "./components/Login";
import reportWebVitals from "./reportWebVitals";
import URL from "./config";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import "./components/Login-popup.css";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
// const token_new = urlParams.get('token');
const course_id = urlParams.get("course_id");

function setCookie(name, value, daysToLive) {
  var cookie = name + "=" + encodeURIComponent(value);
  if (typeof daysToLive === "number") {
    cookie += "; domain=govtjobkaro.com; max-age=" + daysToLive * 24 * 60 * 60;
    document.cookie = cookie;
  }
}

function getCookie(name) {
  var cookieArr = document.cookie.split(";");
  for (var i = 0; i < cookieArr.length; i++) {
    var cookiePair = cookieArr[i].split("=");
    if (name === cookiePair[0].trim()) {
      return decodeURIComponent(cookiePair[1]);
    }
  }
  return null;
}

function delete_cookie(name) {
  document.cookie =
    name +
    "=; Domain=govtjobkaro.com; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}

ReactDOM.render(
  <div className="cookies-container text-center" style={{ background: "white" }}>
    <div className="loader-box">
      <div style={{ color: "#f56962", width: "50px", height: "50px" }} class="spinner-border" role="status">
      </div>
    </div>
  </div>,
  document.querySelector("#root")
);

//production
var token = getCookie("token");

//testing copy token from the test site cookie after login
// var token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZW51bWJlciI6Ijk1OTIyMzUwMzYiLCJpYXQiOjE2MzI2MzQ0OTQsImV4cCI6MTYzNzgxODQ5NH0.Okii5AlQ5gL3ULzIaWP3AefQIJEEsWqdRm1Y8tbkvbs";


if (token && course_id) {
  fetchUser();
} else {
  delete_cookie("token");
  window.location.replace(URL + "/login-register");
}
// var signedIn = getCookie('isSignedIn')
// if (!signedIn){
//   setCookie('isSignedIn','true',30)
//   if(!token){
//     setCookie('token', token_new, 30);
//     fetchUser();
//     window.location.reload();
//   }
//   else if (token===token_new) {
//     fetchUser();
//   }else if(token !== token_new){
//     setCookie('token', token_new, 30);
//     fetchUser();
//     window.location.reload();
//   }else{
//     window.location.replace('http://test.govtjobkaro.com/login');
//   }
// }
// else if (signedIn === 'true') {
//   if(!token){
//     setCookie('token', token_new, 30);
//     fetchUser();
//     window.location.reload();
//   }
//   else if (token === token_new) {
//     fetchUser();
//   }else if(token !== token_new){
//     setCookie('token', token_new, 30);
//     fetchUser();
//     window.location.reload();
//   }else{
//     window.location.replace('http://test.govtjobkaro.com/login');
//   }
// }
// else if (signedIn === 'false'){
//   if (!token) {
//     document.cookie = 'isSignedIn=true';
//     setCookie('token',token_new,30);
//     fetchUser();
//     window.location.reload()
//   }
//   else if (token) {
//     if (token === token_new){
//       window.location.replace('http://test.govtjobkaro.com/login');
//     }
//     else{
//       document.cookie = 'isSignedIn=true';
//       setCookie('token',token_new,30);
//       fetchUser();
//       window.location.reload()
//     }
//   }
// }

async function fetchCourse(number, user) {



  try {
    let course = null
    const topics = await (await Api.get(`/single_purchased_course_lectures?course_id=${course_id}&phonenumber=${number}`)).data.data
    console.log(topics);
    const quiz = await (await Api.get(`/single_purchased_course_quizes?course_id=${course_id}&phonenumber=${number}`)).data.data
    console.log(quiz);
    course = topics
    course.course_quizes = quiz.course_quizes
    // console.log(course);
    ReactDOM.render(
      <App user={user} course={course} />,
      document.querySelector("#root")
    );
  } catch (err) {
    console.log(err);

  }


}

// async function fetchCourse(number, user) {
//   const response = await axios.get(
//     "http://165.22.208.245/api/v1/single_purchased_course?course_id=f6e1777d-5aab-4355-86cb-ca4bad3cfcfc&phonenumber=7009427959"
//   );
//   ReactDOM.render(
//     <App user={user} course={response.data} />,
//     document.querySelector("#root")
//   );
// }

async function fetchUser() {
  try {
    const response = await Api.get(`/userinfo?token=${token}`);
    if (response.data.status === "failure") {
      ReactDOM.render(<Login />, document.querySelector("#root"));
    } else {
      fetchCourse(response.data.User.mobile_no, response.data);
    }
  } catch (error) {
    console.log(error);
  }

}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
