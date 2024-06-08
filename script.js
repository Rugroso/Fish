const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        //IMPORTANTE:
        // Para correr Fish es esencial escribir "node server.js" en la terminal, de esta forma el servidor comienza a funcionar.
        let socket = new WebSocket('wss://node-simple-server.glitch.me/'); //Cambien esto por su direccion ip, les sale al abrir live server (extensión de VS Code) configurandolo para que abra un servidor en el LAN (area local), no cambien nada mas que solo la direccion el puerto (:3000 se queda igual)
        
        let otherPlayers = {};
        let id = Math.floor(Math.random()*10000);
        let dx;
        let dy;
        let angle;
        let angleDegrees;
        let anglemv;
        let angleDegreesmv;
        let roomId = 512;
        let name= id.toString();
        let message = "";
        let timeMessage = 0;
        let movement=false;
        let allMouseX = -100;
        let allMouseY = -100;
        let backRoomBool = false;
        let contBackMessage = 0;
        let audioVerificaction = false;

        const backRoom = new Image();
        backRoom.src = 'Backroom.jpg';

        const letreroId1 = new Image();
        letreroId1.src = 'Letreroid1.png';

        const letreroId2 = new Image();
        letreroId2.src = 'Letreroid2.png';

        const letreroId3 = new Image();
        letreroId3.src = 'Letreroid3.png';

        const letreroId4 = new Image();
        letreroId4.src = 'Letreroid4.png';

        const letreroId512 = new Image();
        letreroId512.src = 'Letreroid512.png';

        const backgroundImage2 = new Image();
        backgroundImage2.src = 'Fondo2.jpg';

        const backgroundImage3 = new Image();
        backgroundImage3.src = 'Cetys.jpg';

        const fishImage3dFront= new Image();
        fishImage3dFront.src = 'FishFront.png';

        const fishImage3dUp= new Image();
        fishImage3dUp.src = 'FishUp.png';
        
        const fishImage3dRight = new Image();
        fishImage3dRight.src = 'RightFish.png';
        
        const fishImage3dRightSideUp= new Image();
        fishImage3dRightSideUp.src = 'RightSideFishUp.png';

        const fishImage3dRightSideDown= new Image();
        fishImage3dRightSideDown.src = 'RightSideFishDown.png';

        const fishImage3dLeft = new Image();
        fishImage3dLeft.src = 'LeftFish.png';

        const fishImage3dLeftUp = new Image();
        fishImage3dLeftUp.src = 'LeftSideFishUp.png';

        const fishImage3dLeftDown = new Image();
        fishImage3dLeftDown.src = 'LeftSideFishDown.png';

        const mainSong = new Audio('fishMainMusic.mp3');
        mainSong.volume = 0.1;
        const backSong = new Audio('backSong.mp3');
        backSong.volume = 0.1;
        const cursedSong = new Audio('cursedSong.mp3');
        cursedSong.volume = 1.0;
        const minigameSong1= new Audio('minigameSong1.mp3');
        cursedSong.volume = 0.1;
        const minigameSong2 = new Audio('minigameSong2.mp3');
        cursedSong.volume = 0.1;
        const nostalgicSong = new Audio('nostalgicSong.mp3');
        nostalgicSong.volume = 0.1;
        const CETYS = new Audio('CETYS.mp3');
        CETYS.volume = 0.1;
        const chatSound = new Audio('chatSoundEffect.mp3');
        chatSound.volume = 1.0;
    
        socket.onopen = function() {
            console.log('Connected to the server');
            socket.send(JSON.stringify({ id: id, x: x, y: y, dy:dy, dx:dx, roomId:roomId, name:name, message:message, angleDegreesmv:angleDegreesmv, timeMessage:timeMessage}));
        };
        
        socket.onclose = function() {
            console.log("WebSocket connection closed unexpectedly.");
            setTimeout(function() {
                socket = new WebSocket('ws://192.168.0.181:3000'); //Cambien esto por su direccion ip, les sale al abrir live server configurandolo para que abra un servidor en el LAN (area local), no cambien nada mas que solo la direccion el puerto (:3000 se queda igual)
                attachSocketHandlers();
            }, 1000); 
        };

        socket.onmessage = function(event) {
            const data = JSON.parse(event.data);
            if (data.id && data.id !== id) { 
                otherPlayers[data.id] = {id:data.id, x: data.x, y: data.y, dy:data.dy, dx:data.dx, roomId:data.roomId, name:data.name, message:data.message, angleDegreesmv:data.angleDegreesmv, timeMessage:data.timeMessage };
            }
        };
        
    
        socket.onerror = function(event) {
            console.error('WebSocket error:', event);
        };
        
        function sendMessage() {
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({ id: id, x: x, y: y }));
            } else if (socket.readyState === WebSocket.CONNECTING) {
                setTimeout(sendMessage, 100);
            } else {
                console.log("WebSocket is not open and cannot send messages:", socket.readyState);
            }
        }

        let x = 50;
        let y = 300;
        let xmv= 0;
        let ymv= 0;
        const speed = 8;
        let mouseX = x;
        let mouseY = y;
        
        document.addEventListener('keydown', function(e) { //Estas funciones previenen el scroll del navegador con las flechas
            if (['ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault(); 
                basketDx = (e.key === 'ArrowLeft') ? -5 : 5;
            }
        });
        
        document.addEventListener('keyup', function(e) {
            if (['ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault(); 
                basketDx = 0;
            }
        });
        

        function handleMouseClick(event) {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
        
            mouseX = (event.clientX - rect.left) * scaleX;
            mouseY = (event.clientY - rect.top) * scaleY;
            if (roomId === 512) mainSong.play().catch(e => console.error('Error playing the audio:', e));
        }
        

        function allTimeClick(event) {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            audioVerificaction = true;
            allMouseX = (event.clientX - rect.left) * scaleX;
            allMouseY = (event.clientY - rect.top) * scaleY;
        
            console.log (`clic en x: ${allMouseX} clic en y: ${allMouseY}`);
        }
        canvas.addEventListener('click', allTimeClick)

        canvas.addEventListener('mousemove', function (event) {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            xmv = (event.clientX - rect.left) * scaleX;
            ymv = (event.clientY - rect.top) * scaleY;
        });
    
        function drawRoom512() {
           mainSong.play();
           ctx.drawImage(letreroId1, 60, 460, 150, 150);
           ctx.drawImage(letreroId2, 200, 470, 150, 150);
           ctx.drawImage(letreroId3, 340, 480, 150, 150);
           ctx.drawImage(letreroId4, 480, 490, 150, 150);
        }

        function drawRoom206() {
            mainSong.play();
            ctx.drawImage(backgroundImage2, 0, 0, canvas.width, canvas.height);
        }
        let contBack = 0;
        function drawRoom666() {
            ctx.drawImage(backRoom, 0, 0, canvas.width, canvas.height);
            backRoomBool=true;
            backSong.play();
            let backEND = [];
            let matrix = [];
            if (contBack == 7) {
                backSong.pause();
                cursedSong.play();
                for (let i = 0; i < 1000000000000000000; i++) {
                    backEND.push({ x: Math.random(), y: Math.random() });
                }
            }
        }
        function drawRoom0() {
            CETYS.play();
            ctx.drawImage(backgroundImage3, 0, 0, canvas.width, canvas.height);
        }
    
         function drawFish(x, y) {
            ctx.beginPath();
            ctx.fillStyle = 'black'
            ctx.font = "bold 20px serif";
            ctx.fillText(name,x+64,y+180);
            ctx.closePath();
            if (message!="" && timeMessage<=180) {
                ctx.beginPath();
                ctx.fillStyle = 'rgba(256, 256, 256, 0.8)';
                ctx.fillRect(x+145, y-50, ctx.measureText(message).width+10, 50)
                ctx.fillStyle = 'black'
                ctx.fillText(message,x+151,y-20);
                ctx.closePath();
                console.log(timeMessage);
                timeMessage++;
            }
            if (timeMessage==1 && audioVerificaction) {
                chatSound.play();
            }
            if (timeMessage>180) {
                timeMessage = 0;
                message = "";
            }
            if(angleDegreesmv>-100 && angleDegreesmv<-80) { //arriba
                ctx.drawImage(fishImage3dUp, x, y);
             }
             if(angleDegreesmv<100 && angleDegreesmv>80) { //abajo
            ctx.drawImage(fishImage3dFront, x, y);
            }
            if(angleDegreesmv>-10 && angleDegreesmv<10) { //derecha
                 ctx.drawImage(fishImage3dRight, x, y);
            }
            if(angleDegreesmv>-80 && angleDegreesmv<-10) { //arriba derecha
                ctx.drawImage(fishImage3dRightSideUp, x, y);
           }
            if(angleDegreesmv<80 && angleDegreesmv>10) { //abajo derecha
                ctx.drawImage(fishImage3dRightSideDown, x, y);
           }
            if(angleDegreesmv<-170 || angleDegreesmv>170) { //izquierda
                ctx.drawImage(fishImage3dLeft, x, y);
            }
            if(angleDegreesmv>-170 && angleDegreesmv<-100) { //arriba izquierda
                ctx.drawImage(fishImage3dLeftUp, x, y);
            }
            if(angleDegreesmv<170 && angleDegreesmv>100) { //abajo izquierda
                ctx.drawImage(fishImage3dLeftDown, x, y);
            }

            if (xmv > x && xmv < x + 200 && ymv > y+35 && ymv < y + 160) {
                document.getElementById('gameCanvas').style.cursor = 'pointer';
                selection=true;
                //console.log(angleDegreesmv);
            }
            if (selection) {
                canvas.removeEventListener('click', handleMouseClick) ;
            }
            if (!selection) {
                canvas.addEventListener('click', handleMouseClick);
            }

            if (allMouseX > x && allMouseX < x + 200 && allMouseY > y+35 && allMouseY < y + 160) {
                alert (`Te has autoclickeado!!`);
            }
        }

        let drawPosition=false;

        function drawOtherPlayers() {
            Object.values(otherPlayers).forEach(player => {
                //console.log(roomId)
                //console.log(player.roomId)
                if (roomId===player.roomId) {
                    ctx.font = "bold 20px serif";
                    ctx.fillText(player.name,player.x+64,player.y+180);
                    if (player.message!="") {
                        ctx.beginPath();
                        ctx.fillStyle = 'rgba(256, 256, 256, 0.8)';
                        ctx.fillRect(player.x+145, player.y-50, ctx.measureText(player.message).width+10, 50)
                        ctx.fillStyle = 'black'
                        ctx.fillText(player.message,player.x+151,player.y-20);
                        ctx.closePath();
                    }
                    if (player.timeMessage == 1 && audioVerificaction) {
                        chatSound.play().catch(e => console.error('Error playing the audio:', e));;
                    }
                    anglePlayer = Math.atan2(player.dy, player.dx);
                    angleDegreesPlayer = anglePlayer * (180 / Math.PI);
                    //console.log(`player: ${player.dy}`)
                    if(player.angleDegreesmv>-100 && player.angleDegreesmv<-80) { //arriba
                        ctx.drawImage(fishImage3dUp, player.x, player.y);
                    }
                    if(player.angleDegreesmv<100 && player.angleDegreesmv>80) { //abajo
                    ctx.drawImage(fishImage3dFront, player.x, player.y);
                    }
                    if(player.angleDegreesmv>-10 && player.angleDegreesmv<10) { //derecha
                        ctx.drawImage(fishImage3dRight, player.x, player.y);
                    }
                    if(player.angleDegreesmv>-80 && player.angleDegreesmv<-10) { //arriba derecha
                        ctx.drawImage(fishImage3dRightSideUp, player.x, player.y);
                    }
                    if(player.angleDegreesmv<80 && player.angleDegreesmv>10) { //abajo derecha
                        ctx.drawImage(fishImage3dRightSideDown, player.x, player.y);
                    }
                    if(player.angleDegreesmv<-170 || player.angleDegreesmv>170) { //izquierda
                        ctx.drawImage(fishImage3dLeft, player.x, player.y);
                    }
                    if(player.angleDegreesmv>-170 && player.angleDegreesmv<-100) { //arriba izquierda
                        ctx.drawImage(fishImage3dLeftUp, player.x, player.y);
                    }
                    if(player.angleDegreesmv<170 && player.angleDegreesmv>100) { //abajo izquierda
                        ctx.drawImage(fishImage3dLeftDown, player.x, player.y);
                    }
                    if (xmv > player.x && xmv < player.x + 200 && ymv > player.y+35 && ymv < player.y + 160) {
                        document.getElementById('gameCanvas').style.cursor = 'pointer';
                        selection=true;
                    }
                    if (selection) {
                        canvas.removeEventListener('click', handleMouseClick) ;
                    }
                    if (!selection) {
                        canvas.addEventListener('click', handleMouseClick);
                    }
        
                    if (allMouseX > player.x && allMouseX < player.x + 200 && allMouseY > player.y+35 && allMouseY < player.y + 160) {
                        alert (`has dado clic sobre el jugador con id ${player.id}`);
                    }
            }
            });
        }

        let selection = false;

        function update() {
            dx = (mouseX-70) - x;
            dy = (mouseY-100) - y;
            angle = Math.atan2(dy, dx);
            angleDegrees = angle * (180 / Math.PI);
            //console.log(angleDegrees);
            //console.log(`x: ${x} y: ${y} xmv: ${xmv} ymy: ${ymv} dx:${dx} dy:${dy}`)
            if (xmv < x+60 || xmv > x + 100 || ymv < y+80 || ymv > y + 102) {
                dxmv = (xmv - 69) - x;
                dymv = (ymv - 99) - y;
                anglemv = Math.atan2(dymv, dxmv);
                angleDegreesmv = anglemv * (180 / Math.PI);
                document.getElementById('gameCanvas').style.cursor = 'default';
                selection=false;
                //console.log(angleDegreesmv);
            }

            let velocityX = Math.cos(angle) * speed;
            let velocityY = Math.sin(angle) * speed;
        
            if (Math.abs(dx) > speed || Math.abs(dy) > speed) {
                x += velocityX;
                y += velocityY;
            }

            if(x>800 && y>500 && roomId===512) { //cambio de roomId en la sala principal
                x=100;
                y=100;
                mouseX=170;
                mouseY=200;
                roomId=206;
            }
            
            if(x<0 && y<0 && roomId===206) { //cambio de roomId en la sala 206
                x=800;
                y=500;
                mouseX=870;
                mouseY=600;
                roomId=512;
            }
            //Dibujo de sala actual
            if (roomId===666) drawRoom666();
            if (!backRoomBool) {
                if (roomId===512) drawRoom512();
                if (roomId===206) drawRoom206();
                if (roomId===0) drawRoom0();
            }
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({ id: id, x: x, y: y, dy: dy, dx: dx, roomId: roomId, name: name, message: message, angleDegreesmv: angleDegreesmv, timeMessage: timeMessage }));
            }
        }
        
        function selectRoom() {
            if (roomId==666) {
                contBack++;
                message="No puedes salir de aquí";
            }
           let idRoom = document.getElementById('roomIdSelector').value;
           let roomIdAux = parseInt(idRoom, 10);
           if (roomIdAux != roomId) {
                CETYS.pause();
                minigameSong1.pause();
                minigameSong2.pause();
                nostalgicSong.pause();
                mainSong.pause();
                CETYS.currentTime = 0;
                mainSong.currentTime = 0;
                minigameSong1.currentTime = 0;
                minigameSong2.currentTime = 0;
                nostalgicSong.currentTime = 0;
           }
           roomId = parseInt(idRoom, 10);
        }

        function changeName() {
            name = document.getElementById('nameChanger').value;
         }

         function messageF () {
            message = document.getElementById('sendMessage').value;
            timeMessage=0;
         }
         let lastFrameTime
        lastFrameTime = Date.now();
        const frameRate = 1000 / 60;
        //---------
        let xgpx = 0; 
        let ygpx = 400;
        let speedg = 1;
        //---------
        let gameTimer2;
        let fishInterval; 
        let gameRunning2 = false;

        function initializeFishGame() {
            basketX = canvas.width / 2 - 50;
            basketY = canvas.height - 150;
            basketWidth = 100;
            basketHeight = 100;
            basketDx = 0;
            fishes2 = [];
            score2 = 0;
            timerSeconds = 30; 
        
            fishImg2 = new Image();
            fishImg2.src = 'fish.png';
            basketImg2 = new Image();
            basketImg2.src = 'basket.png';
        
            fishInterval = setInterval(createFish2, 1000);
            gameTimer2 = setInterval(() => {
                if (timerSeconds > 0) {
                    timerSeconds--;
                } else {
                    endGame();
                }
            }, 1000);  // Update the timer every second
        }
        
        function endGame() {
            alert('Tiempo agotado! Tu puntuación fue: ' + score2);
            cleanupGame();

        }
        
        function cleanupGame() {
            clearInterval(fishInterval);
            clearInterval(gameTimer2);
            fishes2 = [];
            gameRunning2 = false;
        }
        
        function createFish2() {
            let fish = {
                x: Math.random() * (canvas.width - 50),
                y: 0,
                width: 50,
                height: 50,
                dy: 2
            };
            fishes2.push(fish);
        }
        //------------
        let fish3, bubbles3, score3, timer3, gameRunning3;
        let fishImg3 = new Image();
        let bubbleImg3 = new Image();
        
        fishImg3.onload = () => {
            bubbleImg3.onload = () => {
                if (roomId == 3) {
                    initializeRoom3Game();
                    requestAnimationFrame(gameLoop);
                }
            };
            bubbleImg3.src = 'bubble.png';
        };
        fishImg3.src = 'fish.png';
        
        
        function initializeRoom3Game() {
            fish3 = {
                x: canvas.width / 2 - 50,
                y: canvas.height / 2 - 50,
                width: 100,
                height: 100,
                dx: 0,
                dy: 0
            };
            bubbles3 = [];
            score3 = 0;
            timer3 = 30;
            gameRunning3 = true;
        
            bubbleInterval3 = setInterval(createBubble3, 2000);
            timerInterval3 = setInterval(() => {
                if (timer3 > 0) {
                    timer3--;
                } else {
                    clearInterval(bubbleInterval3);
                    clearInterval(timerInterval3);
                    alert(`Tiempo agotado! Tu puntuación fue: ${score3}. El juego se reiniciará.`);
                    initializeRoom3Game(); 
                }
            }, 1000);
        }
        
        
        function createBubble3() {
            if (gameRunning3) {
                let bubble = {
                    x: Math.random() * (canvas.width - 50),
                    y: Math.random() * (canvas.height - 50),
                    width: 50,
                    height: 50
                };
                bubbles3.push(bubble);
            }
        }
        
        function drawRoom3Game() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(letreroId512, 60, 460, 150, 150);
            ctx.drawImage(fishImg3, fish3.x, fish3.y, fish3.width, fish3.height);
            bubbles3.forEach(bubble => {
                ctx.drawImage(bubbleImg3, bubble.x, bubble.y, bubble.width, bubble.height);
            });
            ctx.font = '24px Arial';
            ctx.fillStyle = 'white';
            ctx.fillText(`Puntos: ${score3}`, 100, 100);
            ctx.fillText(`Tiempo: ${timer3}`, canvas.width - 200, 100);
        }
        
        function moveFish3() {
            fish3.x += fish3.dx;
            fish3.y += fish3.dy;
        
            if (fish3.x < 0) fish3.x = 0;
            else if (fish3.x + fish3.width > canvas.width) fish3.x = canvas.width - fish3.width;
            if (fish3.y < 0) fish3.y = 0;
            else if (fish3.y + fish3.height > canvas.height) fish3.y = canvas.height - fish3.height;
        }
        
        function checkBubbleCollisions3() {
            for (let i = 0; i < bubbles3.length; i++) {
                let bubble = bubbles3[i];
                if (fish3.x < bubble.x + bubble.width && fish3.x + fish3.width > bubble.x &&
                    fish3.y < bubble.y + bubble.height && fish3.y + fish3.height > bubble.y) {
                    bubbles3.splice(i, 1);
                    score3 += 10;
                    i--;
                }
            }
        }
        
        function updateRoom3Game() {
            moveFish3();
            checkBubbleCollisions3();
        }

        //------------
                    
        let fish4, obstacles4, score4, gameRunning4;
        let fishImg4 = new Image();
        let obstacleImg4 = new Image();
        let obstacleSpeed4 = 2;
        let obstacleCreationInterval4, speedIncreaseInterval4;
        
        fishImg4.onload = () => {
            obstacleImg4.onload = () => {
                if (roomId === 4) {
                    initializeRoom4Game();
                }
            };
            obstacleImg4.src = 'obstacle.png';
        };
        fishImg4.src = 'fish.png';
        
        function initializeRoom4Game() {
            fish4 = {
                x: canvas.width / 2 - 50,
                y: canvas.height / 2 - 50,
                width: 100,
                height: 100,
                dx: 0,
                dy: 0,
                hitboxOffset: 20
            };
        
            obstacles4 = [];
            score4 = 0;
            gameRunning4 = true;
        
            obstacleCreationInterval4 = setInterval(createObstacle4, 1000);
            speedIncreaseInterval4 = setInterval(() => {
                if (gameRunning4) {
                    obstacleSpeed4 += 0.5;
                }
            }, 5000);
        }
        
        function createObstacle4() {
            if (gameRunning4) {
                let obstacle = {
                    x: canvas.width,
                    y: Math.random() * (canvas.height - 50),
                    width: 50,
                    height: 50,
                    dx: -obstacleSpeed4
                };
                obstacles4.push(obstacle);
            }
        }
        
        function updateRoom4Game() {
            if (!gameRunning4) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(letreroId512, 60, 460, 150, 150);
            moveFish4();
            updateObstacles4();
            drawFish4();
            obstacles4.forEach(drawObstacle4);
            drawScore4();
        }
        
        function drawFish4() {
            console.log("Dibuja")
            ctx.drawImage(fishImg4, fish4.x, fish4.y, fish4.width, fish4.height);
        }
        
        function drawObstacle4(obstacle) {
            ctx.drawImage(obstacleImg4, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        }
        
        function drawScore4() {
            ctx.font = '24px Arial';
            ctx.fillStyle = 'white';
            score4++;
            ctx.fillText(`Puntos: ${score4}`, 105, 100);
        }
        
        function moveFish4() {
            fish4.x += fish4.dx;
            fish4.y += fish4.dy;
            if (fish4.x < 0) fish4.x = 0;
            else if (fish4.x + fish4.width > canvas.width) fish4.x = canvas.width - fish4.width;
            if (fish4.y < 0) fish4.y = 0;
            else if (fish4.y + fish4.height > canvas.height) fish4.y = canvas.height - fish4.height;
        }
        
        function updateObstacles4() {
            for (let i = 0; i < obstacles4.length; i++) {
                obstacles4[i].x += obstacles4[i].dx;
                if (
                    fish4.x + fish4.hitboxOffset < obstacles4[i].x + obstacles4[i].width &&
                    fish4.x + fish4.width - fish4.hitboxOffset > obstacles4[i].x &&
                    fish4.y + fish4.hitboxOffset < obstacles4[i].y + obstacles4[i].height &&
                    fish4.y + fish4.height - fish4.hitboxOffset > obstacles4[i].y
                ) {
                    gameRunning4 = false; 
                    alert(`¡Has perdido! El juego se reiniciara. Acumulaste: ${score4} puntos`);
                    
                    initializeRoom4Game();
                }
                if (obstacles4[i] && obstacles4[i].x + obstacles4[i].width < 0) {
                    obstacles4.splice(i, 1);
                }
            }
        }
                
        //------------

        
        document.addEventListener('keydown', (e) => {
            if (roomId == 2 && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
                e.preventDefault();
                basketDx = (e.key === 'ArrowLeft') ? -5 : 5;
            }
        });
        
        document.addEventListener('keyup', (e) => {
            if (roomId == 2 && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
                e.preventDefault();
                basketDx = 0;
            }  
        });
        
        document.addEventListener('keydown', (e) => {
            if (roomId === 3) {
                switch (e.key) {
                    case 'ArrowUp': fish3.dy = -5; break;
                    case 'ArrowDown': fish3.dy = 5; break;
                    case 'ArrowLeft': fish3.dx = -5; break;
                    case 'ArrowRight': fish3.dx = 5; break;
                }
            }
        });
        
        document.addEventListener('keyup', (e) => {
            if (roomId === 3) {
                if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                    fish3.dx = 0;
                    fish3.dy = 0;
                }
            }
        });

        document.addEventListener('keydown', (e) => {
            if (roomId === 4) {
                switch (e.key) {
                    case 'ArrowUp': fish4.dy = -5; break;
                    case 'ArrowDown': fish4.dy = 5; break;
                    case 'ArrowLeft': fish4.dx = -5; break;
                    case 'ArrowRight': fish4.dx = 5; break;
                }
            }
        });
        
        document.addEventListener('keyup', (e) => {
            if (roomId === 4) {
                if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                    fish4.dx = 0;
                    fish4.dy = 0;
                }
            }
        });
        
         function gameLoop() {
             const now = Date.now();
             const deltaTime = now - lastFrameTime;
             if (deltaTime >= frameRate) {
                if (backRoomBool) {
                    roomId = 666;
                }
                if (roomId!=1) speedg = 1;
                if (roomId==1) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    nostalgicSong.play();
                    ctx.fillStyle = 'white';
                    ctx.fillRect(0, 0, 1200, 690);
                    ctx.fillStyle = 'black';
                    socket.send(JSON.stringify({ id: id, x: x, y: y, dy:dy, dx:dx, roomId:roomId, name:name, message:message, angleDegreesmv:angleDegreesmv, timeMessage:timeMessage }));
                    canvas.removeEventListener('click', handleMouseClick) ;
                    x=-500;
                    y=-500;
                    mouseY = -400;
                    mouseX = -430;
                    xgpx+=speedg;
                    ctx.drawImage(letreroId512, 60, 460, 150, 150);
                    ctx.fillRect(xgpx,ygpx,10,10)
                    if(xgpx>1200){
                        xgpx=0;
                    }
                    if (allMouseX > xgpx && allMouseX < xgpx+10 && allMouseY > ygpx && allMouseY < ygpx+10) {
                        alert('Has ganado!!')
                        allMouseX = -500;
                        allMouseY = -500;
                        speedg++;
                    }
                }
                if (roomId == 2) {
                    if (!gameRunning2) {
                        initializeFishGame();
                        gameRunning2 = true;
                    }
                    minigameSong1.play();
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(letreroId512, 60, 460, 150, 150);
                    socket.send(JSON.stringify({ id: id, x: x, y: y, dy:dy, dx:dx, roomId:roomId, name:name, message:message, angleDegreesmv:angleDegreesmv, timeMessage:timeMessage }));
                    canvas.removeEventListener('click', handleMouseClick) ;
                    x=-500;
                    y=-500;
                    mouseX = -400;
                    mouseY = -430;
                    ctx.drawImage(basketImg2, basketX, basketY, basketWidth, basketHeight); 
                    fishes2.forEach((fish, index) => {
                        fish.y += fish.dy;
                        ctx.drawImage(fishImg2, fish.x, fish.y, fish.width, fish.height);
                        if (fish.y < basketY + basketHeight && fish.y + fish.height > basketY &&
                            fish.x + fish.width > basketX && fish.x < basketX + basketWidth) {
                            score2 += 10;
                            fishes2.splice(index, 1); 
                        }
                    });
            
                    ctx.font = '24px Arial';
                    ctx.fillStyle = 'white';
                    ctx.fillText(`Puntos: ${score2}`, 120, 100);
                    ctx.fillText(`Tiempo: ${timerSeconds}s`, canvas.width - 210, 100); 
            
                    basketX += basketDx;
                    if (basketX < 0) basketX = 0;
                    else if (basketX + basketWidth > canvas.width) basketX = canvas.width - basketWidth;
                } else if (gameRunning2) {
                    cleanupGame();
                }
                
                
                if (roomId==3) {
                    minigameSong1.play();
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    socket.send(JSON.stringify({ id: id, x: x, y: y, dy:dy, dx:dx, roomId:roomId, name:name, message:message, angleDegreesmv:angleDegreesmv, timeMessage:timeMessage }));
                    canvas.removeEventListener('click', handleMouseClick) ;
                    x=-500;
                    y=-500;
                    mouseX = -400;
                    mouseY = -430;
                    if (!gameRunning3) initializeRoom3Game();
                    drawRoom3Game();
                    updateRoom3Game();
                } else if (gameRunning3) {
                    gameRunning3 = false;
                    clearInterval(bubbleInterval3);
                    clearInterval(timerInterval3);
                }

                if (roomId == 4) {
                    minigameSong2.play();
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.fillStyle = 'white';
                    ctx.fillRect(0, 0, 1200, 690);
                    ctx.fillStyle = 'black';
                    socket.send(JSON.stringify({ id: id, x: x, y: y, dy: dy, dx: dx, roomId: roomId, name: name, message: message, angleDegreesmv: angleDegreesmv, timeMessage: timeMessage }));
                    canvas.removeEventListener('click', handleMouseClick);
                    x = -500;
                    y = -500;
                    mouseX = -400;
                    mouseY = -430;
                    if (!gameRunning4) {
                        initializeRoom4Game();
                    }
                    updateRoom4Game();
                } else {
                    clearInterval(obstacleCreationInterval4);
                    clearInterval(speedIncreaseInterval4);
                }
                if (roomId!=1 && roomId !=2 && roomId !=3 && roomId !=4) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    update();
                    drawOtherPlayers();
                    drawFish(x, y);
                    allMouseX = -1000;
                    allMouseY = -1000;
                    if (x<-300 || x<-300) {
                        x=400;
                        y=400;
                        mouseX=470;
                        mouseY=500;
                    }
                }
                lastFrameTime = now - (deltaTime % frameRate);
             }
             requestAnimationFrame(gameLoop);
         }
        ctx.fillRect(500, 300, 200, 200);
        setTimeout(function() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            gameLoop();
        }, 2000); 