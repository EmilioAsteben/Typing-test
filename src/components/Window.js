import {useState, useEffect, useMemo, useRef} from 'react';

function Window(){
    const currentChar  = useRef(0); 
    const [text, setText] = useState([]); 
    const [loading, setLoading] = useState(true)
    let textLength;
    let chars = document.getElementsByTagName('span');

    useEffect(()=>{

        fetch('https://baconipsum.com/api/?type=all-meat&paras=1&format=text&sentences=1')
        .then(response => response.text())
        .then(text => {textLength = text.length; return text.split('')})
        .then((text)=> {setText(text) })
        .then(()=>{setLoading(false); chars[currentChar.current].className = 'green'})
        
    },[])

    useEffect(()=>{

        document.addEventListener('keydown', (e)=> keydownHandler(e))
        console.log('currentchar hook',chars[currentChar.current]);
        
        return function(){
            document.removeEventListener('keydown', (e)=> keydownHandler(e))
        }
     }, [] )

     function keydownHandler(e){
  
         
        if(e.keyCode === 16){
            
            return
        } 

        if(currentChar.current === textLength -1 ){
            chars[currentChar.current].className = 'passed';
            return;
        }

        if(e.key !== chars[currentChar.current].textContent){
            chars[currentChar.current].className = 'red';
            return;
        }
        currentChar.current++; 
        chars[currentChar.current].className = 'green';
        chars[currentChar.current - 1].className = 'passed'; 
        
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
        
    </div>
)
}

export default Window