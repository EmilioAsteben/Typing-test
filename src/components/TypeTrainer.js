import {useState, useEffect, useMemo, useRef} from 'react';
import Sidebar from './Sidebar';
import '../styles/typetrainer.css';

function TypeTrainer(){
    const currentChar  = useRef(0); 
    const missCounter = useRef(0);
    const [wrongLayout, setWrongLayout] = useState(false)
    const isTestPassed = useRef(false);


    const timer = useRef(false);
    const timeCounter = useRef(0);
    let timerInterval = useRef();
    
    const enteredChars = useRef(0); 
    const [charsPerMinute, setCharsPerMinute] = useState(0);
    
    

    const [text, setText] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [typingAccuracy, setTypingAccuracy] = useState(100);
    const isMistake = useRef(false);
    let textLength = useRef(0);
        
    let chars = useRef(document.getElementsByTagName('span'));
        chars = chars.current;

    const restart = (e) => {
        
        e.target.blur();

        clearInterval(timerInterval.current);
        currentChar.current  = 0; 
        missCounter.current =  0;
        isTestPassed.current = false;
        timeCounter.current = 0;
        isMistake.current = false;
        enteredChars.current = 0;
        
        setCharsPerMinute(0);
        setTypingAccuracy(100);
        timer.current = false;
        fetchEngText();
    }


    function startTimer(){

        timer.current = true;

        timerInterval.current = setInterval(() => {timeCounter.current++; setCharsPerMinute(Math.floor(60 /timeCounter.current * enteredChars.current )) }, 1000);
        

     }

     function endTimer(){

        if(!timer.current && isTestPassed.current){
            clearInterval(timerInterval.current);
        }
     }

    useEffect(()=>{

        fetchEngText();

        // fetch('https://baconipsum.com/api/?type=all-meat&paras=1&format=text&sentences=4')
        // .then(response => response.text())
        // .then(text => {textLength = text.length; return text.split('')})
        // .then((text)=> {console.log(text.length);setText(text) })
        // .then(()=>{setLoading(false); chars[currentChar.current].className = 'green'})

        // fetch('https://fish-text.ru/get?format=json&number=1')
        // .then(response => response.json())
        //  .then(text => {textLength = text.text.length; return text.text.split('')})
        //  .then((text)=> {console.log(text.length);setText(text) })
        //  .then(()=>{setLoading(false); chars[currentChar.current].className = 'green'})
        
        
    },[])

    function fetchEngText(){

        setLoading(true);
        setText([]);

        fetch('https://baconipsum.com/api/?type=all-meat&paras=1&format=text&sentences=4')
        .then(response => response.text())
        .then(text => {textLength.current = text.length; return text.split('')})
        .then((text)=> {console.log(text.length);setText(text) })
        .then(()=>{setLoading(false); chars[currentChar.current].className = 'green'})
    }

    useEffect(()=>{

        document.addEventListener('keydown', (e)=> keydownHandler(e));
        
        
        
        return function(){
            document.removeEventListener('keydown', (e)=> keydownHandler(e));
            
        }
     }, [] )

     function toggleText(e){
        e.preventDefault();
        setLoading(true);
        setText([]);
          fetch('https://fish-text.ru/get?format=json&number=1')
        .then(response => response.json())
         .then(text => {textLength.current = text.text.length; return text.text.split('')})
         .then((text)=> {console.log(text.length);setText(text) })
         .then(()=>{setLoading(false); chars[currentChar.current].className = 'green'})
     }

  

     function keydownHandler(e){
         console.log(wrongLayout);
        
        !timer.current && !isTestPassed.current &&  startTimer();

        if( e.shiftKey && e.altKey ){
            setWrongLayout(false);
            console.log('ALTSHIFT');
            
        }

        if(!/^[\x20-\x7E]*$/.test(e.key)){

            console.log('wronglayout');
            setWrongLayout(true);

            return
        }
       
        if(e.keyCode === 16 || e.keyCode === 18 || isTestPassed.current === true ){
            
            return
        } 

        if(currentChar.current >= textLength.current -1 && e.key === chars[currentChar.current].textContent  ){
            chars[currentChar.current].className = 'passed';
            isTestPassed.current = true;
            timer.current = false;
            endTimer();
            
            return;
        }

        if(e.key !== chars[currentChar.current].textContent){
            chars[currentChar.current].className = 'red';
            isMistake.current === false && missCounter.current++; 
            isMistake.current === false && 
            setTypingAccuracy((prev=>
                (prev - 1 / (textLength.current /100))
            ));
            isMistake.current === false &&
            enteredChars.current++;
            isMistake.current = true;
            
            
            return;
        }
        currentChar.current++; 
        enteredChars.current++;
        chars[currentChar.current].className = 'green';
        chars[currentChar.current - 1].className = 'passed'; 
        isMistake.current = false;
        
     }

return(

    <div className = 'main'  >

        <div className="text">
        {loading ? 'Loading...': ''}
      {
         useMemo(() => 
         text.map(
            (item, index) => {
                console.log('map');
                return <span key = {index}>{item}</span>
            }

          ), [text]
         ) 
      }

      {/* Accuracy {parseFloat(typingAccuracy.toFixed(1))  + '%'}
      {charsPerMinute}; */}

      

      
      </div> 
      <Sidebar restart = {restart} accuracy = {typingAccuracy} speed = {charsPerMinute} />
      {wrongLayout && 'wrongLayout'}

      
    </div>
)
}

export default TypeTrainer;