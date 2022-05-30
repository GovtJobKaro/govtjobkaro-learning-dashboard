import logo from "./images/logolight.png";
import "bootstrap/dist/css/bootstrap.min.css";
import $ from "jquery";
import "./Header.css";
import Api from "./components/APIs/Api";
import URL from "./config";

function delete_cookie(name) {
  document.cookie =
    name +
    "=; Domain=govtjobkaro.com; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}

const onLogOut = async () => {
  await Api.post("/logout");
  document.cookie = "isSignedIn=false;";
  delete_cookie("token");
  window.location.replace(URL + "/course-logout");
};

function Header(props) {
  console.log(window.innerWidth);
  // header animation
  $(window).scroll(function () {
    var sticky = $("div#navigationbar.header"),
      scroll = $(window).scrollTop();

    if (scroll >= 100 & window.innerWidth > 700) {
      sticky.addClass("fixed shadow w-100");
    } else {
      sticky.removeClass("fixed shadow w-100");
    }
  });
  //
  // if (props.display > 700) {
  //   $(".App.d-fixed-top").addClass("fixed-top");
  // } else {
  //   $(".App.d-fixed-top").removeClass("fixed-top");
  // }

  return (
    <div className="App d-fixed-top header" id="navigationbar">
      <div className="d-flex justify-content-center">
        <nav className=" p-0 container navbar navbar-expand-lg  justify-content-center">
          <a className="navbar-brand m-ml-2" href={URL}>
            <img width={"130px"} src={logo} alt={logo} />
          </a>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto invisible">
              <li className="nav-item">
                <a className="nav-link" href="about-us">
                  About us <span className="sr-only">(current)</span>
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="courses">
                  Courses
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="partner">
                  Partner with us
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="contact-us">
                  Contact us
                </a>
              </li>
            </ul>
            <ul className="navbar-nav nav-end">
              <li className="nav-item ml-1 p-regular">
                <a
                  onClick={onLogOut}
                  className="nav-link text-capitalize"
                  aria-current="page"
                  style={{ cursor: "pointer" }}
                >
                  Logout
                </a>
              </li>
              <li className="nav-item nav-button">
                <a
                  href={URL + "/user-dashboard"}
                  className="nav-link btn color-white"
                >
                  My Account
                </a>
              </li>
            </ul>
            {/* <button className="btn btn-sm my-2 my-sm-0 " type="submit" onClick={'login-register'}>Login to <br /> view courses</button> */}
          </div>
          <p
            onClick={onLogOut}
            className="mb-0 ml-auto mr-4 p-medium f-18 m-show"
            style={{ cursor: "pointer" }}
          >
            Logout
          </p>
        </nav>
      </div>
    </div>
  );
}

export default Header;
