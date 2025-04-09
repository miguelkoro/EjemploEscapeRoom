import './../assets/scss/safeopen.scss';
import DoorSound from './DoorSound';


export default function SafeOpenScreen(props) {

    return (
      <div id="screen_safe_open_screen" className={"screen_wrapper" + (props.show ? "" : " screen_hidden")} >
        <div className="containers">
          {props.show ? <DoorSound play={props.show}/> : null}
          <div className="boxStyle"><div>
            <p>{props.solvedAllPuzzles ? props.I18n.getTrans("success_msg") : props.I18n.getTrans("bad_msg")}&nbsp;
              {props.solvedAllPuzzles ? <button className="btn" onClick={props.solvePuzzle}>
                {props.I18n.getTrans("i.continue")}
              </button> : null}</p>
          </div>
          </div>
        </div>
      </div>
    );
}


