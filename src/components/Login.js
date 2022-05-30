import React from "react";
import "./Login-popup.css";
import URL from "../config";

function delete_cookie(name) {
  document.cookie =
    name +
    "=; Domain=govtjobkaro.com; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}

export default class Login extends React.Component {
  onClick = () => {
    delete_cookie("token");
    window.location.replace(URL + "/login-register");
  };

  render() {
    return (
      <section class="cookies-container">
        <div class="cookies-box">
          <p class="poppins-regular text-justify mt-4">
            Seems you have multiple active sessions to continue you need to
            Login again here. Please click on the "Log-in" button to visit the
            login page.
          </p>
          <p class="poppins-regular text-justify">
            Once you login again you will be logged out of all other active
            sessions.
          </p>
          <div class="d-flex align-items-center justify-content-center">
            <button
              onClick={this.onClick}
              class="btn poppins-medium cookies-btn text-capitalize"
            >
              click here to login
            </button>
          </div>
          <div className="cookie-img text-center">
            <i class="fas fa-exclamation-circle"></i>
          </div>
        </div>
      </section>
    );
  }
}
