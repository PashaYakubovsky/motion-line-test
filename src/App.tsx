import { useEffect, useRef, useState } from "react";
import "./App.css";
import { gsap } from "@/gsap/all";
import { ScrollTrigger } from "@/gsap/ScrollTrigger";
import { DrawSVGPlugin } from "@/gsap/DrawSVGPlugin";
import { MotionPathPlugin } from "@/gsap/MotionPathPlugin";
import { GSDevTools } from "@/gsap/GSDevTools";

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, MotionPathPlugin, GSDevTools);

function App() {
    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const ctx = gsap.context(() => {
            //learn how this was made at https://www.youtube.com/watch?v=ersN5fk8py0

            gsap.defaults({ ease: "none" });

            const scale = 2.2;

            const pulses = gsap
                .timeline({
                    defaults: {
                        duration: 0.5,
                        transformOrigin: "center",
                        ease: "power0",
                        autoAlpha: 1,
                    },
                })
                .to(
                    ".item01",
                    {
                        strokeWidth: "1",
                        scale: scale,
                    },
                    0.35
                )
                .fromTo(
                    ".popup01",
                    {
                        opacity: 0,
                        y: 50,
                    },
                    {
                        opacity: 1,
                        y: 0,
                    },
                    0.35
                )
                .to(
                    ".item02",
                    {
                        strokeWidth: "1",
                        scale: scale,
                    },
                    1.56
                )
                .fromTo(
                    ".popup02",
                    {
                        opacity: 0,
                        y: 50,
                    },
                    {
                        opacity: 1,
                        y: 0,
                    },
                    1.56
                )
                .to(
                    ".item03",
                    {
                        strokeWidth: "1",
                        scale: scale,
                    },
                    2.52
                )
                .fromTo(
                    ".popup03",
                    {
                        opacity: 0,
                        y: 50,
                    },
                    {
                        opacity: 1,
                        y: 0,
                    },
                    2.52
                );

            gsap.timeline({
                scrollTrigger: {
                    trigger: "#svg",
                    scrub: true,
                    start: "top center",
                    end: "bottom center",
                },
            })
                .from(".theLine", { drawSVG: "0", duration: 4 }, 0)
                .add(pulses, 0);
        });

        return () => {
            ctx.revert();
        };
    }, []);

    const viewportRectRef = useRef<{
        width: number;
        height: number;
    } | null>(null);

    useEffect(() => {
        const handleResize = () => {
            // get rect of viewport object
            const rect = {
                width: window.innerWidth,
                height: window.innerHeight,
            };
            viewportRectRef.current = rect || null;
            // setP(`M -500,0
            // Q ${rect.height * 0.1} 230 300 450
            // T 130 1050
            // T 150 2200`);
        };

        handleResize();

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const [svgPath] = useState<string>(`
        M 200,0
        Q 650 230 250 450 
        T 300 800
        T 400 1200
        T 0 1300
    `);

    return (
        <div className="container">
            <svg id="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 1300">
                <defs>
                    <pattern
                        id="image-1"
                        x="0%"
                        y="0%"
                        height="100%"
                        width="100%"
                        viewBox="0 0 512 512">
                        <image x="0%" y="0%" width="512" height="512" xlinkHref="/ct.png"></image>
                    </pattern>

                    {/* pattern with gradient color */}
                    <linearGradient id="Gradient1" x1="0" x2="1" y1="0" y2="1">
                        <stop offset="0%" stop-color="#FC8B8B" />
                        <stop offset="100%" stop-color="#fff" />
                    </linearGradient>

                    {/* glowing effect only for end of svg path */}
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="5" result="glow" />
                        <feMerge>
                            <feMergeNode in="glow" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    <filter id="glow2" x="-250%" y="-250%" width="500%" height="500%">
                        <feGaussianBlur id="glower" stdDeviation="5" result="glow" />
                        <feMerge>
                            <feMergeNode in="glow" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* animation for glowing effect */}
                <animate
                    xlinkHref="#glower"
                    attributeName="stdDeviation"
                    from="0"
                    to="100"
                    dur="1s"
                    begin="0s"
                    repeatCount="indefinite"
                />

                <path
                    className="theLine"
                    d={svgPath}
                    stroke="url(#Gradient1)"
                    strokeWidth="2"
                    fill="none"
                    filter="url(#glow)"></path>

                {/* <circle className="ball ball01" r="20" cx="50" cy="100"></circle> */}
                <circle
                    fill="url(#image-1)"
                    stroke="url(#Gradient1)"
                    id="circle-1"
                    className="item item01"
                    strokeWidth="0"
                    r="20"
                    cx="450"
                    cy="250"></circle>
                <circle
                    stroke="url(#Gradient1)"
                    fill="url(#image-1)"
                    id="circle-2"
                    className="item item02"
                    strokeWidth="0"
                    r="20"
                    cx="65"
                    cy="641"></circle>
                <circle
                    stroke="url(#Gradient1)"
                    fill="url(#image-1)"
                    strokeWidth="0"
                    id="circle-3"
                    className="item item03"
                    r="20"
                    cx="550"
                    cy="981"></circle>
            </svg>

            <div className="popup popup01">
                <div className="popup__content">
                    <h2>Camera</h2>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores, rerum,
                        perferendis accusamus quo doloremque cumque atque ipsa error officiis
                        adipisci eaque neque ab aliquid voluptates omnis rem sapiente architecto
                        iure.
                    </p>
                </div>
            </div>

            <div className="popup popup02">
                <div className="popup__content">
                    <h2>Camera</h2>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores, rerum,
                        perferendis accusamus quo doloremque cumque atque ipsa error officiis
                        adipisci eaque neque ab aliquid voluptates omnis rem sapiente architecto
                        iure.
                    </p>
                </div>
            </div>

            <div className="popup popup03">
                <div className="popup__content">
                    <h2>Camera</h2>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores, rerum,
                        perferendis accusamus quo doloremque cumque atque ipsa error officiis
                        adipisci eaque neque ab aliquid voluptates omnis rem sapiente architecto
                        iure.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default App;
