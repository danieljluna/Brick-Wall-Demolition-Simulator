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
   [30, 50, 0],
   [-30, 50, 0],
   [-30, 0, 0],
   [30, 0, 0]
];

var SPLASH_COORD = [
   //North Pole: 1
   [0, 0, 1],
   //Top Ring: 2 - 9
   [1.154701, 0, .577350],
   [.577350, .577350, .577350],
   [0, 1.154701, .577350],
   [-.577350, .577350, .577350],
   [-1.154701, 0, .577350],
   [-.577350, -.577350, .577350],
   [0, -1.154701, .577350],
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
   [1.154701, 0, -.577350],
   [.577350, .577350, -.577350],
   [0, 1.154701, -.577350],
   [-.577350, .577350, -.577350],
   [-1.154701, 0, -.577350],
   [-.577350, -.577350, -.577350],
   [0, -1.154701, -.577350],
   [.577350, -.577350, -.577350],
   //South Pole: 26
   [0, 0, -1]
];
