import {
  Streamlit,
  ComponentProps,
  withStreamlitConnection
} from "streamlit-component-lib"
import React, { useEffect, useState } from "react"

import ReactPlayer from "react-player"
import HeightObserver from "./height-observer"

const StreamlitPlayer = ({ args }: ComponentProps) => {
  const [playerEvents, setPlayerEvents] = useState({})
  const [tracker, setTracker] = useState(0)
  let segments = args.timestamps
  let player: any

  function ref(playerInstance: any) {
    player = playerInstance;
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

  function time() {
    // const currentTime = player.getCurrentTime();
    player.seekTo(segments[tracker], 'seconds')
    setTracker(tracker + 1)
    if (tracker == segments.length - 1)
      setTracker(0)
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
      <button onClick={time}>foward</button>
    </HeightObserver>
  )
}

export default withStreamlitConnection(StreamlitPlayer)
