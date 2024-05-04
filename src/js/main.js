//! import Modules !//
import { CountDownTimer } from "./countDownTimer.js";
//! import Modules !//

window.onload = () =>{
    const timer = new CountDownTimer(10,'var(--clr-neutral-700)', 'var(--vivid-blue)', 'var(--neon-red)', 'var(--clr-neutral-500)', 'var(--dark-blue-gray)', 'var(--clr-neutral-600)', 'timer-area', [0,0,10], [0,0,5]);
    const timer2 = new CountDownTimer(20,'var(--clr-neutral-700)', 'var(--vivid-blue)', 'var(--neon-red)', 'var(--clr-neutral-500)', 'var(--dark-blue-gray)', 'var(--clr-neutral-600)', 'content', [0,0,15], [0,0,8]);
};