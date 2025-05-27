import BoxButton from "./BoxButton";
const Remote = (props) => {

 return (
    <div className='remote' style={{
        backgroundImage: props.remote,
        height: props.boxHeight * 0.8, 
      }}>
        <div id="row1" className="row" style={{ top: "22%", left: "50%"}}>
            <BoxButton value={"1"} position={1} onClick={props.onClickButton} boxHeight={props.boxHeight} boxWidth={props.boxWidth} button={props.button}/>
            <BoxButton value={"2"} position={2} onClick={props.onClickButton} boxHeight={props.boxHeight} boxWidth={props.boxWidth} button={props.button}/>
            <BoxButton value={"3"} position={3} onClick={props.onClickButton} boxHeight={props.boxHeight} boxWidth={props.boxWidth} button={props.button}/>
        </div>
        <div id="row2" className="row" style={{ top: "32%", left: "50%"}} >
            <BoxButton value={"4"} position={4} onClick={props.onClickButton} boxHeight={props.boxHeight} boxWidth={props.boxWidth} button={props.button}/>
            <BoxButton value={"5"} position={5} onClick={props.onClickButton} boxHeight={props.boxHeight} boxWidth={props.boxWidth} button={props.button}/>
            <BoxButton value={"6"} position={6} onClick={props.onClickButton} boxHeight={props.boxHeight} boxWidth={props.boxWidth} button={props.button}/>
        </div>
        <div id="row3" className="row" style={{ top: "42%" , left: "50%"}}>
            <BoxButton value={"7"} position={7} onClick={props.onClickButton} boxHeight={props.boxHeight} boxWidth={props.boxWidth} button={props.button}/>
            <BoxButton value={"8"} position={8} onClick={props.onClickButton} boxHeight={props.boxHeight} boxWidth={props.boxWidth} button={props.button}/>
            <BoxButton value={"9"} position={9} onClick={props.onClickButton} boxHeight={props.boxHeight} boxWidth={props.boxWidth} button={props.button}/>
        </div>
        <div id="row4" className="row" style={{top: "52%", left: "50%"}}>
            <BoxButton value={"0"} position={11} onClick={props.onClickButton} boxHeight={props.boxHeight} boxWidth={props.boxWidth} button={props.button}/>
        </div>
        <div id="row4" className="row" style={{top: "62%", left: "50%"}}>
            <BoxButton value={"-"} position={12} onClick={props.decreaseVolume} boxHeight={props.boxHeight} boxWidth={props.boxWidth} button={props.button}/>
            <svg width={props.boxWidth*0.04} height="90%" viewBox="0 -1 22 22" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="#ffffff" stroke="#ffffff"> <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>  <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g> <g id="SVGRepo_iconCarrier"> <title>multimedia / 4 - multimedia, audio, music, sound, max, speaker, volume icon</title> <g id="Free-Icons" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round" > <g transform="translate(-968.000000, -304.000000)" id="Group" stroke="#000000" strokeWidth="2"> <g transform="translate(967.000000, 302.000000)" id="Shape"> <path d="M18.22291,4.24772391 C20.3461043,5.89188107 21.7500001,8.74918751 21.7500001,12 C21.7500001,15.2055503 20.384926,18.0284761 18.3111758,19.6828962"></path> <path d="M16.25,16.5 C17.434,15.6838509 18.25,13.984472 18.25,12.0055901 C18.25,10.0267081 17.434,8.32732919 16.25,7.5"></path> <path d="M4.254916,9 L6.24999966,9 L11.2499997,3 L13.2499997,3 L13.2499997,20.9958147 L11.2499997,20.9958147 L6.24999966,15 L4.254916,15 C3.1503465,15 2.254916,14.1045695 2.254916,13 L2.254916,11 C2.254916,9.8954305 3.1503465,9 4.254916,9 Z"></path></g> </g> </g></g></svg>
            <BoxButton value={"+"} position={13} onClick={props.increaseVolume} boxHeight={props.boxHeight} boxWidth={props.boxWidth} button={props.button}/>
        </div>
      </div>
 )
}
export default Remote;