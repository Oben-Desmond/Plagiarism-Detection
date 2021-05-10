import { AnimationKeyFrames } from "@ionic/core";
import { PropertyValue } from "@ionic/react/dist/types/components/CreateAnimation";

 

export const searchArrowSeeker
:  AnimationKeyFrames =[
    { offset:0, transform:`translateY(${func(0)}px)`, } ,
    { offset:0.1, transform:`translateY(${func(0.1)}px)`, } ,
    { offset:0.2, transform:`translateY(${func(0.2)}px)`, } ,
    { offset:0.3, transform:`translateY(${func(0.3)}px)`, } ,
    { offset:0.4, transform:`translateY(${func(0.4)}px)`, } ,
    { offset:0.5, transform:`translateY(${func(0.5)}px)`, } ,
    { offset:0.6, transform:`translateY(${func(0.6)}px)`, } ,
    { offset:0.7, transform:`translateY(${func(0.7)}px)`, } ,
    { offset:0.8, transform:`translateY(${func(0.8)}px)`, } ,
    { offset:0.9, transform:`translateY(${func(0.9)}px)`, } ,
    { offset:1, transform:`translateY(${func(1)}px)`, } ,
]
export const BounceStar
:  AnimationKeyFrames =[
    { offset:0, transform:`scale(0) translateY(-400px) translateX(0) rotate(20deg)`, } ,
    { offset:0.1, transform:`scale(0.9) translateY(-200px) translateX(10px) rotate(40deg)`, } ,
    { offset:0.2, transform:`scale(0.9) translateY(-100px) translateX(20px) rotate(80deg)`, } ,
    { offset:0.3, transform:`scale(1) translateY(-10px) translateX(30px) rotate(100deg)`, } ,
    { offset:0.4, transform:`scale(3) translateY(0px) translateX(40px) rotate(120deg)`, } ,
    { offset:0.5, transform:`scale(3) translateY(0) translateX(40px) rotate(250deg)`, } ,
    { offset:0.6, transform:`scale(2.5) translateY(0) translateX(40px) rotate(280deg)`, } ,
    { offset:0.7, transform:`scale(2) translateY(-10px) translateX(50px) rotate(300deg)`, } ,
    { offset:0.8, transform:`scale(0.8) translateY(-100px) translateX(50px) rotate(360deg)`, } ,
    { offset:0.9, transform:`scale(0.7) translateY(-300px) translateX(50px) rotate(3900deg)`, } ,
    { offset:1, transform:`scale(0) translateY(-400px) translateX(50px) rotate(400deg)`, } ,
]
function func(val:number){
    
    return (15*Math.cos(val*360*Math.PI/180)+10)
}

export const fallKeyFrame: AnimationKeyFrames = [
    { offset: 0, transform: `translateY(${computeDisplacement(0.1)}px) translateX(400vw)` ,opacity:0},
    { offset: 0.1, transform: `translateY(${computeDisplacement(0.1)}px) translateX(40vw)` ,opacity:0.3},
    { offset: 0.2, transform: `translateY(${computeDisplacement(0.2)}px) translateX(40vw) `,opacity:0.8 },
    { offset: 0.5, transform: `translateY(${computeDisplacement(0.5)}px) translateX(40vw) `,opacity:9.9 },
    { offset: 0.6, transform: `translateY(${computeDisplacement(0.6)}px) translateX(40vw)` ,opacity:0.6},
    { offset: 0.8, transform: `translateY(${computeDisplacement(0.8)}px) translateX(40vw)` ,opacity:0.4},
    { offset: 0.9, transform: `translateY(${computeDisplacement(0.9)}px) translateX(40vw)` ,opacity:0.2},
    { offset: 1, transform: `translateY(${computeDisplacement(1)}px) translateX(40vw)` ,opacity:0},
]

function computeDisplacement(val: number) {
    const t = 10 * val, a = 9.8, u = 0;
    // return 80
    return -u * t + 0.5 * a * t * t
}



