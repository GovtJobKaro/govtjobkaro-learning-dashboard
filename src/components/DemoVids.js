import React from 'react'

const list = [1,2,3];
class DemoVids extends React.Component{

 renderVids = () => {
   if (this.props.display > 700){
     return(list.map((data)=>{
       return(
         <div className='col-4' key={data}>
           <img src='http://via.placeholder.com/300x200' alt='img'/>
         </div>
       );
     }));
   }
   else {
     return(
       <div className='ml-auto mr-auto'>
         <img  src='http://via.placeholder.com/300x200' alt='img' />
       </div>
     );
   }
 }

  render(){
    // console.log(this.props.display)
    return (
        <div className="announcements-box loadAnnouncement" style={{ display: 'grid'}}>
          <div className="loader-containerAnnouncement d-none">
              <div className="loader"></div>
          </div>
          <div className="container"><p><iframe width="560" height="315" src="https://www.youtube.com/embed/h0rWyaBUQsM" frameBorder="0" allowFullScreen=""></iframe></p></div>
          <div className="container"><p><iframe width="560" height="315" src="https://www.youtube.com/embed/Vv3EDufGuhI" frameBorder="0" allowFullScreen=""></iframe></p></div>
          <div className="container"><p><iframe width="560" height="315" src="https://www.youtube.com/embed/PfhCP2OYUm4" frameBorder="0" allowFullScreen=""></iframe></p></div>
          <div className="container"><p><iframe width="560" height="315" src="https://www.youtube.com/embed/3B8s5h70SyQ" frameBorder="0" allowFullScreen=""></iframe></p></div>
          <div className="container"><p><iframe width="560" height="315" src="https://www.youtube.com/embed/m-Dd2-61U1I" frameBorder="0" allowFullScreen=""></iframe></p></div>
        </div>
    );
  }
}

export default DemoVids;
