import { useState, useEffect, useMemo, useRef } from "react";
import Sidebar from "./Sidebar";
import {incEnteredChars} from "../redux/actions";
import {connect} from "react-redux";
import "../styles/typetrainer.css";

function TypeTrainer(props) {

  const [activeCharClass, setActivaCharClass] = useState("green");

  const isTestStarted = useRef(false);
  const isTestPassed = useRef(false);
  const [showResult, setShowResult] = useState(false);

  const currentChar = useRef(0);
  const missCounter = useRef(0);
  const enteredChars = useRef(0);
  const [charsPerMinute, setCharsPerMinute] = useState(0);
  const [typingAccuracy, setTypingAccuracy] = useState(100);

  const isMistake = useRef(false);
  const [wrongLayout, setWrongLayout] = useState(false);
  const [disableSelect, setDisableSelect] = useState(false);

  const language = useRef("English");

  const timer = useRef(false);
  const timeCounter = useRef(0);
  let timerInterval = useRef();

  const [text, setText] = useState([]);
  let textLength = useRef(0);

  const [loading, setLoading] = useState(true);

  let chars = useRef(document.getElementsByTagName("span"));
  chars = chars.current;

 

  useEffect(() => {
    fetchEngText();

    document.addEventListener("keydown", (e) => keydownHandler(e));

    return function () {
      document.removeEventListener("keydown", (e) => keydownHandler(e));
    };
  }, []);

  function fetchEngText() {
    setLoading(true);
    setText([]);

    fetch(
      "https://baconipsum.com/api/?type=all-meat&paras=1&format=text&sentences=1"
    )
      .then((response) => response.text())
      .then((text) => {
        textLength.current = text.length;
        return text.split("");
      })
      .then((text) => {
        setText(text);
      })
      .then(() => {
        setLoading(false);
        setActivaCharClass("green");
      })
      .catch(() => {
        setLoading(false);
        setText(["ERROR: Something went wrong. Please click Restart. "]);
      });
  }

  function fetchRusText() {
    setLoading(true);
    setText([]);

    fetch("https://fish-text.ru/get?format=json&number=1")
      .then((response) => response.json())
      .then((text) => {
        textLength.current = text.text.length;
        return text.text.split("");
      })
      .then((text) => {
        setText(text);
      })
      .then(() => {
        setLoading(false);
        setActivaCharClass("green");
      })
      .catch(() => {
        setLoading(false);
        setText(["ERROR: Что-то пошло не так. Пожалуйста, нажмите Restart "]);
      });
  }

  function toggleTextLang(e, lang) {
    e.preventDefault();
    setWrongLayout(false);
    if (language.current === lang || isTestStarted.current) return;
    language.current = lang;

    lang === "English" ? fetchEngText() : fetchRusText();
  }

  const restart = (e) => {
    e.target.blur();

    clearInterval(timerInterval.current);
    isTestStarted.current = false;
    currentChar.current = 0;
    missCounter.current = 0;
    isTestPassed.current = false;
    timeCounter.current = 0;
    isMistake.current = false;
    enteredChars.current = 0;

    setShowResult(false);
    setDisableSelect(false);
    setWrongLayout(false);
    setCharsPerMinute(0);
    setTypingAccuracy(100);
    timer.current = false;
    language.current === "English" ? fetchEngText() : fetchRusText();
  };

  function startTimer() {
    setDisableSelect(true);

    isTestStarted.current = true;

    timer.current = true;

    timerInterval.current = setInterval(() => {
      timeCounter.current++;
      setCharsPerMinute(
        Math.floor((60 / timeCounter.current) * enteredChars.current)
      );
    }, 1000);
  }

  function endTimer() {
    if (!timer.current && isTestPassed.current) {
      clearInterval(timerInterval.current);
    }
  }

  function keydownHandler(e) {
    //Start timer

  

    if (
      timer.current === false &&
      isTestPassed.current === false &&
      e.keyCode > 57
    ) {
      if (
        (language.current === "English" && /^[\x20-\x7E]*$/.test(e.key)) ||
        (language.current === "Russian" && /^[а-яА-ЯЁё\W]*$/.test(e.key))
      )
        startTimer();
    }

    //Switch keyboard layout

    if (
      ((e.shiftKey && e.altKey) || (e.metaKey && e.keyCode === 32)) &&
      !isTestPassed.current
    ) {
      setWrongLayout(false);
    }

    //prevent symbol keystrokes

    if (e.keyCode < 32 || isTestPassed.current === true) {
      return;
    }

    //Check layout

    if (
      (language.current === "English" && !/^[\x20-\x7E]*$/.test(e.key)) ||
      (language.current === "Russian" && !/^[а-яА-ЯЁё\W]*$/.test(e.key))
    ) {
      setWrongLayout(true);

      return;
    }

    // Test end

    if (
      currentChar.current >= textLength.current - 1 &&
      e.key === chars[currentChar.current].textContent
    ) {
      setActivaCharClass("passed")
      isTestPassed.current = true;
      timer.current = false;
      setShowResult(true);
      endTimer();

      return;
    }

    //handles the error

    if (e.key !== chars[currentChar.current].textContent) {
      isMistake.current === false && missCounter.current++;
      isMistake.current === false &&
        setTypingAccuracy((prev) => prev - 1 / (textLength.current / 100));
      isMistake.current === false && enteredChars.current++ &&  props.incEnteredChars();;
      isMistake.current = true;
      setActivaCharClass("red")

      return;
    }

    // Marks current and passed chars

    currentChar.current++;
    enteredChars.current++;
    props.incEnteredChars();
    isMistake.current = false;
    setActivaCharClass("green")
  }

  return (
    <div className="main">
      <div className="inner">
        <div className="text">
          {loading ? "Loading..." : ""}
          {useMemo(
            () =>
              text.map((item, index) => {
                console.log("map")
                return <span className = 
             

               {currentChar.current === index ? activeCharClass : 
                currentChar.current > index   ? "passed" :
                undefined
              }
                
                key={index}>{item}</span>;
              }),
            [text, currentChar.current, activeCharClass]
          )}
        </div>

        <Sidebar
          disableSelect={disableSelect}
          toggleText={toggleTextLang}
          restart={restart}
          accuracy={typingAccuracy}
          speed={charsPerMinute}
        />
      </div>

      {wrongLayout && (
        <div className="wrong_layout">
          
          Please change your keybord layout to {language.current}
        </div>
      )}

      {showResult && (
        <div className="result">
          <h2>GREAT JOB!</h2> <br />
          <div className="result_stat">
            <b>Result:</b> 
            <div> Accuracy: {parseFloat(typingAccuracy.toFixed(1))}%</div> 
           <div> Speed: {charsPerMinute} ch/min </div>
          </div>
        </div>
        
      )}
    </div>
  );
}

// export default TypeTrainer;

const mapDispatchToProps = {
  incEnteredChars
}

const mapStateToProps = state => ({
  characters: state.app.enteredChars
})



export default connect(mapStateToProps, mapDispatchToProps)(TypeTrainer)
