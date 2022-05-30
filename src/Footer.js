import React from 'react';
import logo from './images/logo.png';
import URL from './config';
import './footer.css';
import './FooterNew.css'
import $ from 'jquery'

class Footer extends React.Component {

  componentDidMount(){
    if(!this.props.mb){
      $('div#mb').removeClass('mb-cust')
    }
  }

  render(){
    return(
      <div className="footer">
        <footer>
          <div className="container">
            <div className=" d-flex align-items-center justify-content-between m-hidden ">
              <a href={URL}><img src={logo} width="180px" alt="logo"/></a>
              <div>
                <nav className='mobile-nav'>
                  <a className="p-medium" href={`${URL}/about-us`}>About Us</a>
                  <a className="p-medium" href={`${URL}/courses`}>Our Courses</a>
                  <a className="p-medium" href={`${URL}/partner`}>Partner With Us</a>
                  <a className="p-medium" href={`${URL}/contact-us`}>Contact Us</a>
                  <a className="p-medium" href={`${URL}/terms-and-conditions`}>T&amp;C's</a>
                  <a className="p-medium" href={`${URL}/sitemap.xml`}>Sitemap</a>
                  {/* <a className="p-medium" href={`${URL}/`}>Privacy Policy</a>
                  <a className="p-medium" href={`${URL}/`}>Refund Policy</a> */}
                </nav>
              </div>
            </div>
            <div className=" pb-5 pt-3 dm-flex align-items-center text-center justify-content-between m-show row ">
              <a className=' mx-0 col-12 text-center' href={URL}><img src={logo} width="180px" alt="logo"/></a>
              <div>
                <nav className='mobile-nav col-12 pl-fcust text-left'>
                  <a className="p-medium" href={`${URL}/about-us`}>About Us</a>
                  <a className="p-medium" href={`${URL}/courses`}>Our Courses</a>
                  <a className="p-medium" href={`${URL}/partner`}>Partner With Us</a>
                  <a className="p-medium" href={`${URL}/contact-us`}>Contact Us</a>
                  <a className="p-medium" href={`${URL}/terms-and-conditions`}>T&amp;C's</a>
                  <a className="p-medium" href={`${URL}/sitemap.xml`}>Sitemap</a>
                  {/* <a className="p-medium" href={`${URL}/`}>Privacy Policy</a>
                  <a className="p-medium" href={`${URL}/`}>Refund Policy</a> */}
                </nav>
              </div>
            </div>
            <div id='mb' className="pt-5 pb-5 border-top-footer d-flex align-items-center justify-content-between">
              <h6 className="p-regular">© 2020-2021 <a href ='https://quadbtech.com/'>Quadb Technologies</a>. All rights reserved</h6>
              <div className="social f-20">
                <a href='https://www.youtube.com/channel/UCPCtMF4z_rD7HeQh8ZwJtUQ/about' className='footer-link col p-0'><i className="fab fa-youtube"></i></a> <a href='https://www.facebook.com/govtjobkaro/' className='footer-link col p-0'><i className="fab fa-facebook-f"></i></a>  <a href='https://www.instagram.com/govtjobkaro/' className='footer-link col p-0'><i className="fab fa-instagram"></i></a> <a href='https://telegram.me/govtjobkaro' className='footer-link col p-0'><i className="fab fa-telegram-plane"></i></a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }
}

export default Footer
