import {
  Streamlit,
  ComponentProps,
  withStreamlitConnection
} from "streamlit-component-lib"
import React, { useEffect, useState } from "react"
import './index.css'

import ReactPlayer from "react-player"
import HeightObserver from "./height-observer"

const StreamlitPlayer = ({ args }: ComponentProps) => {
  const [playerEvents, setPlayerEvents] = useState({})
  let player: any
  let scroll: any

  function ref(playerInstance: any) {
    player = playerInstance;
  }
  function scroll_ref(scrollInstance: any) {
    scroll = scrollInstance;
  }


  // Handle events
  useEffect(() => {
    let events: any = {}

    args.events.forEach((name: string) => {
      events[name] = (data?: any) => {
        Streamlit.setComponentValue({
          name: name,
          data: data
        })
      }
    })

    setPlayerEvents(events)
  }, [args.events])

  function seek(time:string) {
    // const currentTime = player.getCurrentTime();
    var t = time.split(':')
    var min = +t[0] 
    var sec = +t[1]
    var total = (min * 60) + sec

    
    player.seekTo(total, 'seconds')
  }

  function scroll_div(positive: boolean){
    if (positive)
      scroll.scrollLeft += 500
    else
      scroll.scrollLeft -= 500
  }

  return (
    <HeightObserver onChange={Streamlit.setFrameHeight} fixedHeight={args.height}>
      <ReactPlayer
        ref={ref}
        url={args.url}
        width="100%"
        height={args.height || undefined}
        playing={args.playing || undefined}
        loop={args.loop || undefined}
        controls={args.controls || undefined}
        light={args.light || undefined}
        volume={args.volume}
        muted={args.muted || undefined}
        playbackRate={args.playbackRate}
        progressInterval={args.progressInterval}
        playsinline={args.playInline || undefined}
        config={args.config || undefined}
        {...playerEvents}
      />
      <div className="container"> 
      <a className="highlights">highlights</a>
      <button onClick={() => scroll_div(false)} className={"left"}>&lt;</button>  
        <div className="scroll" ref={scroll_ref}>
            {args.timestamps.map((time : string) => (
            <button onClick={() => seek(time)} className={"btn"}>    {time}    </button>
            ))}
        </div>
        
      <button onClick={() => scroll_div(true)} className={"right"}>&gt;</button> 
      </div>
    </HeightObserver>
  )
}





export default withStreamlitConnection(StreamlitPlayer)
