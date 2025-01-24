"use client";
import { useState, useEffect, uclseRef } from "react";
import Image from 'next/image';
export default function Inaugration() {
    function slide() {
        (document.getElementsByClassName("curtainContainer")[0] as HTMLElement).style.transform =
            "translatex(-150vw)";
        (document.getElementsByClassName("curtainContainer")[1] as HTMLElement).style.transform =
            "translatex(150vw)";
    }
    useEffect(() => {
        setTimeout(slide, 9000);
        const handleScroll = () => {
            if (window.scrollY > 0) {
                window.location.href = "/";
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);
    return (
        <>
        {/* <iframe src="inaugration.mp3" allow="autoplay" style={{display:"none"}} id="iframeAudio">
        </iframe> */}
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800">
            <div className="content">
                <Image src="/page_layout.png" alt="Shrirama Temple" layout="fill" objectFit="cover"/>
            </div>
            <div className="curtainBody">
                <div id="leftCurtain" className="curtainContainer">
                    <div className="unCurtain"></div>
                    <div className="unCurtain"></div>
                    <div className="unCurtain"></div>
                    <div className="unCurtain"></div>
                    <div className="unCurtain"></div>
                    <div className="unCurtain"></div>
                    <div className="unCurtain"></div>
                    <div className="unCurtain"></div>
                    <div className="unCurtain"></div>
                    <div className="unCurtain"></div>
                    <div className="unCurtain"></div>
                    <div className="unCurtain"></div>
                </div>
                <div id="rightCurtain" className="curtainContainer">
                    <div className="unCurtain"></div>
                    <div className="unCurtain"></div>
                    <div className="unCurtain"></div>
                    <div className="unCurtain"></div>
                    <div className="unCurtain"></div>
                    <div className="unCurtain"></div>
                    <div className="unCurtain"></div>
                    <div className="unCurtain"></div>
                    <div className="unCurtain"></div>
                    <div className="unCurtain"></div>
                    <div className="unCurtain"></div>
                    <div className="unCurtain"></div>
                </div>
                <div className="overlay"></div>
            </div>
        </div>
        </>
    );
}