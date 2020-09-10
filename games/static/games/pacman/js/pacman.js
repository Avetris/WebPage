// Variables globales de utilidad
var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
var w = canvas.width;
var h = canvas.height;


// GAME FRAMEWORK 
var GF = function(){

 // variables para contar frames/s, usadas por measureFPS
    var frameCount = 0;
    var lastTime;
    var fpsContainer;
    var fps; 
 
    //  variable global temporalmente para poder testear el ejercicio
    inputStates = {};

    const TILE_WIDTH=24, TILE_HEIGHT=24;
        var numGhosts = 4;
	var ghostcolor = {};
	ghostcolor[0] = "rgba(255, 0, 0, 255)";
	ghostcolor[1] = "rgba(255, 128, 255, 255)";
	ghostcolor[2] = "rgba(128, 255, 255, 255)";
	ghostcolor[3] = "rgba(255, 128, 0,   255)";
	ghostcolor[4] = "rgba(50, 50, 255,   255)"; // blue, vulnerable ghost
	ghostcolor[5] = "rgba(255, 255, 255, 255)"; // white, flashing ghost

	var spriteVulnerable = {};
	spriteVulnerable[0] = new Sprite (static_url + 'res/img/sprites.png', [6,166], [20,20], 0.005, [0,1]);
	spriteVulnerable[1] = new Sprite (static_url + 'res/img/sprites.png', [46,166], [20,20], 0.005, [0,1]);

	var ojos = {};
	ojos[0] = new Sprite (static_url + 'res/img/sprites.png', [6,206], [20,20], 0.005, [0]);
	ojos[1] = new Sprite (static_url + 'res/img/sprites.png', [26,206], [20,20], 0.005, [0]);
	ojos[2] = new Sprite (static_url + 'res/img/sprites.png', [46,206], [20,20], 0.005, [0]);
	ojos[3] = new Sprite (static_url + 'res/img/sprites.png', [66,206], [20,20], 0.005, [0]);



	// hold ghost objects
	var ghosts = {};

    var Ghost = function(id, ctx){

		this.x = 0;
		this.y = 0;
		this.velX = 0;
		this.velY = 0;
		this.speed = 1;
		
		this.nearestRow = 0;
		this.nearestCol = 0;
	
		this.ctx = ctx;
		
		this.movimiento = 0;

		this.id = id;
		this.homeX = 0;
		this.homeY = 0;
		this.parpadeo = 10;
		this.state = Ghost.NORMAL;
		this.sprite = new Array(new Sprite (static_url + 'res/img/sprites.png', [6,86+20*this.id], [20,20], 0.005, [0,1]),
						new Sprite (static_url + 'res/img/sprites.png', [46,86+20*this.id], [20,20], 0.005, [0,1]),
						new Sprite (static_url + 'res/img/sprites.png', [86,86+20*this.id], [20,20], 0.005, [0,1]),
						new Sprite (static_url + 'res/img/sprites.png', [126,86+20*this.id], [20,20], 0.005, [0,1]));
		this.spriteActual = this.sprite[0];

	this.draw = function(){
		// Pintar cuerpo de fantasma

		ctx.save();
	    ctx.translate(this.x,this.y);
		if(this.state == Ghost.NORMAL){
       	 	this.spriteActual = this.sprite[this.movimiento];
		}else if(this.state == Ghost.VULNERABLE){
			if(this.parpadeo > 0){
    			this.spriteActual = spriteVulnerable[0];
			}else{
    			this.spriteActual = spriteVulnerable[1];
			}
			if(this.parpadeo == -10){
				this.parpadeo = 10;
			}else{
				this.parpadeo --;
			}
		}else{
			// Pintar ojos 
			this.spriteActual = ojos[this.movimientoActual];			
		}
		this.spriteActual.render(ctx);
        ctx.restore();   

	}; // draw

	 this.move = function() {
	 	this.spriteActual.update(10);
	 	if(this.state == Ghost.SPECTACLES){
			var movX = this.homeX - this.x;
			var movY = this.homeY - this.y;
			if(Math.abs(movX) > 1){
				if(movX > 0){
					this.x += 1;
					this.movimientoActual = 3;
				}else if(movX < 0){				
					this.x -= 1;
					this.movimientoActual = 2;
				}
			} else{		
				this.x += movX;	
			}
			if(Math.abs(movY) > 1){
				if(movY > 0){
					this.y += 1;
					this.movimientoActual = 1;
				}else if(movY < 0){					
					this.y -= 1;
					this.movimientoActual = 0;
				}
			} else{		
				this.y += movY;	
			}
			if(this.x == this.homeX && this.y == this.homeY){
				this.state = Ghost.NORMAL;
 					ghost_eaten.play();
			}
	 	}else{
			if(this.nearestCol == this.x/thisGame.TILE_WIDTH && this.nearestRow == this.y/thisGame.TILE_HEIGHT){
				var posiblesMovimientos = [[0,-1],[0,1],[1,0],[-1,0]];
				var soluciones = [];
				for(var i = 0; i < posiblesMovimientos.length; i++){
					var aux = posiblesMovimientos[i];
					if(!thisLevel.isWall(this.nearestRow+aux[0], this.nearestCol+aux[1])){
						if(this.velX == 0 && this.velY == 0){
							soluciones.push(aux);
						}else if(this.velX == 0){
							if(aux[1] == 0){
								if(this.velY != (aux [0]*-1)){
									soluciones.push(aux);
								}
							}else{
								soluciones.push(aux);
							}
						}else{
							if(this.velX != (aux [1]*-1)){
								soluciones.push(aux);								
							}
						}
					}
				}
				if(soluciones.length > 0){
					var aleatorio = soluciones[Math.floor(Math.random() * soluciones.length)];
					this.velX = aleatorio[1];
					this.velY = aleatorio[0];					
				}else{
					this.velX = this.velX*-1;
					this.velY = this.velY*-1;
				}					
				
			}
			this.x += this.velX;
			this.y += this.velY;	
			if(this.velX > 0){
				this.movimiento = 3;
			}else if(this.velX < 0){
				this.movimiento = 2;
			}else if(this.velY > 0){
				this.movimiento = 1;
			}else if(this.velY < 0){
				this.movimiento = 0;
			}
	 	}	

	    //Actualizamos la casilla mas cercana
 		this.nearestCol = Math.round(this.x/thisGame.TILE_WIDTH);
 		this.nearestRow = Math.round(this.y/thisGame.TILE_HEIGHT);	

			var tile = thisLevel.getMapTile(this.nearestRow,this.nearestCol);
			switch(tile){
				case 20:
					if(this.nearestCol == thisGame.screenTileSize[1]-1){	
						this.x = thisGame.TILE_WIDTH*2;
					}else if(this.nearestCol == 0){
						this.x = thisGame.TILE_WIDTH*(thisGame.screenTileSize[1]-2);
					}
					break;
				case 21:
					if(this.nearestRow == thisGame.screenTileSize[0]){
						this.y = thisGame.TILE_HEIGHT;
					}else if(this.nearestRow == 0){
						this.y = thisGame.TILE_HEIGHT*(thisGame.screenTileSize[0]-2);
					}
					break;
				}
		};

	}; // fin clase Ghost

	 // static variables
	  Ghost.NORMAL = 1;
	  Ghost.VULNERABLE = 2;
	  Ghost.SPECTACLES = 3;

	var Level = function(ctx) {
		this.ctx = ctx;
		this.lvlWidth = 0;
		this.lvlHeight = 0;
		
		this.map = [];
		
		this.pellets = 0;
		this.powerPelletBlinkTimer = 0;

	this.setMapTile = function(row, col, newValue){
			this.map[row*this.lvlWidth+col] = newValue;
		};

		this.getMapTile = function(row, col){
			return this.map[row*this.lvlWidth+col];
		};

		this.printMap = function(){
			var instancia = this;
			console.log(this.map);
			//Utilizamos un interval porque la primera vez que se llame no va a estar cargado todabia
			var reloj = setInterval(function(){
				if(instancia.map.length > 0){
					console.log(instancia.map);
					clearInterval(reloj);
				}
			},1000);
		}
			
				

		this.loadLevel = function(){

			var instancia = this;

			$.ajax({
				url:static_url + 'res/levels/1.txt',
				isLocal: true,
				success: function (data){
					var fila = -1;
	                data = data.split("\n");
					for(var i = 0; i < data.length; i++){
						if(data[i].includes("lvlwidth")){
							var palabras = data[i].split(" ");
							instancia.lvlWidth = palabras.reverse()[0];
						}else if(data[i].includes("lvlheight")){
							var palabras = data[i].split(" ");
							instancia.lvlHeight = palabras.reverse()[0];
						}else if(data[i].includes("startleveldata")){
							fila = 0;
						}else if(data[i].includes("endleveldata")){
							fila = -1;
						}else if(fila != -1){
							var palabras = data[i].split(" ");
							for(var col = 0; col < palabras.length; col++){
								instancia.setMapTile(fila, col, parseInt(palabras[col]));
								if(palabras[col] == 4){
									player.homeX = thisGame.TILE_WIDTH*col;
									player.homeY = thisGame.TILE_HEIGHT*fila;
								}else if(palabras[col] == 2){
									instancia.pellets++;
								}else if(palabras[col] == 10){
									ghosts[0].homeX = thisGame.TILE_WIDTH*col;
									ghosts[0].homeY = thisGame.TILE_HEIGHT*fila;
								}else if(palabras[col] == 11){
									ghosts[1].homeX = thisGame.TILE_WIDTH*col;
									ghosts[1].homeY = thisGame.TILE_HEIGHT*fila;
								}else if(palabras[col] == 12){
									ghosts[2].homeX = thisGame.TILE_WIDTH*col;
									ghosts[2].homeY = thisGame.TILE_HEIGHT*fila;
								}else if(palabras[col] == 13){
									ghosts[3].homeX = thisGame.TILE_WIDTH*col;
									ghosts[3].homeY = thisGame.TILE_HEIGHT*fila;
								}
							}
							fila++;
						}
					}
        	}, 
        		dataType:'text', 
        		async:false});
		};

        this.drawMap = function(){
	    	var TILE_WIDTH = thisGame.TILE_WIDTH;
	    	var TILE_HEIGHT = thisGame.TILE_HEIGHT;
	    	this.powerPelletBlinkTimer++;
	    	this.sprite = new Sprite (static_url + 'res/img/sprites.png', [167,166], [20,20], 0.005, [0]);

	    	var dibujarCuadrado = function(x, y, color){
	    		this.ctx.beginPath();
				this.ctx.moveTo(TILE_HEIGHT*y, TILE_WIDTH*x);
				this.ctx.lineTo(TILE_HEIGHT*y, TILE_WIDTH*(x+1));
				this.ctx.lineTo(TILE_HEIGHT*(y+1), TILE_WIDTH*(x+1));
				this.ctx.lineTo(TILE_HEIGHT*(y+1), TILE_WIDTH*x);
				this.ctx.lineTo(TILE_HEIGHT*y, TILE_WIDTH*x);
				this.ctx.fillStyle = color;
				this.ctx.fill();
	    	}

	    	var dibujarCirculo = function(x, y, color){
	    		this.ctx.beginPath();
       			this.ctx.fillStyle = color;
				this.ctx.arc(TILE_HEIGHT*y+TILE_HEIGHT/2, TILE_WIDTH*x+TILE_WIDTH/2, 5, 0, 2*Math.PI, false);
				this.ctx.fill();
	    	}

    		var tileID = {
	    		'door-h' : 20,
				'door-v' : 21,
				'pellet-power' : 3,
				'pellet' : 2
			};
			for(var i = 0; i <  this.lvlHeight; i++){
				for(var j = 0; j <  this.lvlWidth; j++){
					var valor = this.getMapTile(i, j);
					switch(valor){
						case tileID['pellet-power']:
								if((this.powerPelletBlinkTimer % 60) <= 30){
									ctx.save();
									ctx.translate(TILE_HEIGHT*j-TILE_HEIGHT/2, TILE_WIDTH*i);
									this.sprite.render(ctx);
									ctx.restore();
								}
							break;
						case tileID['pellet']:
								dibujarCirculo(i,j,"white");
							break;							
						default:
							if(valor >= 100 && valor <= 199){
								dibujarCuadrado(i,j,"blue");
							}else if(valor >= 10 && valor <= 13){
								dibujarCuadrado(i,j,"black");
							}
					}
				}
			}
		};


		this.isWall = function(row, col) {
			var valor = this.getMapTile(row, col);
			if(valor >= 100 && valor <= 199){
				return true;
			}else{
				return false;
			}
		};


		this.checkIfHitWall = function(possiblePlayerX, possiblePlayerY, row, col){
			var columna = possiblePlayerX/thisGame.TILE_WIDTH;
			var fila = possiblePlayerY/thisGame.TILE_HEIGHT;
			if(row == undefined || col == undefined){
	       		return this.isWall(Math.round(fila),Math.round(columna));
	        }else{
	        	//Esta segunda parte es solo para os inputState, para no ir por la mitad de una pareed y un camino por los decimales
	        	if(fila == row && columna == col){
	        		return this.isWall(row,col);
	        	}else if(fila == row){
	       			return this.isWall(row,columna);	
	        	}else if(columna == col){
	       			return this.isWall(fila,col);	

	        	}else{
	        		return true;
	        	}
	        }
		};

		this.checkIfHitSomething = function(playerX, playerY, row, col){
			var tileID = {
	    		'door-h' : 20,
				'door-v' : 21,
				'pellet-power' : 3,
				'pellet': 2
			};
			var tile = thisLevel.getMapTile(row,col);
			switch(tile){
				case tileID['door-h']:
					if(col == thisGame.screenTileSize[1]-1){	
						inputStates.right = true;
						inputStates.left = false;
						player.x = thisGame.TILE_WIDTH*2;
					}else if(col == 0){
						inputStates.right = false;
						inputStates.left = true;
						player.x = thisGame.TILE_WIDTH*(thisGame.screenTileSize[1]-2);
					}
					break;
				case tileID['door-v']:
					if(row == thisGame.screenTileSize[0]){	
						inputStates.up = false;
						inputStates.down = true;
						player.y = thisGame.TILE_HEIGHT;
					}else if(row == 0){
						inputStates.up = true;
						inputStates.down = false;
						player.y = thisGame.TILE_HEIGHT*(thisGame.screenTileSize[0]-2);
					}
					break;
				case tileID['pellet-power']:
					eat_pill.play();
					thisLevel.setMapTile(row,col,"0");
					thisGame.ghostTimer = 360;
					waza.play();
					break;
				case tileID['pellet']:
					thisGame.points += 10;
					eating.play();
					this.pellets--;
					thisLevel.setMapTile(row,col,"0");
					break;	
			}
		};

		this.checkIfHit = function(playerX, playerY, x, y, holgura){
			if(Math.abs(playerX-x) > holgura || Math.abs(playerY-y) > holgura){
				return false;				
			}else{
				return true;
			}
		};

	}; // end Level 

	var Pacman = function() {
		this.radius = 10;
		this.x = 0;
		this.y = 0;
		this.speed = 2;
		this.angle1 = 0.25;
		this.angle2 = 1.75;
		this.movimientoActual = 1;
		this.sprite = new Array(new Sprite (static_url + 'res/img/sprites.png', [5,5], [20,20], 0.005, [0,1]),
								new Sprite (static_url + 'res/img/sprites.png', [5,25], [20,20], 0.005, [0,1]),
								new Sprite (static_url + 'res/img/sprites.png', [5,45], [20,20], 0.005, [0,1]),
								new Sprite (static_url + 'res/img/sprites.png', [5,65], [20,20], 0.005, [0,1]),
								new Sprite (static_url + 'res/img/sprites.png', [5,245], [20,20], 0.005, [0,1,2,3,4,5,6,7,8,9,10]));
		this.spriteActual = this.sprite[this.movimientoActual];
	};
	Pacman.prototype.move = function() {
		this.spriteActual.update(15);
		if(this.velX > 0 && this.x < w-this.radius * 2){
			if(!thisLevel.checkIfHitWall(this.x+thisGame.TILE_WIDTH, this.y)){
	     		this.x += this.velX;
	      		this.movimientoActual = 01;
			}else{
	      		this.x = Math.round(this.x/thisGame.TILE_WIDTH)*thisGame.TILE_WIDTH;
				inputStates.right = false;
				velX = 0;
			}
	    }else if(this.velX < 0 && this.x  > 0){	    	
			if(!thisLevel.checkIfHitWall(this.x-thisGame.TILE_WIDTH, this.y)){
	      		this.x += this.velX;
	      		this.movimientoActual = 0;
	      	}else{
	      		this.x = Math.round(this.x/thisGame.TILE_WIDTH)*thisGame.TILE_WIDTH;
				inputStates.left = false;
				velX = 0;
			}
	    }
	    if(this.velY > 0 && this.y  < h-this.radius * 2){
 			if(!thisLevel.checkIfHitWall(this.x, this.y+thisGame.TILE_HEIGHT)){
		      this.y += this.velY;
	      		this.movimientoActual = 3;
		  	}else{
	      		this.y = Math.round(this.y/thisGame.TILE_HEIGHT)*thisGame.TILE_HEIGHT;
				inputStates.down = false;
				velY = 0;
			}
	    }else if(this.velY < 0 && this.y  > 0){      
	      if(!thisLevel.checkIfHitWall(this.x, this.y-thisGame.TILE_HEIGHT)){
		      this.y += this.velY;
	      		this.movimientoActual = 2;
		  }else{
	      		this.y = Math.round(this.y/thisGame.TILE_HEIGHT)*thisGame.TILE_HEIGHT;
				inputStates.up = false;
				velY = 0;
			}
	    }

	    //Actualizamos la casilla mas cercana
 		this.nearestCol = Math.round(this.x/thisGame.TILE_WIDTH);
 		this.nearestRow = Math.round(this.y/thisGame.TILE_HEIGHT);	

		thisLevel.checkIfHitSomething(this.x, this.y, this.nearestRow, this.nearestCol);

 		for(var i = 0; i < numGhosts; i++){
 			if(thisLevel.checkIfHit(this.x, this.y, ghosts[i].x, ghosts[i].y, TILE_WIDTH/2)){
 				if(ghosts[i].state == Ghost.VULNERABLE){
 					ghosts[i].state = Ghost.SPECTACLES;	
 					eat_ghost.play();
 				}else if(ghosts[i].state == Ghost.NORMAL){
    				die.play();
 					this.movimientoActual = 4;
 					thisGame.setMode(thisGame.HIT_GHOST);
 				}
 			} 			
 		}
	};


     // Función para pintar el Pacman
     Pacman.prototype.draw = function(x, y) {
        if(x == undefined){
          x = this.x;
        } 
        if(y == undefined){
          y = this.y;
        } 
        this.spriteActual = this.sprite[this.movimientoActual];
        ctx.save();
        ctx.translate(x,y);
        this.spriteActual.render(ctx);
        ctx.restore();   
    };

	var player = new Pacman();
	for (var i=0; i< numGhosts; i++){
		ghosts[i] = new Ghost(i, canvas.getContext("2d"));
	}
	console.log(player.sprite);

	/*var player = new Pacman();
	for (var i=0; i< numGhosts; i++){
		ghosts[i] = new Ghost(i, canvas.getContext("2d"));
	}*/


	var thisGame = {
		getLevelNum : function(){
			return 0;
		},
	        setMode : function(mode) {
			this.mode = mode;
			this.modeTimer = 0;
		},
		screenTileSize: [24, 21],
		TILE_WIDTH: 24, 
		TILE_HEIGHT: 24,
		ghostTimer: 0,
		NORMAL : 1,
		HIT_GHOST : 2,
		GAME_OVER : 3,
		WAIT_TO_START: 4,
		PAUSE: 5,
		modeTimer: 0,
		lifes: 3,
		points: 0,
		highscore: 0,
	};

	var thisLevel = new Level(canvas.getContext("2d"));
	thisLevel.loadLevel( thisGame.getLevelNum() );
	// thisLevel.printMap(); 



	var measureFPS = function(newTime){
		// la primera ejecución tiene una condición especial

		if(lastTime === undefined) {
			lastTime = newTime; 
			return;
		}

		// calcular el delta entre el frame actual y el anterior
		var diffTime = newTime - lastTime; 

		if (diffTime >= 1000) {

			fps = frameCount;    
			frameCount = 0;
			lastTime = newTime;
		}

		// mostrar los FPS en una capa del documento
		// que hemos construído en la función start()
		fpsContainer.innerHTML = 'FPS: ' + fps; 
		frameCount++;
	};

	// clears the canvas content
	var clearCanvas = function() {
		ctx.clearRect(0, 0, w, h);
	};

	var checkInputs = function(){
		if(inputStates.right){
			if(!thisLevel.checkIfHitWall(player.x+thisGame.TILE_WIDTH, player.y, player.nearestRow, player.nearestCol)){
	      		player.velX = player.speed;
	      		player.velY = 0;
	      		inputStates.left = false;
	      		inputStates.up = false;
	      		inputStates.down = false;
			}
	    }else if(inputStates.left){
	    	if(!thisLevel.checkIfHitWall(player.x-thisGame.TILE_WIDTH, player.y, player.nearestRow, player.nearestCol)){
	      		player.velX = -1*player.speed;
	      		player.velY = 0;
	      		inputStates.right = false;
	      		inputStates.up = false;
	      		inputStates.down = false;
			}
	    }else if(inputStates.up){
	    	if(!thisLevel.checkIfHitWall(player.x, player.y-thisGame.TILE_HEIGHT, player.nearestRow, player.nearestCol)){
	      		player.velY = -1*player.speed;
	     		player.velX = 0;
	      		inputStates.left = false;
	      		inputStates.right = false;
	      		inputStates.down = false;
			}
	    }else if(inputStates.down){
			if(!thisLevel.checkIfHitWall(player.x, player.y+thisGame.TILE_HEIGHT, player.nearestRow, player.nearestCol)){
	      		player.velY = player.speed;
	     		player.velX = 0;
	      		inputStates.left = false;
	      		inputStates.up = false;
	      		inputStates.right = false;
			}
	    }
	};


    var updateTimers = function(){
    	if(thisGame.ghostTimer > 0){
    		thisGame.ghostTimer--;
    	}
    	for(var i = 0; i < numGhosts; i++){
    		if(ghosts[i].state != Ghost.SPECTACLES){
    			if(thisGame.ghostTimer > 0){
	    			ghosts[i].state = Ghost.VULNERABLE;
				}else if(thisGame.ghostTimer == 0){
					waza.pause();
		    		ghosts[i].state = Ghost.NORMAL;
				}
			}			
    	}	
    	thisGame.modeTimer++;

    	//MODE TIMER		
    };

    var displayScore = function(){
    	ctx.font = "bold 22px sans-serif";
    	ctx.fillStyle="red";
    	ctx.fillText("1UP",thisGame.TILE_WIDTH,2*thisGame.TILE_HEIGHT/3);

    	ctx.font = "22px sans-serif";
    	ctx.fillStyle="white";
    	ctx.fillText(thisGame.points,4*thisGame.TILE_WIDTH,2*thisGame.TILE_HEIGHT/3);

    	ctx.font = "bold 22px sans-serif";
    	ctx.fillStyle="red";
    	ctx.fillText("HIGH SCORE",12.1*thisGame.TILE_WIDTH,2*thisGame.TILE_HEIGHT/3);

    	ctx.font = "22px sans-serif";
    	ctx.fillStyle="white";
    	ctx.fillText(thisGame.highscore,19*thisGame.TILE_WIDTH,2*thisGame.TILE_HEIGHT/3);


    	ctx.font = "18px sans-serif";
    	ctx.fillStyle="white";
    	ctx.fillText("Lifes: "+thisGame.lifes,thisGame.TILE_WIDTH,25*thisGame.TILE_HEIGHT);

    	if(thisGame.mode == thisGame.GAME_OVER){
    		ctx.drawImage(resources.get(static_url + 'res/img/sprites.png'),
                          5, 195,
                          100,10,
                          (thisLevel.lvlWidth/20)*thisGame.TILE_WIDTH, (thisLevel.lvlHeight/2)*thisGame.TILE_HEIGHT,
                          500, 100);
    		var fin = false;
			for(var i = 0; i < localStorage.length && !fin; i++){
				if(localStorage.key(i) == ("puntuacion_maxima")){
					if(localStorage["puntuacion_maxima"] < thisGame.points){
						localStorage["puntuacion_maxima"] = thisGame.points;
					}
					fin = true;
				}
			}
			if(!fin){
				localStorage["puntuacion_maxima"] = thisGame.points;
			}
    	}
    }

    var mainLoop = function(time){
        //main function, called each frame 
        measureFPS(time);
        if(thisGame.mode == thisGame.PAUSE){
		    // Clear the canvas
	        clearCanvas();
			thisLevel.drawMap();
			displayScore();
        }else{
	        if(thisGame.mode == thisGame.NORMAL){

				checkInputs();

				player.move();
				
		    }else if(thisGame.mode == thisGame.HIT_GHOST){
		    		player.spriteActual.update(24);
		    	if(thisGame.modeTimer >= 90){
		    		thisGame.lifes--;	    		
		    		reset();
		    		if(thisGame.lifes == 0){
		    			thisGame.setMode(thisGame.GAME_OVER);
		    		}
		    	}

		    }
		    if(thisGame.mode == thisGame.WAIT_TO_START){
		    	player.movimientoActual = 1;
				siren.pause();
		    	if(!ready.playing())ready.play();
		    	if(thisGame.modeTimer >= 250){
		    		thisGame.setMode(thisGame.NORMAL);
					siren.play();
		    	}
		    }else{
		    	 // Mover fantasmas
				for (var i=0; i< numGhosts; i++){
					ghosts[i].move();
				}
		    }
		    // Clear the canvas
	        clearCanvas();

	   
			thisLevel.drawMap();
		    // Pintar fantasmas
			for (var i=0; i< numGhosts; i++){
				ghosts[i].draw();
			}
	 
			player.draw();

			displayScore();
	 
			updateTimers();

	    }	    
        // call the animation loop every 1/60th of second
        requestAnimationFrame(mainLoop);
    };

     var addListeners = function(){
		   window.onkeydown = function(e) {
			   var key = e.keyCode ? e.keyCode : e.which;
			   switch (key){
			   		case 65:
			   		case 37:
			   			inputStates.left = true;
			   			break;
			   		case 68:
			   		case 39:
			   			inputStates.right = true;
			   			break;
			   		case 87:
			   		case 38:
			   			inputStates.up = true;
			   			break;
			   		case 83:
			   		case 40:
			   			inputStates.down = true;
			   			break;
			   		case 80:
			   			if(thisGame.mode == thisGame.PAUSE){
						    thisGame.mode = thisGame.lastMode;
						    siren.play();
			   			}else if(thisGame.mode != thisGame.WAIT_TO_START){
					      thisGame.lastMode = thisGame.mode;
					      thisGame.mode = thisGame.PAUSE;	
						    siren.pause();		   				
			   			}
			   			break;
			   }
			}
			window.onkeyup = function(e) {
			   var key = e.keyCode ? e.keyCode : e.which;
			   switch (key){
			   		case 65:
			   		case 37:
			   			inputStates.left = false;
			   			break;
			   		case 68:
			   		case 39:
			   			inputStates.right = false;
			   			break;
			   		case 87:
			   		case 38:
			   			inputStates.up = false;
			   			break;
			   		case 83:
			   		case 40:
			   			inputStates.down = false;
			   			break;
			   }
			}
	   };

     var reset = function(){
    	player.x = player.homeX;
    	player.y = player.homeY;
	    player.nearestCol = player.x/thisGame.TILE_WIDTH;
	    player.nearestRow = player.y/thisGame.TILE_HEIGHT;
    	inputStates.right = true;
    	for (var i=0; i< numGhosts; i++){
	    	ghosts[i].x = ghosts[i].homeX;
	    	ghosts[i].y = ghosts[i].homeY;
		    ghosts[i].nearestCol = ghosts[i].x/thisGame.TILE_WIDTH;
		    ghosts[i].nearestRow = ghosts[i].y/thisGame.TILE_HEIGHT;
		}	   
	     thisGame.setMode( thisGame.WAIT_TO_START);
    };
  	var eat_pill = new Howl({
		src: [static_url + 'res/sounds/eat-pill.mp3'],
		volume: 1,
		onload: function() {
			eating = new Howl({
				src: [static_url + 'res/sounds/eating.mp3'],
				volume: 1,
				onload: function() {
					siren = new Howl({
						src: [static_url + 'res/sounds/siren.mp3'],
						volume: 0.5,
						loop: true,
						onload: function() {
							waza = new Howl({
								src: [static_url + 'res/sounds/waza.mp3'],
								volume: 1,
								loop: true,
								onload: function() {
									die = new Howl({
										src: [static_url + 'res/sounds/die.mp3'],
										volume: 1,
										onload: function() {
											eat_ghost = new Howl({
												src: [static_url + 'res/sounds/eat-ghost.mp3'],
												volume: 1,
												onload: function() {
													ghost_eaten = new Howl({
														src: [static_url + 'res/sounds/ghost-eaten.mp3'],
														volume: 1,
														onload: function() {
															ready = new Howl({
																src: [static_url + 'res/sounds/ready.mp3'],
																volume: 1,
																onload: function() {
																	requestAnimationFrame(mainLoop); // comenzar animación
																}
															});
														}
													});
												}
											});
										}
									});
								}
							});
						}
					});
				}
			});
		}
	});


    var start = function(){
        // adds a div for displaying the fps value
        fpsContainer = document.createElement('div');
        document.body.appendChild(fpsContainer);
       
		addListeners();

		reset();

		var fin = false;
		for(var i = 0; i < localStorage.length && !fin; i++){
			if(localStorage.key(i) == ("puntuacion_maxima")){
				thisGame.highscore = localStorage["puntuacion_maxima"];
				fin = true;
			}
		}

        resources.load([static_url + 'res/img/sprites.png']);
    };

    //our GameFramework returns a public API visible from outside its scope
    return {
        start: start,
	thisGame: thisGame
    };
};


  var game = new GF();
  game.start();

