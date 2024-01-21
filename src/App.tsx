import { useEffect, useRef, useState } from "react";
import "./App.css";
import { gsap } from "@/gsap/all";
import { ScrollTrigger } from "@/gsap/ScrollTrigger";
import { DrawSVGPlugin } from "@/gsap/DrawSVGPlugin";
import { MotionPathPlugin } from "@/gsap/MotionPathPlugin";
import { GSDevTools } from "@/gsap/GSDevTools";
import { ScrollSmoother } from "@/gsap/ScrollSmoother";

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, MotionPathPlugin, GSDevTools, ScrollSmoother);

ScrollSmoother.create({
    smooth: 1.35,
});

function App() {
    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const ctx = gsap.context(() => {
            //learn how this was made at https://www.youtube.com/watch?v=ersN5fk8py0

            gsap.defaults({ ease: "power0" });

            const config = {
                scale: 2.0,
                showTime1: 0.05,
                showTimeText1: 0.25,
                showTime2: 0.96,
                showTimeText2: 1.06,
                showTime3: 2.52,
                showTimeText3: 2.52,
            };
            const isMobile = window.innerWidth < 768;
            if (isMobile) {
                config.showTime3 = 1.72;
                config.showTimeText3 = 1.72;
            }

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
                        fill: "url(#image-1)",
                        scale: config.scale,
                    },
                    config.showTime1
                )
                .fromTo(
                    ".text01",
                    {
                        opacity: 0,
                        y: 50,
                    },
                    {
                        opacity: 1,
                        y: 0,
                    },
                    config.showTimeText1
                )
                .to(
                    ".item02",
                    {
                        fill: "url(#image-1)",
                        scale: config.scale,
                    },
                    config.showTime2
                )
                .fromTo(
                    ".text02",
                    {
                        opacity: 0,
                        y: 50,
                    },
                    {
                        opacity: 1,
                        y: 0,
                    },
                    config.showTimeText2
                )
                .to(
                    ".item03",
                    {
                        fill: "url(#image-1)",
                        scale: config.scale,
                    },
                    config.showTime3
                )
                .fromTo(
                    ".text03",
                    {
                        opacity: 0,
                        y: 50,
                    },
                    {
                        opacity: 1,
                        y: 0,
                    },
                    config.showTimeText3
                );

            gsap.timeline({
                scrollTrigger: {
                    trigger: "#svg",
                    scrub: true,
                    start: "top 20%",
                    end: "bottom center",
                    toggleActions: "play none none none",
                },
            })
                .to(".ball01", { autoAlpha: 1, duration: 0.05 })
                .from(".theLine", { drawSVG: "0", duration: 4 }, 0)
                .to(
                    ".ball01",
                    {
                        motionPath: {
                            path: ".theLine",
                            align: ".theLine",
                            alignOrigin: [0.5, 0.5],
                        },
                        duration: 4,
                    },
                    0
                )
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

    useEffect(() => {
        const circleElements = document.querySelectorAll(".item");

        // check position of element and set popup position
        const checkPosition = (elem: SVGCircleElement | null, popupElem: HTMLElement | null) => {
            if (elem && popupElem) {
                // get rect of svr circle element and set popup position with the scale of svg
                const rect = elem.getBoundingClientRect();
                const popupRect = popupElem.getBoundingClientRect();
                const svg = document.querySelector("#svg");
                if (!svg) return;
                const svgRect = svg.getBoundingClientRect();
                const scale = svgRect.width / 600;
                const popupWidth = popupRect.width;
                const popupHeight = popupRect.height;

                // set popup position
                const popupX = rect.x + rect.width / 2 - popupWidth / scale;
                console.log(rect.y);
                const popupY = rect.y - popupHeight - popupHeight * 0.5 * scale;
                console.log(popupX, popupY);

                // set popup position
                popupElem.style.top = `${popupY}px`;

                // if popup be out of svg, set popup position to left, or right
                if (popupX < 0) {
                    popupElem.style.left = `${0}px`;
                } else if (popupX + popupWidth > svgRect.width) {
                    popupElem.style.left = `${svgRect.width - popupWidth}px`;
                } else {
                    popupElem.style.left = `${popupX}px`;
                }
            }
        };

        circleElements.forEach(circleElem => {
            const circle = circleElem as SVGCircleElement;
            const id = circle.id;
            const popupElem = document.querySelector(`.popup${id}`) as HTMLElement;
            if (!circle || !popupElem) return;
            checkPosition(circle, popupElem);
        });
    }, []);

    return (
        <>
            <div className="offset">
                <div className="fancy-text">Scroll Down</div>
            </div>

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
                            <image
                                x="0%"
                                y="0%"
                                width="512"
                                height="512"
                                xlinkHref="/ct.png"></image>
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

                    <circle className="ball ball01" r="10" cx="50" cy="100"></circle>
                    <circle
                        stroke="url(#Gradient1)"
                        id="01"
                        className="item item01"
                        strokeWidth="1"
                        r="20"
                        cx="450"
                        cy="250"></circle>
                    <circle
                        stroke="url(#Gradient1)"
                        id="02"
                        className="item item02"
                        strokeWidth="1"
                        r="20"
                        cx="65"
                        cy="641"></circle>
                    <circle
                        stroke="url(#Gradient1)"
                        strokeWidth="1"
                        id="03"
                        className="item item03"
                        r="20"
                        cx="550"
                        cy="981"></circle>

                    {/* add text and connect with items */}
                    <text
                        className="text text01"
                        x="100"
                        y="250"
                        font-family="Calibri"
                        font-size="20"
                        fill="white">
                        Lorem ipsum dolor
                    </text>

                    <text
                        className="text text02"
                        x="165"
                        y="641"
                        textAnchor="right"
                        width="200"
                        dominantBaseline="middle">
                        Lorem ipsum dolor
                    </text>

                    <text
                        className="text text03"
                        x="350"
                        y="981"
                        textAnchor="middle"
                        dominantBaseline="middle">
                        Lorem ipsum dolor
                    </text>
                </svg>
            </div>
        </>
    );
}

export default App;
