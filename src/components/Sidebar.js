import { useState, useEffect } from "react";
import {connect} from 'react-redux';

function Sidebar(props) {
  const [activeLang, setActiveLang] = useState("English");



  return (
    <aside>
      <div className="stats">
        <h4>accuracy</h4>
        <div className="indicator">
          {parseFloat(props.accuracy.toFixed(1))}%
        </div>
      </div>

      <div className="stats">
        <h4>speed</h4>
        <div className="indicator">{props.speed} ch/min</div>
      </div>


      <div
        className={"select_language" + (props.disableSelect ? " disabled" : "")}
      >
        <h5>Select layout</h5>

        <div className="languages">
          <div
            onClick={(e) => {
              props.toggleText(e, "English");
              setActiveLang("English");
            }}
            className={"eng" + (activeLang === "English" ? " active" : "")}
          >
            Eng
          </div>

          <div
            onClick={(e) => {
              props.toggleText(e, "Russian");
              setActiveLang("Russian");
            }}
            className={"rus" + (activeLang === "Russian" ? " active" : "")}
          >
            Rus
          </div>
        </div>
      </div>

      <button
        className="restart_button"
        type="reset"
        onClick={(e) => {
          props.restart(e);
        }}
      >
        Restart
      </button>
    </aside>
  );
}


const mapStateToProps = state => ({
  characters: state.app.enteredChars
})
export default connect(mapStateToProps)(Sidebar);

