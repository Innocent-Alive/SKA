import React from "react";
import Carousel from "../components/Carousel";
import { courses } from "../config";
import Slider from "../ui/slider";
const Home = () => {
  return (
    <div>
      <Carousel />
      {/* 
      <h1>Resume wheres left...(Videos Pending) </h1>
      <h1>Top Picks For you...(Courses shown as carousel) </h1>
      <h1>One Shot Videos... (Videos) </h1>
      <h1>Small Videos... (Videos) </h1>
      <h1>Featured Courses... (Courses shown as carousel)</h1> */}
      {/* Courses Carousel  */}
      <Slider
        header={"Top Picks For You"}
        description={"Below are the top-picked courses curated just for you."}
        info={courses}
      />
      {/* Notes Carousel  */}
      <h1>Featured Notes</h1>
    </div>
  );
};

export default Home;
