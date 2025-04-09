import AreaLink from './AreaLink';
import './../assets/scss/painting.scss';
import { SAFE_CLOSED_SCREEN } from '../constants/constants.jsx';


const PaintingScreen = (props) => {
  return (
    <div id="screen_painting" className={"screen_wrapper" + (props.show ? "" : " screen_hidden")}>
      <div className="containers">
        {props.show ? <AreaLink tooltip={props.I18n.getTrans("slide")} className="painting-area-link" onClick={() => props.onOpenScreen(SAFE_CLOSED_SCREEN)} /> : null}
      </div>
    </div>
  );
};

export default PaintingScreen;