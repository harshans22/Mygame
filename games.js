
const startBtn= document.getElementById('start');
let screen = document.getElementById('screen');;

startBtn.addEventListener('click',e=>{
    startBtn.style.display='none';
    screen.style.display='block';
    start()
})

//board
let tilesize = 32;
let rows = 16;
let columns = 16;

let screenWidth = tilesize * columns;
let screenHeight = tilesize * rows;
let context;
//ship
let shipWidth = tilesize * 2;
let shipHeight = tilesize;
let shipX = tilesize * columns / 2 - tilesize;
let shipY = tilesize * rows - tilesize * 2;

let ship = {
    x: shipX,
    y: shipY,
    width: shipWidth,
    height: shipHeight
}
let spaceimg;
let shipvelocityx = tilesize;// ship moving speed
//aleins 
let alienarray = [];
let alienwidth = tilesize * 2;
let alienheight = tilesize * 2;
let alienX = tilesize;
let alienY = tilesize;
let alienimg;
let alienrows = 2;
let aliencolums = 3;
let aliencount = 0;//number of aliens defeated
let alienvelocityX = 1;///alien speed
//bullets
let bulletarray = [];
let bulletvelocityY = -10;// bullets speed
let score=0;
let gameover=false;

function start() {
        screen.width = screenWidth;
        screen.height = screenHeight;
        context = screen.getContext('2d');
        //draw initial ship
        //load images
        shipimg = new Image();
        shipimg.src = 'clipart1683659.png';
        shipimg.onload = function () {
            context.drawImage(shipimg, ship.x, ship.y, ship.width, ship.height)
        }
        alienimg = new Image();
        alienimg.src = 'aliien.png';
        CreateAliens();
        requestAnimationFrame(update);
        document.addEventListener("keydown", moveship);
        document.addEventListener("keyup", fire);
    }
function update() {
    requestAnimationFrame(update);
    if(gameover){
        return;
    }
    context.clearRect(0, 0, screen.width, screen.height);
    context.drawImage(shipimg, ship.x, ship.y, ship.width, ship.height);//  drawing ship over over again
    //drawing aliens
    for (let i = 0; i < alienarray.length; i++) {
        let alien = alienarray[i];
        if (alien.alive) {
            alien.x += alienvelocityX
            // if alien touches the border
            if (alien.x + alien.width >= screen.width || alien.x <= 0) {
                alienvelocityX *= -1;
                alien.x+=alienvelocityX*2;
                // move all aliens up by one row when touches the border
                for (let j = 0; j < alienarray.length; j++) {
                    alienarray[j].y += alienheight;
                }
            }
            context.drawImage(alienimg, alien.x, alien.y, alien.width, alien.height);
            if(alien.y>=ship.y){
                gameover=true;
            }
        }
    }
    //bullets
    for (let i = 0; i < bulletarray.length; i++) {
        let bullet = bulletarray[i];
        bullet.y += bulletvelocityY;
        context.fillStyle = 'white';
        context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        //bullet collosion for aliens
        for(j=0;j<alienarray.length;j++){
            let alien=alienarray[j];
            if(!bullet.used && alien.alive &&collosion(bullet,alien)){
                bullet.used=true;
                alien.alive=false;
                aliencount--;
                score+=10;
            }
        }
    }
    //clear bullets
    while (bulletarray.length > 0 && (bulletarray[0].used || bulletarray[0].y < 0)) {
        bulletarray.shift();//remove the first element of array
    }
    // next level
    if(aliencount==0){
        //increase the number of aliens in columns and rows by 1
        aliencolums=Math.min(aliencolums+1,columns/2-2);
        alienrows=Math.min(alienrows+1,rows-4);
        alienvelocityX+=0.3;
        alienarray=[];
        bulletarray=[];
        CreateAliens();
    }
    //score
    context.fillStyle='white';
    context.font=" bold 16px courier"
    context.fillText(score,5,20);
}
function moveship(e) {
    if(gameover){
        return;
    }
    if (e.code == "ArrowLeft" && ship.x - shipvelocityx >= 0) {
        ship.x -= shipvelocityx;// move left one tile
    }
    else if (e.code == "ArrowRight" && ship.x + shipvelocityx + ship.width <= screen.width) {
        ship.x += shipvelocityx;// move right one tile
    }
}
function CreateAliens() {
    for (let i = 0; i < aliencolums; i++) {
        for (let j = 0; j < alienrows; j++) {
            let alien = {
                img: alienimg,
                x: alienX + i * alienwidth,
                y: alienY + j * alienheight,
                width: alienwidth,
                height: alienheight,
                alive: true
            }
            alienarray.push(alien);
        }
    }
    aliencount = alienarray.length;
}
function fire(e) {
    if(gameover){
        return;
    }
    if (e.code == "Space") {
        //shoot
        let bullet = {
            x: ship.x + shipWidth * 15 / 32,
            y: ship.y,
            width: tilesize / 8,
            height: tilesize / 2,
            used: false
        }
        bulletarray.push(bullet);
    }
}
function collosion(a,b) {
    return a.x < b.x + b.width && //a's top left corner dosen't reach b's top  right corner
        a.x + a.width > b.x &&//a's top left corner passes b's top right corner
        a.y < b.y + b.height &&//a's top left corner dosen't reach b's bottom left corner
        a.y + a.height > b.y;// a's bottom left corner passes b's top left corner

}