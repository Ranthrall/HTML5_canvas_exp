//SpaceShip5 - A HTML5 Space Ship Simulator - To infinity and beyond!
//    Copyright (C) 2014  BlackICE (Fernando Manfredi) <blackice@craft.net.br>
//
//    SpaceShip5 is free software: you can redistribute it and/or modify
//    it under the terms of the GNU General Public License as published by
//    the Free Software Foundation, either version 3 of the License, or
//    (at your option) any later version.
//
//    SpaceShip5 is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU General Public License for more details.
//
//    You should have received a copy of the GNU General Public License
//    along with this program.  If not, see <http://www.gnu.org/licenses/>.
//

window.requestAnimFrame = (function(){
    return window.requestAnimationFrame|| 
    window.webkitRequestAnimationFrame || 
    window.mozRequestAnimationFrame    || 
    window.oRequestAnimationFrame      || 
    window.msRequestAnimationFrame     ||  
    function( callback ){
        return window.setTimeout(callback, 1000 / 120);
    };
})();

window.cancelRequestAnimFrame = ( function() {
    return window.cancelAnimationFrame          ||
    window.webkitCancelRequestAnimationFrame    ||
    window.mozCancelRequestAnimationFrame       ||
    window.oCancelRequestAnimationFrame         ||
    window.msCancelRequestAnimationFrame        ||
    clearTimeout
} )();

var starfield = document.getElementById('cockpit'),
    fire = document.getElementById("shoot"),
    ctx = starfield.getContext('2d'),
    flag = true,
    test = true,
    autopilot = false,
    warp = false,
    cannon,
    n = 128,
    w = 0,
    h = 0,
    x = 0,
    y = 0,
    z = 0,
    star_color_ratio = 0,
    star_x_save,
    star_y_save,
    star_ratio = 256,
    star_speed = 25,
    star_speed_save = 0,
    star = new Array(n),
    cursor_x = 0,
    cursor_y = 0,
    mouse_x = 0,
    mouse_y = 0,
    key,
    cockpit = new Image();

var enemyTotal = 10,
    enemies = [],
    enemy_x = 50,
    enemy_y = -45,
    enemy_w = 50,
    enemy_h = 50,
    enemy_speed = 3;

function init() {
    var a = 0;
    for(var i = 0;i<n;i++) {
        star[i] = new Array(5);
        star[i][0] = Math.random()*w*2-x*2;
        star[i][1] = Math.random()*h*2-y*2;
        star[i][2] = Math.round(Math.random()*z);
        star[i][3] = 0;
        star[i][4] = 0;
    }
    starfield.width = w;
    starfield.height = h;
	ctx.lineCap='round';
    ctx.strokeStyle = 'rgb(255,255,255)';
}

function anim() {
    mouse_x = cursor_x-x;
    mouse_y = cursor_y-y;
        if(warp) {
            ctx.fillStyle = 'rgba(0,0,0,0.07)';
        }
        else {
            ctx.fillStyle = 'rgb(0,0,0)';
        }
    ctx.fillRect(0,0,w,h);
	for(var i=0;i<n;i++) {
		test=true;
		star_x_save=star[i][3];
		star_y_save=star[i][4];
		star[i][0]-=mouse_x>>4; 
        if(star[i][0]>x<<1) { 
            star[i][0]-=w<<1; test=false; 
        } 
        if(star[i][0]<-x<<1) { 
            star[i][0]+=w<<1; test=false; 
        }
		star[i][1]-=mouse_y>>4; 
        if(star[i][1]>y<<1) { 
            star[i][1]-=h<<1; test=false; 
        } 
        if(star[i][1]<-y<<1) { 
            star[i][1]+=h<<1; test=false; 
        }
		star[i][2]-=star_speed; 
        if(star[i][2]>z) { 
            star[i][2]-=z; test=false; 
        } 
        if(star[i][2]<0) { 
            star[i][2]+=z; test=false; 
        }
		star[i][3]=x+(star[i][0]/star[i][2])*star_ratio;
		star[i][4]=y+(star[i][1]/star[i][2])*star_ratio;
		if(star_x_save>0&&star_x_save<w&&star_y_save>0&&star_y_save<h&&test) {
			ctx.lineWidth=(1-star_color_ratio*star[i][2])*2;
			ctx.beginPath();
			ctx.moveTo(star_x_save,star_y_save);
			ctx.lineTo(star[i][3],star[i][4]);
			ctx.stroke();
			ctx.closePath();
		}
    }
drawEnemy();
moveEnemy();
drawHud();
if(flag) requestAnimFrame(anim);
}

function initEnemy() {
    for (var i = 0; i < enemyTotal; i++) {
        enemies.push([enemy_x, enemy_y, enemy_w, enemy_h, enemy_speed]);
        enemy_x += enemy_w + 60;
    }
}


function drawEnemy() {
    for (var i = 0; i < enemies.length; i++) {
        ctx.fillStyle = 'rgb(0,255,0)';
        ctx.fillRect(enemies[i][0], enemies[i][1], enemy_w, enemy_h);
        ctx.fillStyle = 'rgb(0,0,0)';
    }
}

function moveEnemy() {
  for (var i = 0; i < enemies.length; i++) {
    if (enemies[i][1] < h) {
      enemies[i][1] += enemies[i][4];
    } else if (enemies[i][1] > h - 1) {
      enemies[i][1] = -45;
    }
  }
}

function move(evt) {
    if(!autopilot) {
        evt = evt||event;
        cursor_x = evt.pageX;
        cursor_y = evt.pageY;
    }
}

function key_manager(evt) {
    evt = evt||event;
    key = evt.which||evt.keyCode;
    switch(key) {
        case 112: // "P" - Pause
            flag = flag?false:true;
            if(flag) requestAnimFrame(anim);
            break;
        case 115: // "S" - Stop travelling
            autopilot = true;
            warp = false;
            cursor_x = w/2-5;
            cursor_y = h/2;
            star_speed_save = (star_speed != 0)?star_speed:star_speed_save;
            star_speed = (star_speed != 0)?0:star_speed_save;
            break;
        case 119: // "W" - Enable/Disable warp drive
            warp = warp?false:true;
            break;
        case 97: // "A" - Disable mouse control/Autopilot
            autopilot = autopilot?false:true;
            break; 
    }
    top.status = 'key = '+((key<100)?'0':'')+((key<10)?'0':'')+key;
}

function drawHud() {
    ctx.drawImage(cockpit,0,0,w,h);
    ctx.save();
    ctx.fillStyle = 'rgb(0,0,255)';
    ctx.font = 'bold 18px "Share Tech Mono"';
    ctx.textAlign = 'left';
    ctx.fillText('SPEED: ' + speed() + 'pc', w/3.25, h/1.52);
    ctx.fillText('WARP:  ' + toggle(warp), w/3.25, h/1.47);
    ctx.fillText('AUTO:  ' + toggle(autopilot), w/3.25, h/1.42);
    ctx.fillText('DIR :  ' + mouse_x + ',' + mouse_y, w/3.25, h/1.37);
    ctx.restore();
}

function speed() { 
    if(warp) return star_speed*100; 
    else return star_speed; 
}

function toggle(bool) {
    if(bool) return 'ON';
    else return 'OFF';
}

function mouse_wheel(evt) {
    if (flag) {
        evt = evt||event;
        var delta = 0;
        if(evt.wheelDelta) delta = evt.wheelDelta/120;
        else if(evt.detail) delta = -evt.detail/3;
        star_speed += (delta >= 0)?1:-1;
        if(evt.preventDefault) evt.preventDefault();
    }
}

function shoot() {
    if(flag) {
	    fire.currentTime = 0;
	    fire.play();
        requestAnimFrame(laser);
    }
}

function laser() {
    ctx.save();
    ctx.beginPath();
    if (cannon == 'left') {
        window.cannon = 'right';
        ctx.moveTo(0, h/1.4);
        ctx.lineTo(0, h/1.5);
        ctx.lineTo(cursor_x-15, cursor_y);
    }
    else {
        window.cannon = 'left';
        ctx.moveTo(w, h/1.4);
        ctx.lineTo(w, h/1.5);
        ctx.lineTo(cursor_x+15, cursor_y);
    }
    ctx.fillStyle = 'rgb(255,0,0)';
    ctx.fill();
    drawHud();
    ctx.restore();
}

function start() {
    resize();
    anim();
    initEnemy();
}

function resize() {
    w = window.innerWidth; 
    h = window.innerHeight; 
    x = Math.round(w/2);
    y = Math.round(h/2);
    z = (w+h)/2;
    star_color_ratio = 1/z;
    cursor_x = x;
    cursor_y = y;
    init();
}

// $('#popup').modal('show');

cockpit.src = 'gallery/cockpit.png';
cockpit.onload = function () {
    start();
}

starfield.onmousemove = move;
document.onkeypress = key_manager;
starfield.onmousewheel = mouse_wheel; 
starfield.addEventListener('DOMMouseScroll',mouse_wheel,false);
starfield.addEventListener('mousedown',shoot,true);
