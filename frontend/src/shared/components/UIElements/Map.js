import React, { useRef, useEffect } from "react";
import mapboxgl from 'mapbox-gl';

import "./Map.css";

const Map = (props) => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  if (process.env.NODE_ENV !== 'production'){
    const token = "pk.eyJ1IjoiYW5oYTk3IiwiYSI6ImNrc2dnNWtmbTFqcGIyd3JvdHFzcWJwODMifQ.izEXvRJBQMNJRo612IblEw";
    // console.log(process.env.REACT_APP_API_KEY);
    // const token = process.env.REACT_APP_API_KEY;
    mapboxgl.accessToken = token;
  }
  else{
    mapboxgl.accessToken = "something"
  }

  const mapCenter = Object.values(props.center)

  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: [mapCenter[1], mapCenter[0]],
      zoom: 12
    })
  }, [mapContainer, mapCenter])

  return (
    <React.Fragment>
      <div ref={mapContainer} className={`map-container ${props.className}`} style={props.style}></div>
    </React.Fragment>
  );
};

export default Map;
