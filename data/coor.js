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

var BAZOOKA_COORD = [
    //barrel farthest from wall 1-4
    [-.5, -9, 3 ],
    [.5, -9 , 3],
    [-.5, -9, 2],
    [.5, -9, 2],
    //barrel closest to wall 5-8
    [-.5, -3, 3],
    [.5, -3, 3],
    [-.5, -3, 2],
    [.5, -3, 2],
    //bottom of shoulder stock closest to back 9-12
    [-.5, -6, 0],
    [.5, -6, 0],
    [-.5, -5.5, 0],
    [.5, -5.5, 0],
    //bottom of hand grip closest to wall 13-16
    [-.5, -4, 0],
    [.5, -4, 0],
    [-.5, -3.5, 0],
    [.5, -3.5, 0],
    //where shoulder stock meets barrel 17-20
    [.5, -6, 2],
    [.5, -5.5, 2],
    [-.5, -6, 2],
    [-.5, -5.5, 2],
    //where hand grip meets barrel 21-24
    [.5, -4, 2],
    [.5, -3.5, 2],
    [-.5, -4, 2],
    [-.5, -3.5, 2]
];

var bazookaScale = .8;
for (var i = 0; i < BAZOOKA_COORD.length; ++i) {
   BAZOOKA_COORD[i][0] = bazookaScale * (BAZOOKA_COORD[i][0] - 0);
   BAZOOKA_COORD[i][1] = bazookaScale * (BAZOOKA_COORD[i][1] + 3);
   BAZOOKA_COORD[i][2] = bazookaScale * (BAZOOKA_COORD[i][2] - 2.5);
}