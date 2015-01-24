var g_groundHeight = 57;
var g_runnerStartX = 160;

var GRABABLE_MASK_BIT = 1<<31;
var NOT_GRABABLE_MASK = ~GRABABLE_MASK_BIT;
var FLUID_DENSITY = 0.00014;
var FLUID_DRAG = 2.0;
var WATER_HEIGHT = 150;
var SCALE           = 0.3;