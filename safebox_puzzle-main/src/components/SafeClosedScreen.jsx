import './../assets/scss/safeclosed.scss';
import AreaLink from './AreaLink';
import { KEYPAD_SCREEN } from '../constants/constants.jsx';


const SafeClosedScreen = (props) => {
  return (
    <div id="screen_safe_closed_screen" className={"screen_wrapper" + (props.show ? "" : " screen_hidden")}>
      <div className="containers">
        {props.show ? <AreaLink tooltip={props.I18n.getTrans("see_keypad")} className="keypad-link" onClick={() => props.onOpenScreen(KEYPAD_SCREEN)} /> : null}
      </div>
    </div>
  );
};

export default SafeClosedScreen;