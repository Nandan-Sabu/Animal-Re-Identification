/** @format */

import { useEffect, useState } from 'react';
import { Button } from "../../components/Button";
import { Compass, Wrench } from "lucide-react";
import './home.css';

export default function Home() {
  const [textSize, setTextSize] = useState(() => {
    return localStorage.getItem("textSize") || "Medium";
  });

  useEffect(() => {
    document.documentElement.classList.remove("text-small", "text-medium", "text-large");
    document.documentElement.classList.add(`text-${textSize.toLowerCase()}`);
  }, [textSize]);

  return (
    <>
      <section className="home">
        <div className="home__heading">
          <div className="home__title">
            <h1>Project CARE</h1>
          </div>
          <div className="home__subtitle">
            <h2>
              CARE (Clip-based Animal Re-identification). An AI solution that helps 
              wildlife conservation by enabling scalable animal re-identification. 
            </h2>
          </div>
        </div>
        <div className="home__actions">
          <Button
            ariaLabel="Learn More"
            className="home__button home__button--secondary"
            data-cy="hero-sign-in"
            isLink
            href={"/about"}
            variant="secondary"
          >
            <Compass size={20} style={{ marginRight: "var(--space-8)" }} /> 
            Learn More
          </Button>
          <Button
            ariaLabel="Get started"
            className="home__button home__button--secondary"
            data-cy="hero-sign-in"
            isLink
            href={"/user-guide"}
            variant="secondary"
          >
            <Wrench size={20} style={{ marginRight: "var(--space-8)" }} /> 
            Get started
          </Button>
        </div>
      </section>
    </>
  );
}
