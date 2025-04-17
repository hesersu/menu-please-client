    import React from 'react'
    import { useState } from 'react';
    import { AnimatedHeader } from '@/components/animatedHeader';
    import ChrisProfileImg from '../assets/ChrisProfileImg.jpg';
    import KristsProfileImg from '../assets/KristsProfileImg.png';


    export const AboutUsPage = () => {
        const [flippedCardOne, setFlippedCardOne] = useState(false);
        const [flippedCardTwo, setFlippedCardTwo] = useState(false);


    return (
        <div className="min-h-screen flex flex-col items-center justify-start bg-background px-4 py-8 gap-5">

        <AnimatedHeader title="About Us"/>

        {/* Card 1 */}
        <div
        className={`flip-card w-[245px] h-[270px] cursor-pointer ${flippedCardOne ? 'flipped' : ''}`}
        onClick={() => setFlippedCardOne(!flippedCardOne)}
        >
        <div className="flip-card-inner relative w-full h-full text-center">

        {/* Front */}
        <div className="flip-card-front bg-[var(--card)] border-[4px] border-[var(--primary)] p-2 flex flex-col items-center justify-center">
            <div className="w-[120px] h-[120px] rounded-full overflow-hidden mb-3">
            <img src={KristsProfileImg} alt="Profile" className="w-full h-full object-cover" />
            <svg className="w-full h-full fill-[var(--primary)]" viewBox="0 0 122.88 122.88" xmlns="http://www.w3.org/2000/svg">
                <g>
                <path d="M61.44,0c8.32,0,16.25,1.66,23.5,4.66l0.11,0.05c7.47,3.11,14.2,7.66,19.83,13.3l0,0
                c5.66,5.65,10.22,12.42,13.34,19.95c3.01,7.24,4.66,15.18,4.66,23.49c0,8.32-1.66,16.25-4.66,23.5l-0.05,0.11
                c-3.12,7.47-7.66,14.2-13.3,19.83l0,0c-5.65,5.66-12.42,10.22-19.95,13.34c-7.24,3.01-15.18,4.66-23.49,4.66
                c-8.31,0-16.25-1.66-23.5-4.66l-0.11-0.05c-7.47-3.11-14.2-7.66-19.83-13.29L18,104.87C12.34,99.21,7.78,92.45,4.66,84.94
                C1.66,77.69,0,69.76,0,61.44s1.66-16.25,4.66-23.5l0.05-0.11c3.11-7.47,7.66-14.2,13.29-19.83L18.01,18
                c5.66-5.66,12.42-10.22,19.94-13.34C45.19,1.66,53.12,0,61.44,0L61.44,0z" />
                </g>
            </svg>
            </div>
            <div className="text-[27px] text-[var(--primary)] font-bold">Krists</div>
        </div>

        {/* Back */}
        <div className="flip-card-back bg-[var(--card)] border-[4px] border-[var(--primary)] p-4 flex flex-col justify-center">
            <p className="text-sm text-[var(--foreground)] tracking-wide">
            Hello, I am a software engineer with over 5 years of experience in web development. I specialize in building scalable, high-performance web applications using modern web technologies such as React, Angular, and Node.js.
            </p>
            <div className="flex justify-center items-center gap-5 mt-4 text-[var(--primary)]">
            {/* Social Icons */}
            {['github', 'instagram', 'facebook', 'twitter'].map((icon, i) => (
                <a key={i} href="#" className="hover:text-[var(--foreground)] transition duration-300">
                <i className={`bi bi-${icon} w-5 h-5`}></i>
                </a>
            ))}
            </div>
        </div>
        </div>
    </div>



        {/* Card 2 */}

    <div
        className={`flip-card w-[245px] h-[270px] cursor-pointer ${flippedCardTwo ? 'flipped' : ''}`}
        onClick={() => setFlippedCardTwo(!flippedCardTwo)}
    >
        <div className="flip-card-inner relative w-full h-full text-center">

        {/* Front */}
        <div className="flip-card-front bg-[var(--card)] border-[4px] border-[var(--primary)] p-2 flex flex-col items-center justify-center">
            <div className="w-[120px] h-[120px] rounded-full overflow-hidden mb-3">
            <img src={ChrisProfileImg} alt="Profile" className="w-full h-full object-cover" />
            <svg className="w-full h-full fill-[var(--primary)]" viewBox="0 0 122.88 122.88" xmlns="http://www.w3.org/2000/svg">
                <g>
                <path d="M61.44,0c8.32,0,16.25,1.66,23.5,4.66l0.11,0.05c7.47,3.11,14.2,7.66,19.83,13.3l0,0
                c5.66,5.65,10.22,12.42,13.34,19.95c3.01,7.24,4.66,15.18,4.66,23.49c0,8.32-1.66,16.25-4.66,23.5l-0.05,0.11
                c-3.12,7.47-7.66,14.2-13.3,19.83l0,0c-5.65,5.66-12.42,10.22-19.95,13.34c-7.24,3.01-15.18,4.66-23.49,4.66
                c-8.31,0-16.25-1.66-23.5-4.66l-0.11-0.05c-7.47-3.11-14.2-7.66-19.83-13.29L18,104.87C12.34,99.21,7.78,92.45,4.66,84.94
                C1.66,77.69,0,69.76,0,61.44s1.66-16.25,4.66-23.5l0.05-0.11c3.11-7.47,7.66-14.2,13.29-19.83L18.01,18
                c5.66-5.66,12.42-10.22,19.94-13.34C45.19,1.66,53.12,0,61.44,0L61.44,0z" />
                </g>
            </svg>
            </div>
            <div className="text-[27px] text-[var(--primary)] font-bold">Chris</div>
        </div>

        {/* Back */}
        <div className="flip-card-back bg-[var(--card)] border-[4px] border-[var(--primary)] p-4 flex flex-col justify-center">
            <p className="text-sm text-[var(--foreground)] tracking-wide">
            Software engineer with 5 weeks of experience, passionate about JavaScript but not a fan of CSS. Based in Berlin, but exploring the world one destination at a time. Motto: 'Try hard or die trying.
                </p>
            <div className="flex justify-center items-center gap-5 mt-4 text-[var(--primary)]">
            {/* Social Icons */}
            {['github', 'instagram', 'facebook', 'twitter'].map((icon, i) => (
                <a key={i} href="#" className="hover:text-[var(--foreground)] transition duration-300">
                <i className={`bi bi-${icon} w-5 h-5`}></i>
                </a>
            ))}
            </div>
        </div>
        </div>
    </div>

    </div>
    );
    }
