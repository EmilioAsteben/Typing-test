
function Sidebar(props){


    return(

        <aside>

            <div className = 'stats'>
                <h4>accuracy</h4>
                {parseFloat(props.accuracy.toFixed(1))}%
                
                </div>

            <div className = 'stats'>
                <h4>speed</h4>
                {props.speed} ch/min
                
                </div>

                <button type = 'reset' tabIndex ={-1} onClick ={(e)=> {props.restart(e)}}>Restart</button>

        </aside>

    )
}

export default Sidebar;