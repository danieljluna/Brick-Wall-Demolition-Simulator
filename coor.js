var BRICK_COORD = [
   [.87, .47, .24],    //1
   [-.87, .47, .24],
   [-.87, -.47, .24],
   [.87, -.47, .24],
   [.87, .47, -.24],   //5
   [-.87, .47, -.24],
   [-.87, -.47, -.24],
   [.87, -.47, -.24]
];

var FLOOR_COORD = [
   [30, .05, 0],
   [-30, .05, 0],
   [-30, -29.5, 0],
   [30, -29.5, 0]
];

var WATER_COORD = [
   [80, 160, 0],
   [-200, 160, 0],
   [-80, 0, 0],
   [80, 0, 0]
];

var SPLASH_COORD = [
   //North Pole: 1
   [0, 0, 1],
   //Top Ring: 2 - 9
   [.816497, 0, .577350],
   [.577350, .577350, .577350],
   [0, .816497, .577350],
   [-.577350, .577350, .577350],
   [-.816497, 0, .577350],
   [-.577350, -.577350, .577350],
   [0, -.816497, .577350],
   [.577350, -.577350, .577350],
   //Equator: 10 - 17
   [1, 0, 0],
   [.707107, .707107, 0],
   [0, 1, 0],
   [-.707107, .707107, 0],
   [-1, 0, 0],
   [-.707107, -.707107, 0],
   [0, -1, 0],
   [.707107, -.707107, 0],
   //Bottom Ring: 18 - 25
   [.816497, 0, -.577350],
   [.577350, .577350, -.577350],
   [0, .816497, -.577350],
   [-.577350, .577350, -.577350],
   [-.816497, 0, -.577350],
   [-.577350, -.577350, -.577350],
   [0, -.816497, -.577350],
   [.577350, -.577350, -.577350],
   //South Pole: 26
   [0, 0, -1]
];

var splashRadius = .2;
for (var i = 0; i < SPLASH_COORD.length; ++i) {
   SPLASH_COORD[i][0] = splashRadius * SPLASH_COORD[i][0];
   SPLASH_COORD[i][1] = splashRadius * SPLASH_COORD[i][1];
   SPLASH_COORD[i][2] = splashRadius * SPLASH_COORD[i][2];
}