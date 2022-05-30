import React from "react";
import Accordion from "react-bootstrap/Accordion";
import Card from 'react-bootstrap/Card';
import clock from '../icons/clock.svg';
import quiz from '../images/quiz.svg'
//import down from '../icons/down.svg';
import Book from '../icons/Book.svg';
// import Api from './APIs/Api';

class Accordions extends React.Component {

  renderVideos = (chapters, subtopic_index, topic_index, type = 'topics') => {
    if (type === 'quiz') {
      return (chapters.map((chapter, index) => {
        if (chapter.quiz_status === 'Completed') {
          return (
            <div key={chapter.quiz_id} className='row my-2'>
              <div className='col-10'>
                <img src={quiz} alt={quiz} /><span className='f-14 p-regular ml-4'> {chapter.quiz_name} </span><span className='ml-4 f-12 p-regular' style={{ background: '#EDF0FD', color: '#6C63FF', padding: '5px', borderRadius: '5px' }}>{chapter.total_time} min</span>
                <span className='ml-4 p-regular success border f-14 pl-2 pr-2 capitalize' style={{ color: 'white', padding: '5px', borderRadius: '5px' }}>Completed</span>
              </div>
              <div className='col-2'>
                <button id={chapter.quiz_id} quiz_index={index} coursequiz_index={topic_index} className='btn success f-14' style={{ color: 'white' }} onClick={this.props.onQuiz}>Attempt Again</button>
              </div>
            </div>
          );
        }
        else {
          return (
            <div key={chapter.quiz_id} className='row my-2'>
              <div className='col-10'>
                <img src={quiz} alt={quiz} /><span className='f-14 p-regular ml-4'> {chapter.quiz_name} </span><span className='ml-4 f-12 p-regular' style={{ background: '#EDF0FD', color: '#6C63FF', padding: '5px', borderRadius: '5px' }}>{chapter.total_time} min</span>
                <span className='ml-4 p-regular error f-14 capitalize' style={{ color: 'white', padding: '5px', borderRadius: '5px' }}>Not Attempted</span>
              </div>
              <div className='col-2'>
                <button id={chapter.quiz_id} quiz_index={index} coursequiz_index={topic_index} className='btn error f-14' style={{ color: 'white' }} onClick={this.props.onQuiz}>Attempt Now</button>
              </div>
            </div>
          );
        }
      }));
    }
    else {
      // console.log(subtopic_index, topic_index)
      return (chapters.map((chapter, index) => {
        if (chapter.percentage_watched > 99) {
          return (
            <div key={chapter.chapter_id} className='row'>
              <div className='col-10'>
                <img src={Book} alt={Book} /><span className='f-14 p-regular ml-4 text-capitalize'> {chapter.chapter_name} </span><span className='ml-4 f-12 p-regular' style={{ background: '#EDF0FD', color: '#6C63FF', padding: '5px' }}>{chapter.duration}</span>
                <span className='ml-4 p-regular success border f-14 pl-2 pr-2 text-capitalize' style={{ color: 'white', padding: '5px', borderRadius: '5px' }}>Watched</span>
              </div>
              <div className='col-2'>
                <button id={chapter.chapter_id} chapter_index={index} subtopic_index={subtopic_index} topic_index={topic_index} className='btn error f-14 p-regular' style={{ color: 'white' }} onClick={this.props.onvidPlay}>Watch Again</button>
              </div>
            </div>
          );
        }
        else {
          return (
            <div key={chapter.chapter_id} className='row'>
              <div className='col-10'>
                <img src={Book} alt={Book} /><span className='f-14 p-regular ml-4 text-capitalize'>{chapter.chapter_name} </span><span className='ml-4 f-12 p-regular' style={{ background: '#EDF0FD', color: '#6C63FF', padding: '5px' }}>{chapter.duration}</span>
                <span className='ml-4 p-regular error f-14' style={{ color: 'white', padding: '5px', borderRadius: '5px' }}>Not Watched</span>
              </div>
              <div className='col-2'>
                <button id={chapter.chapter_id} chapter_index={index} topic_index={topic_index} subtopic_index={subtopic_index} className='btn error f-14 p-regular' style={{ color: 'white' }} onClick={this.props.onvidPlay}>Watch Now</button>
              </div>
            </div>
          );
        }
      }));
    }
  }

  renderSubtopics = (sub_topics, topic_index) => {
    return (sub_topics.map((subtopic, index) => {
      return (
        <Card key={subtopic.module_id}>
          <Accordion.Toggle style={{ background: '#FEEFEE' }} as={Card.Header} eventKey={`${subtopic.module_id}`}>
            <div className='row'>
              <div className='col-11'><span className='f-20 p-bold'>{subtopic.module_name}</span></div>
              <div className='col-1'>
                <div className=' pl-2 pr-2' style={{ color: '#f56962', background: '#FEEFEE', width: 'max-content', borderRadius: '5px' }}><i className="fas fa-chevron-down"></i></div>
              </div>
            </div>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey={`${subtopic.module_id}`}>
            <Card.Body>
              <div className='container p-0'>
                {this.renderVideos(subtopic.chapters, index, topic_index)}
              </div>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      );
    }));
  }

  renderTopics = (type = 'topic') => {
    if (type === 'quiz') {
      return (this.props.course.course_quizes.map((quiz, index) => {
        return (
          <Card key={quiz.course_quiz_id}>
            <Accordion.Toggle style={{ background: 'white' }} as={Card.Header} eventKey={`${quiz.course_quiz_id}`}>
              <div className='row'>
                <div className='col-5'><span className='f-20 p-bold'>{quiz.heading}</span></div>
                <div className='col-2'>
                  <img src={clock} alt='time' className='' /><span className='duration f-14 p-regular ml-1'>Duration {quiz.duration}</span>
                </div>
                <div className='col-2'>
                  <span className='duration f-14 p-regular ml-1'><i className="fas fa-play"></i> {`${quiz.total_quizes} quizes`}</span>
                </div>
                <div className='col-2'></div>
                <div className='col-1'>
                  <div className=' pl-2 pr-2' style={{ color: '#f56962', background: '#FEEFEE', width: 'max-content', borderRadius: '5px' }}><i className="fas fa-chevron-down"></i></div>
                </div>
              </div>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={`${quiz.course_quiz_id}`}>
              <Card.Body>
                <div className='container p-0'>
                  <Card>
                    <Card.Body>
                      {this.renderVideos(quiz.quizes, null, index, 'quiz')}
                    </Card.Body>
                  </Card>
                </div>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        )
      }));
    }
    else {
      return (this.props.course.topics.map((topic, index) => {
        // console.log(topic.sub_topics);
        return (
          <Card key={topic.topic_id}>
            <Accordion.Toggle style={{ background: 'white' }} as={Card.Header} eventKey={`${topic.topic_id}`}>
              <div className='row'>
                <div className='col-5'><span className='f-20 p-bold'>{topic.topic_name}</span></div>
                <div className='col-2'>
                  <img src={clock} alt='time' className='' /><span className='duration f-14 p-regular ml-1'>Duration {topic.duration}</span>
                </div>
                <div className='col-2'>
                  <span className='duration f-14 p-regular ml-1'><i className="fas fa-play"></i> {topic.totalVideos} Videos</span>
                </div>
                <div className='col-2'>
                  <span className='btn-outline success-text f-14 p-regular border p-2'>{`${Math.floor(topic.percentage_watched)}%`} completed</span>
                </div>
                <div className='col-1'>
                  <div className=' pl-2 pr-2' style={{ color: '#f56962', background: '#FEEFEE', width: 'max-content', borderRadius: '5px' }}><i className="fas fa-chevron-down"></i></div>
                </div>
              </div>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={`${topic.topic_id}`}>
              <Card.Body>
                <div className='container p-0'>
                  <Accordion defaultActiveKey=''>
                    {this.renderSubtopics(topic.sub_topics, index)}
                  </Accordion>
                </div>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        )
      }));
    }
  }

  render() {
    return (
      <Accordion defaultActiveKey="">
        {this.props.course.course_type !== "test" ? this.renderTopics() : <div></div>}
        {this.renderTopics('quiz')}
      </Accordion>
    );
  }
}


export default Accordions
