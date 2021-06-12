import {useState, useEffect, useMemo, useRef} from 'react';

function Window(){
    const currentChar  = useRef(0); 
    const missCounter = useRef(0);
    const isTestPassed = useRef(false);
    const timeCounter = useRef(0);
    const [timer, setTimer] = useState(false);
    const [text, setText] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [typingAccuracy, setTypingAccuracy] = useState(100);
    const isMistake = useRef(false);
    let textLength;
    let chars = document.getElementsByTagName('span');

    useEffect(()=>{

        fetch('https://baconipsum.com/api/?type=all-meat&paras=1&format=text&sentences=1')
        .then(response => response.text())
        .then(text => {textLength = text.length; return text.split('')})
        .then((text)=> {console.log(text.length);setText(text) })
        .then(()=>{setLoading(false); chars[currentChar.current].className = 'green'})

        // fetch('https://fish-text.ru/get?format=json&number=1')
        // .then(response => response.json())
        //  .then(text => {textLength = text.text.length; return text.text.split('')})
        //  .then((text)=> {console.log(text.length);setText(text) })
        //  .then(()=>{setLoading(false); chars[currentChar.current].className = 'green'})
        
        
    },[])

    useEffect(()=>{

        document.addEventListener('keydown', (e)=> keydownHandler(e))
        console.log('currentchar hook',chars[currentChar.current]);
        
        return function(){
            document.removeEventListener('keydown', (e)=> keydownHandler(e))
        }
     }, [] )

     function toggleText(e){
        e.preventDefault();
        setLoading(true);
        setText([]);
          fetch('https://fish-text.ru/get?format=json&number=1')
        .then(response => response.json())
         .then(text => {textLength = text.text.length; return text.text.split('')})
         .then((text)=> {console.log(text.length);setText(text) })
         .then(()=>{setLoading(false); chars[currentChar.current].className = 'green'})
     }

     function keydownHandler(e){
  
       
        if(e.keyCode === 16 || isTestPassed.current === true ){
            
            return
        } 

        if(currentChar.current >= textLength -1 && e.key === chars[currentChar.current].textContent  ){
            chars[currentChar.current].className = 'passed';
            isTestPassed.current = true;
            
            return;
        }

        if(e.key !== chars[currentChar.current].textContent){
            chars[currentChar.current].className = 'red';
            isMistake.current === false && missCounter.current++; 
            isMistake.current === false && 
            setTypingAccuracy((prev=>
                (prev - 1 / (textLength /100))
            ));
            isMistake.current = true;
            
            
            
            return;
        }
        currentChar.current++; 
        chars[currentChar.current].className = 'green';
        chars[currentChar.current - 1].className = 'passed'; 
        isMistake.current = false;
        console.log(currentChar.current , textLength -1 );
     }

return(

    <div  >
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

      Accuracy {parseFloat(typingAccuracy.toFixed(1))  + '%'}

      
        
    </div>
)
}

export default Window