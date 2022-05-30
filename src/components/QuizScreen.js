import React from 'react'
import cup from '../icons/trophy.png'
import $ from 'jquery'
import Api from './APIs/Api'


var Answers = [];
var UserAnswers = [];
var score = 0;
var Minutes = 0;
var Seconds = 0;
var t = null;
var s = null;
class QuizScreen extends React.Component {

  state = {
    curr_question: this.props.quizData.quiz_questions[0],
    qCount: this.props.quizData.quiz_questions.length,
    success: false,
    minutes: this.props.quizData.total_time,
    // minutes:1,
    seconds: 0,
    testTime: null,
    checkAns: false,
    quizName:'',
    quizQuestions: [],
    curr_question_ans_page: {}
  }

  startTimer(duration, display, fn) {
    var timer = duration, minutes, seconds;
    t = setInterval(function () {
      minutes = parseInt(timer / 60, 10);
      seconds = parseInt(timer % 60, 10);

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      display.textContent = minutes + ":" + seconds;

      if (--timer < 0) {
        clearInterval(t);
        fn();
        alert("Time's up test submitted")
      }
    }, 1000);
  }

  counter(duration, display) {
    // var timer = duration, minutes, seconds;
    var timer = 0, minutes, seconds
    s = setInterval(function () {
      minutes = parseInt(timer / 60, 10);
      seconds = parseInt(timer % 60, 10);

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;
      Minutes = minutes;
      Seconds = seconds
      if (Minutes === parseInt(timer / 60, 10)) {
        display.textContent = "00:00";
      }
      if (++timer > duration) {
        clearInterval(s);
        display.textContent = "00:00";

      }
    }, 1000);
  }

  getAnswers = () => {
    for (var i = 0; i < this.state.qCount; i++) {
      UserAnswers.push('a');
    }
    // console.log(UserAnswers);
  }

  checkDisplay = () => {
    if (this.props.display < 700) {
      $('div.w-100.quiz-border .col-5').addClass('f-12');
      $('div.row.my-5.mx-auto div.col-2').css('padding-left', '5px')
      $('div.w-100.quiz-border .col-5 p').removeClass('p-3').addClass('py-3');
      $('div.w-100.quiz-border .col-1').css('padding-left', '0px', 'padding-right', '0px')
    }
    else {
      $('div.w-100.quiz-border .col-5').removeClass('f-12')
      $('div.row.my-5.mx-auto div.col-2').css('padding-left', '15px')
      $('div.w-100.quiz-border .col-5 p').removeClass('py-3').addClass('p-3');
      $('div.w-100.quiz-border .col-1').css('padding-left', '15px', 'padding-right', '15px')
    }
  }

  answer = () => {
    // $('.text-center').addClass('d-none');
    return (
      <table class="table table-striped font-popins-m">
        <thead>
          <tr>Check Answers</tr>
        </thead>
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">question</th>
            <th scope="col">option1</th>
            <th scope="col">option2</th>
            <th scope="col">option3</th>
            <th scope="col">option4</th>
            <th scope="col">Answer</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">1</th>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
          </tr>
          <tr>
            <th scope="row">2</th>
            <td>Jacob</td>
            <td>Thornton</td>
            <td>@fat</td>
            <td>Jacob</td>
            <td>Thornton</td>
            <td>@fat</td>
          </tr>
          <tr>
            <th scope="row">3</th>
            <td >Larry the Bird</td>
            <td>@twitter</td>
            <td>Larry the Bird</td>
            <td >Larry the Bird</td>
            <td>@twitter</td>
            <td>Larry the Bird</td>
          </tr>
        </tbody>
      </table>
    )
  }

  componentDidMount() {
    $(`.col-2 button#${this.props.quizData.quiz_questions.indexOf(this.state.curr_question)}`).addClass('selected');
    $(`.col-2 button#${this.state.quizQuestions.indexOf(this.state.curr_question_ans_page)}`).addClass('selected');
    this.getSoln();
    this.counter(this.state.minutes * 60, document.querySelector('#time'))
    this.startTimer(this.state.minutes * 60, document.querySelector('#time'), this.onSubmit);
    this.checkDisplay();
    this.getAnswers();
    Api.get(`check_quiz_question?quiz_id=${this.props.quizData.quiz_id}`)
      .then(res => {
        this.setState({
          quizName:res.data.data.quiz_name,
          quizQuestions: res.data.data.quiz_questions
        }, () => {
          const quizAnsPage = this.state.quizQuestions[0]
          this.setState({
            curr_question_ans_page: quizAnsPage
          })
        })
      })
      .catch(err => console.log(err))
  }

  componentDidUpdate() {
    if(this.state.checkAns==false){
      $(`div.col-2 button#${this.props.quizData.quiz_questions.indexOf(this.state.curr_question)}`).addClass('selected');
      $(`div.options-available button#${UserAnswers[this.props.quizData.quiz_questions.indexOf(this.state.curr_question)]}`).addClass('selected');
    }

    else{
      $(`div.col-2 button#${this.state.quizQuestions.indexOf(this.state.curr_question_ans_page)}`).addClass('selected');
      $(`div.options-available button#${UserAnswers[this.state.quizQuestions.indexOf(this.state.curr_question_ans_page)]}`).addClass('selected');
    }
    this.checkDisplay()
    if (this.state.success) {
      clearInterval(t);
      clearInterval(s);
    }
  }

  sendScore = async () => {
    const response = await Api.post(`/set_score?user_id=${this.props.user_id}&course_id=${this.props.course_id}&quiz_id=${this.props.quizData.quiz_id}&score=${score}&time=${`${Minutes}:${Seconds}`}`);
    console.log(response);
  }

  componentWillUnmount() {
    UserAnswers = [];
    Answers = [];
    score = 0
  }

  getResponse = (evt) => {
    evt.stopPropagation()
    UserAnswers[this.props.quizData.quiz_questions.indexOf(this.state.curr_question)] = evt.target.id
  }

  onNext = () => {
    $(`.col-2 button#${this.props.quizData.quiz_questions.indexOf(this.state.curr_question)}`).removeClass('selected');
    $(`.options-available button#${UserAnswers[this.props.quizData.quiz_questions.indexOf(this.state.curr_question)]}`).removeClass('selected');
    this.setState({ curr_question: this.props.quizData.quiz_questions[this.props.quizData.quiz_questions.indexOf(this.state.curr_question) + 1] })
  }
  
  onNextAnsPage = () => {
    $(`.col-2 button#${this.state.quizQuestions.indexOf(this.state.curr_question_ans_page)}`).removeClass('selected');
    $(`.options-available button#${UserAnswers[this.state.quizQuestions.indexOf(this.state.curr_question_ans_page)]}`).removeClass('selected');
    this.setState({ curr_question_ans_page: this.state.quizQuestions[this.state.quizQuestions.indexOf(this.state.curr_question_ans_page) + 1] })
  }

  onPrev = () => {
    if (this.props.quizData.quiz_questions.indexOf(this.state.curr_question) === 0) { }
    else {
      $(`.col-2 button#${this.props.quizData.quiz_questions.indexOf(this.state.curr_question)}`).removeClass('selected');
      $(`.options-available button#${UserAnswers[this.props.quizData.quiz_questions.indexOf(this.state.curr_question)]}`).removeClass('selected');
      this.setState({ curr_question: this.props.quizData.quiz_questions[this.props.quizData.quiz_questions.indexOf(this.state.curr_question) - 1] });
    }
  }

  onPrevAnsPage = () => {
    if (this.state.quizQuestions.indexOf(this.state.curr_question_ans_page) === 0) { }
    else {
      $(`.col-2 button#${this.state.quizQuestions.indexOf(this.state.curr_question_ans_page)}`).removeClass('selected');
      $(`.options-available button#${UserAnswers[this.state.quizQuestions.indexOf(this.state.curr_question_ans_page)]}`).removeClass('selected');
      this.setState({ curr_question_ans_page: this.state.quizQuestions[this.state.quizQuestions.indexOf(this.state.curr_question_ans_page) - 1] });
    }
  }

  getSoln = () => {
    for (var i = 0; i < this.state.qCount; i++) {
      Answers.push(this.props.quizData.quiz_questions[i].answer)
    }
  }

  calculateScore = () => {
    for (var i = 0; i < this.state.qCount; i++) {
      if (Answers[i] === UserAnswers[i]) {
        score += 1;
      }
    }
  }

  onSubmit = () => {
    this.calculateScore();
    this.setState({
      curr_question: this.props.quizData.quiz_questions[0],
      curr_question_ans_page: this.state.quizQuestions[0],
      success: true,
      checkAns:false,
    });
    this.sendScore();
    // console.log('res',UserAnswers);
    // console.log('sol',Answers);
  }

  onQView = (evt) => {
    $(`.col-2 button#${this.props.quizData.quiz_questions.indexOf(this.state.curr_question)}`).removeClass('selected');
    $(`.options-available button#${UserAnswers[this.props.quizData.quiz_questions.indexOf(this.state.curr_question)]}`).removeClass('selected');
    this.setState({ curr_question: this.props.quizData.quiz_questions[evt.target.id] })
  }

  onQViewAnsPage = (evt) => {
    $(`.col-2 button#${this.state.quizQuestions.indexOf(this.state.curr_question_ans_page)}`).removeClass('selected');
    $(`.options-available button#${UserAnswers[this.state.quizQuestions.indexOf(this.state.curr_question_ans_page)]}`).removeClass('selected');
    this.setState({ curr_question_ans_page: this.state.quizQuestions[evt.target.id] })
  }

  renderQueNo = () => {
    return (this.props.quizData.quiz_questions.map((data) => {
      return (
        <div className='col-2 px-0 my-1' key={data.quiz_question_id} >
          <button id={this.props.quizData.quiz_questions.indexOf(data)} className='p-2 queIndicator' onClick={this.onQView} style={{ color: '#43C8B1', background: '#5ED0BC3C', cursor: 'pointer', border: 'none', borderRadius: '5px', width: '45px' }}>
            Q{this.props.quizData.quiz_questions.indexOf(data) + 1}
          </button>
        </div>
      )
    }));
  }

  renderQueNoAnsPage = () => {
    return (this.state.quizQuestions.map((data) => {
      return (
        <div className='col-2 px-0 my-1' key={data.quiz_question_id} >
          <button id={this.state.quizQuestions.indexOf(data)} className='p-2 queIndicator' onClick={this.onQViewAnsPage} style={{ color: '#43C8B1', background: '#5ED0BC3C', cursor: 'pointer', border: 'none', borderRadius: '5px', width: '45px' }}>
            Q{this.state.quizQuestions.indexOf(data) + 1}
          </button>
        </div>
      )
    }));
  }

  renderOptions = () => {
    if (!this.state.curr_question.option1_img) {
      return (
        <div className='options-available' >
          <button id='1' onClick={this.getResponse} className='w-100 my-3 p-2 queIndicator option-border text-left f-20 bg-shade'>a.&nbsp; {this.state.curr_question.option1}</button>
          <button id='2' onClick={this.getResponse} className='w-100 my-3 p-2 queIndicator option-border text-left f-20 bg-shade'>b.&nbsp; {this.state.curr_question.option2}</button>
          <button id='3' onClick={this.getResponse} className='w-100 my-3 p-2 queIndicator option-border text-left f-20 bg-shade'>c.&nbsp; {this.state.curr_question.option3}</button>
          <button id='4' onClick={this.getResponse} className='w-100 my-3 p-2 queIndicator option-border text-left f-20 bg-shade'>d.&nbsp; {this.state.curr_question.option4}</button>
        </div>
      )
    }
    else {
      return (
        <div className='options-available' >
          <button id='1' onClick={this.getResponse} className='w-100 my-3 p-2 queIndicator option-border text-left f-20 bg-shade'><img src={this.state.curr_question.option1_img} alt={this.state.curr_question.option1_img} /></button>
          <button id='2' onClick={this.getResponse} className='w-100 my-3 p-2 queIndicator option-border text-left f-20 bg-shade'><img src={this.state.curr_question.option2_img} alt={this.state.curr_question.option2_img} /></button>
          <button id='3' onClick={this.getResponse} className='w-100 my-3 p-2 queIndicator option-border text-left f-20 bg-shade'><img src={this.state.curr_question.option3_img} alt={this.state.curr_question.option3_img} /></button>
          <button id='4' onClick={this.getResponse} className='w-100 my-3 p-2 queIndicator option-border text-left f-20 bg-shade'><img src={this.state.curr_question.option4_img} alt={this.state.curr_question.option4_img} /></button>
        </div>
      )
    }
  }

  renderOptionsAnsPage = () => {
    if (!this.state.curr_question.option1_img) {
      return (
        <div className='options-available' >
          <div id='1' style={{ display:'flex',justifyContent:'space-between',backgroundColor: this.state.curr_question_ans_page.answer == 1 && `#43c9b1`, color: this.state.curr_question_ans_page.answer == 1 && `white` }} className='w-100 my-3 p-2 queIndicator option-border text-left f-20 bg-shade'>
            a. &nbsp; {this.state.curr_question_ans_page.option1}
            <p className='mb-0'>{this.state.curr_question_ans_page.answer == 1 && <i class="fas fa-check"></i>}</p>
          </div>
          <div id='2' style={{ display:'flex',justifyContent:'space-between',backgroundColor: this.state.curr_question_ans_page.answer == 2 && `#43c9b1`, color: this.state.curr_question_ans_page.answer == 2 && `white` }} className='w-100 my-3 p-2 queIndicator option-border text-left f-20 bg-shade'>
            b. &nbsp; {this.state.curr_question_ans_page.option2}
            <p className='mb-0'>{this.state.curr_question_ans_page.answer == 2 && <i class="fas fa-check"></i>}</p>
          </div>
          <div id='3' style={{ display:'flex',justifyContent:'space-between',backgroundColor: this.state.curr_question_ans_page.answer == 3 && `#43c9b1`, color: this.state.curr_question_ans_page.answer == 3 && `white` }} className='w-100 my-3 p-2 queIndicator option-border text-left f-20 bg-shade'>
            c. &nbsp; {this.state.curr_question_ans_page.option3}
            <p className='mb-0'>{this.state.curr_question_ans_page.answer == 3 && <i class="fas fa-check"></i>}</p>
          </div>
          <div id='4' style={{ display:'flex',justifyContent:'space-between',backgroundColor: this.state.curr_question_ans_page.answer == 4 && `#43c9b1`, color: this.state.curr_question_ans_page.answer == 4 && `white` }} className='w-100 my-3 p-2 queIndicator option-border text-left f-20 bg-shade'>
            d. &nbsp; {this.state.curr_question_ans_page.option4}
            <p className='mb-0'>{this.state.curr_question_ans_page.answer == 4 && <i class="fas fa-check"></i>}</p>
          </div>
        </div>
      )
    }
    else {
      return (
        <div className='options-available' >
          <div id='1' style={{ backgroundColor: this.state.curr_question_ans_page.answer == 1 && `#43c9b1`, color: this.state.curr_question_ans_page.answer == 1 && `white` }} className='w-100 my-3 p-2 queIndicator option-border text-left f-20 bg-shade'><img src={this.state.curr_question.option1_img} alt={this.state.curr_question_ans_page.option1_img} /></div>
          <div id='2' style={{ backgroundColor: this.state.curr_question_ans_page.answer == 2 && `#43c9b1`, color: this.state.curr_question_ans_page.answer == 2 && `white` }} className='w-100 my-3 p-2 queIndicator option-border text-left f-20 bg-shade'><img src={this.state.curr_question.option2_img} alt={this.state.curr_question_ans_page.option2_img} /></div>
          <div id='3' style={{ backgroundColor: this.state.curr_question_ans_page.answer == 3 && `#43c9b1`, color: this.state.curr_question_ans_page.answer == 3 && `white` }} className='w-100 my-3 p-2 queIndicator option-border text-left f-20 bg-shade'><img src={this.state.curr_question.option3_img} alt={this.state.curr_question_ans_page.option3_img} /></div>
          <div id='4' style={{ backgroundColor: this.state.curr_question_ans_page.answer == 4 && `#43c9b1`, color: this.state.curr_question_ans_page.answer == 4 && `white` }} className='w-100 my-3 p-2 queIndicator option-border text-left f-20 bg-shade'><img src={this.state.curr_question.option4_img} alt={this.state.curr_question_ans_page.option4_img} /></div>
        </div>
      )
    }
  }

  renderButtons = () => {
    if (this.props.quizData.quiz_questions.indexOf(this.state.curr_question) < this.state.qCount - 1) {
      if (this.state.view > 700) {
        return (
          <div className='my-2'>
            <div className='d-inline-block mb-100 my-2'>
              <button className='btn error p-2 mb-100' onClick={this.onPrev}>Previous Question</button>
            </div>
            <div className='d-inline-block float-right mb-100 my-2'>
              <button className='btn success p-2 mb-100' onClick={this.onNext}>Next Question</button>
            </div>
          </div>
        )
      }
      else {
        return (
          <div className='my-2' >
            <div className='d-inline-block float-right mb-100 my-2'>
              <button className='btn success p-2 mb-100' onClick={this.onNext}>Next Question</button>
            </div>
            <div className='d-inline-block mb-100 my-2'>
              <button className='btn error p-2 mb-100' onClick={this.onPrev}>Previous Question</button>
            </div>
          </div>
        )
      }
    }
    else {
      return (
        <div className='my-2'>
          <div className='d-inline-block mb-100 my-2'>
            <button className='btn error p-2 mb-100' onClick={this.onPrev}>Previous Question</button>
          </div>
          <div className='d-inline-block float-right mb-100 my-2'>
            <button className='btn success p-2 mb-100' onClick={this.onSubmit}>Submit Test</button>
          </div>
        </div>
      )
    }
  }

  renderButtonsAnsPage = () => {
    if (this.state.quizQuestions.indexOf(this.state.curr_question_ans_page) < this.state.qCount - 1) {
      if (this.state.view > 700) {
        return (
          <div className='my-2'>
            <div className='d-inline-block mb-100 my-2'>
              <button className='btn error p-2 mb-100' onClick={this.onPrevAnsPage}>Previous Question</button>
            </div>
            <div className='d-inline-block float-right mb-100 my-2'>
              <button className='btn success p-2 mb-100' onClick={this.onNextAnsPage}>Next Question</button>
            </div>
          </div>
        )
      }
      else {
        return (
          <div className='my-2' >
            <div className='d-inline-block float-right mb-100 my-2'>
              <button className='btn success p-2 mb-100' onClick={this.onNextAnsPage}>Next Question</button>
            </div>
            <div className='d-inline-block mb-100 my-2'>
              <button className='btn error p-2 mb-100' onClick={this.onPrevAnsPage}>Previous Question</button>
            </div>
          </div>
        )
      }
    }
    else {
      return (
        <div className='my-2'>
          <div className='d-inline-block mb-100 my-2'>
            <button className='btn error p-2 mb-100' onClick={this.onPrevAnsPage}>Previous Question</button>
          </div>
          <div className='d-inline-block float-right mb-100 my-2'>
            <button className='btn success p-2 mb-100' onClick={this.onSubmit}>Go to Results Page</button>
          </div>
        </div>
      )
    }
  }

  render() {
    if (!this.state.success) {
      if (this.props.display > 700) {
        return (
          <div className='container  mt-3'>
            <h6 className='f-22 p-semi-bold'>Go Directly to the question By Clicking the Buttons Below</h6>
            <div className=''>
              <div className='row my-5 mx-auto questions'>
                {this.renderQueNo()}
              </div>
              <div className='w-100 quiz-border row m-0 mx-auto'>
                <div className='col-5'><p className='p-3 mb-0 text-center font-popins-m' style={{ color: '#F56962' }}>{this.props.quizData.quiz_questions.indexOf(this.state.curr_question) + 1}/{this.props.quizData.total_questions} Questions</p></div>
                <div className='col-1'><p className='p-3 mb-0 text-center font-popins-m' style={{ color: '#F56962' }}>|</p></div>
                <div className='col-5'><p className='p-3 mb-0 text-center font-popins-m' style={{ color: '#F56962' }}>Time Left : <span id='time'> {this.props.quizData.total_time}:00 </span></p></div>
              </div>
            </div>
            <div className=' pt-5'>
              <div className='container p-4' style={{ background: '#F6F7F9' }}>
                <h5>{this.state.curr_question.question}</h5>
                {this.state.curr_question.question_img && (
                  <img width="40%" src={this.state.curr_question.question_img} alt={this.state.curr_question.question_img} />
                )}
                <div className='options'>
                  {this.renderOptions()}
                </div>
              </div>
              {this.renderButtons()}
            </div>
          </div>
        );
      }
      else {
        return (
          <div className='container  mt-3'>
            <div className=''>
              <div className='w-100 quiz-border row m-0 mx-auto'>
                <div className='col-5'><p className='p-3 mb-0 text-center font-popins-m' style={{ color: '#F56962' }}>{this.props.quizData.quiz_questions.indexOf(this.state.curr_question) + 1}/{this.props.quizData.total_questions} Questions</p></div>
                <div className='col-1'><p className='p-3 mb-0 text-center font-popins-m' style={{ color: '#F56962' }}>|</p></div>
                <div className='col-5'><p className='p-3 mb-0 text-center font-popins-m' style={{ color: '#F56962' }}>Time Left : <span id='time'> {this.props.quizData.total_time}:00 </span></p></div>
              </div>
            </div>
            <div className=' pt-5'>
              <div className='container p-4' style={{ background: '#F6F7F9' }}>
                <h5>{this.state.curr_question.question}</h5>
                <div className='options'>
                  {this.renderOptions()}
                </div>
                {this.renderButtons()}
              </div>
            </div>
            <h6 className='f-22 p-semi-bold'>Go Directly to the question By Clicking the Buttons Below</h6>
            <div className='row my-2 mx-auto questions'>
              {this.renderQueNo()}
            </div>
          </div>
        );
      }
    }
    else {
      if (this.state.checkAns == false) {
        console.log(this.state.checkAns)
        return (
          <div>
            <div className='container text-center'>
              <img className='text-center mt-3' width='250' src={cup} alt='cup' />
              <h1 className='mt-5 p-bold text-center' style={{ color: '#43C8B1' }}>{score}/{this.props.quizData.total_marks}</h1>
              <p className='f-18 font-poppins-r' style={{ color: '#5F5982' }}>Thank you For Completeing the Mock Test <br /> You Have Completed the Mock Test in {`${Minutes}:${Seconds}`}<br /> You have done a great attempt, you can </p>
              <div className='w-100 text-center my-2'>
                <button className='btn error p-2 text-capitalize w-25 mb-100' onClick={this.props.next}>Start Next Quiz</button>
              </div>
              <div className='w-100 text-center my-2'>
                <button className='btn success p-2 text-capitalize w-25 mb-100' onClick={() => this.setState({ checkAns: true }, () => { console.log(this.state.checkAns) })}>Check Quiz Answers</button>
              </div>
              <div className='w-100 text-center my-2 '>
                <button className='btn error p-2 w-25 mb-100' onClick={this.props.dashboard}>Go to Dashboard</button>
              </div>
              <div className='w-100 text-center my-2'>
                <button href='https://telegram.me/govtjobkaro' className='btn success p-2 w-25 mb-100'>Go to Discussion</button>
              </div>
            </div>
            <div className='container'>
            </div>
          </div>
        );
      }
      else if (this.state.checkAns == true) {
        return (
          <div className='container  mt-3'>
            <h6 className='f-22 p-semi-bold'>Answer key for {this.state.quizName}</h6>
            <div className=''>
              <div className='row my-5 mx-auto questions'>
                {this.renderQueNoAnsPage()}
              </div>
              <div className='w-100 quiz-border m-0 mx-auto'>
                <div><p className='p-3 mb-0 text-center font-popins-m' style={{ color: '#F56962', textAlign: 'center' }}>{this.state.quizQuestions.indexOf(this.state.curr_question_ans_page) + 1}/{this.props.quizData.total_questions} Questions</p></div>
              </div>
            </div>
            <div className=' pt-5'>
              <div className='container p-4' style={{ background: '#F6F7F9' }}>
                <h5>{this.state.curr_question_ans_page.question}</h5>
                {this.state.curr_question_ans_page.question_img && (
                  <img width="40%" src={this.state.curr_question_ans_page.question_img} alt={this.state.curr_question.question_img} />
                )}
                <div className='options'>
                  {this.renderOptionsAnsPage()}
                </div>
              </div>
              {this.renderButtonsAnsPage()}
            </div>
          </div>
        )
      }
    }
  }
}


export default QuizScreen
