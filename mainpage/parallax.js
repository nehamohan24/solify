let text=document.getElementById('text');
let backhill=document.getElementById('backhill');
let fronthill=document.getElementById('fronthill');
let rock=document.getElementById('rock');
let trees=document.getElementById('trees');
let sun=document.getElementById('sun');
let bird=document.getElementById('bird');
let water=document.getElementById('water');
window.addEventListener('scroll',function(){
    let value=window.scrollY;
    sun.style.marginTop = value * 1 +'px';
    water.style.marginTop = value * 0.25 +'px';
    text.style.marginTop = value * 0.5 +'px';
    rock.style.left = value * 0.5 +'px';
    backhill.style.top = value * 0.5 +'px';
    fronthill.style.top = value * 0.25 +'px';
    trees.style.marginBottom= value * 0.25 +'px';
    bird.style.left= value * 5 +'px';
});
