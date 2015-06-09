var BRICK_POLY = [
	["top", 1, 2, 3, 4],
	["bottom", 8, 7, 6, 5],
   ["sideUp", 1, 5, 6, 2],
   ["sideDown", 4, 3, 7, 8],
   ["sideLeft", 3, 2, 6, 7],
   ["sideRight", 1, 4, 8, 5],
];

var FLOOR_POLY = [
   ["floor", 1, 2, 3, 4]
];

var WATER_POLY = [
   ["floor", 1, 2, 3, 4]
];

var SPLASH_POLY = [
   //Top Polys
   ["Row1Chunk1", 1, 2, 3],
   ["Row1Chunk2", 1, 3, 4],
   ["Row1Chunk3", 1, 4, 5],
   ["Row1Chunk4", 1, 5, 6],
   ["Row1Chunk5", 1, 6, 7],
   ["Row1Chunk6", 1, 7, 8],
   ["Row1Chunk7", 1, 8, 9],
   ["Row1Chunk8", 1, 9, 2],
   //Top-Mid Polys
   ["Row2Chunk1", 2, 10, 11, 3],
   ["Row2Chunk2", 3, 11, 12, 4],
   ["Row2Chunk3", 4, 12, 13, 5],
   ["Row2Chunk4", 5, 13, 14, 6],
   ["Row2Chunk5", 6, 14, 15, 7],
   ["Row2Chunk6", 7, 15, 16, 8],
   ["Row2Chunk7", 8, 16, 17, 9],
   ["Row2Chunk8", 9, 17, 10, 2],
   //Bottom-Mid Polys
   ["Row3Chunk1", 10, 18, 19, 11],
   ["Row3Chunk2", 11, 19, 20, 12],
   ["Row3Chunk3", 12, 20, 21, 13],
   ["Row3Chunk4", 13, 21, 22, 14],
   ["Row3Chunk5", 14, 22, 23, 15],
   ["Row3Chunk6", 15, 23, 24, 16],
   ["Row3Chunk7", 16, 24, 25, 17],
   ["Row3Chunk8", 17, 25, 18, 10],
   //Bottom Polys
   ["Row4Chunk1", 18, 26, 19],
   ["Row4Chunk1", 19, 26, 20],
   ["Row4Chunk1", 20, 26, 21],
   ["Row4Chunk1", 21, 26, 22],
   ["Row4Chunk1", 22, 26, 23],
   ["Row4Chunk1", 23, 26, 24],
   ["Row4Chunk1", 24, 26, 25],
   ["Row4Chunk1", 25, 26, 18],
];

var BAZOOKA_POLY = [
    //"caps"
    ["BackFace", 1, 3, 4, 2],
    ["FrontFace", 5, 7, 8, 6],
    //looking from bottom
    ["bottom", 3, 7, 8, 4],
    //looking from top
    ["top", 1, 2, 6, 5],
    //looking from .5 side
    ["side", 2, 4, 8, 6],
    //looking from -.5 side
    ["side", 1, 3, 7, 5],
    //grips .5 side
    ["shoulder", 17, 10, 12, 18],
    ["hand", 21, 14, 16, 22],
    //grips -.5 side
    ["shoulder", 19, 9, 11, 20],
    ["hand", 23, 13, 15, 24],
    //grips from back
    ["shoulder", 19, 9, 10, 17],
    ["hand", 23, 13, 14, 21],
    //grips from front
    ["shoulder", 18, 12, 11, 20],
    ["hand", 22, 16, 15, 24],
    //grips looking from bottom
    ["shoulder", 10, 9, 11, 12],
    ["hand", 14, 13, 15, 16]
];