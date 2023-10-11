/*
 * Course: CS 4722
 * Section: 01
 * Name: Khang Nguyen
 * Professor: Shaw
 * Assignment #: Mod 2 Assignment 2 Part 1
 */

"use strict";

var canvas;
var gl;

var axis = 0;
const xAxis = 0;
const yAxis = 1;
const zAxis = 2;
var theta = vec3(45, 45, 45);
var thetaLoc;

var vertices = [
    vec3(-0.5, -0.5, 0.5),
    vec3(-0.5, 0.5, 0.5),
    vec3(0.5, 0.5, 0.5),
    vec3(0.5, -0.5, 0.5),
    vec3(-0.5, -0.5, -0.5),
    vec3(-0.5, 0.5, -0.5),
    vec3(0.5, 0.5, -0.5),
    vec3(0.5, -0.5, -0.5),

    vec3(-0.5, -0.5, 0.5),
    vec3(-0.5, 0.5, 0.5),
    vec3(0.5, 0.5, 0.5),
    vec3(0.5, -0.5, 0.5),
    vec3(-0.5, -0.5, -0.5),
    vec3(-0.5, 0.5, -0.5),
    vec3(0.5, 0.5, -0.5),
    vec3(0.5, -0.5, -0.5),

    vec3(-0.5, -0.5, 0.5),
    vec3(-0.5, 0.5, 0.5),
    vec3(0.5, 0.5, 0.5),
    vec3(0.5, -0.5, 0.5),
    vec3(-0.5, -0.5, -0.5),
    vec3(-0.5, 0.5, -0.5),
    vec3(0.5, 0.5, -0.5),
    vec3(0.5, -0.5, -0.5)
];


var vertexColors = [
    vec4(1.0, 0.0, 0.0, 1.0),  // red
    vec4(1.0, 0.0, 0.0, 1.0),  // red
    vec4(1.0, 0.0, 0.0, 1.0),  // red
    vec4(1.0, 0.0, 0.0, 1.0),  // red

    vec4(1.0, 1.0, 0.0, 1.0),  // yellow
    vec4(1.0, 1.0, 0.0, 1.0),  // yellow
    vec4(1.0, 1.0, 0.0, 1.0),  // yellow
    vec4(1.0, 1.0, 0.0, 1.0),  // yellow

    vec4(0.0, 1.0, 0.0, 1.0),  // green
    vec4(0.0, 1.0, 0.0, 1.0),  // green
    vec4(0.0, 0.0, 1.0, 1.0),  // blue
    vec4(0.0, 0.0, 1.0, 1.0),  // blue

    vec4(0.0, 1.0, 0.0, 1.0),  // green
    vec4(0.0, 1.0, 0.0, 1.0),  // green
    vec4(0.0, 0.0, 1.0, 1.0),  // blue
    vec4(0.0, 0.0, 1.0, 1.0),  // blue

    vec4(1.0, 0.0, 1.0, 1.0),  // magenta
    vec4(0.0, 1.0, 1.0, 1.0),  // cyan
    vec4(0.0, 1.0, 1.0, 1.0),  // cyan
    vec4(1.0, 0.0, 1.0, 1.0),  // magenta

    vec4(1.0, 0.0, 1.0, 1.0),  // magenta
    vec4(0.0, 1.0, 1.0, 1.0),  // cyan
    vec4(0.0, 1.0, 1.0, 1.0),  // cyan
    vec4(1.0, 0.0, 1.0, 1.0),  // magenta


   /* vec4(0.0, 0.0, 0.0, 1.0),  // black
    vec4(1.0, 0.0, 0.0, 1.0),  // red
    vec4(1.0, 1.0, 0.0, 1.0),  // yellow
    vec4(0.0, 1.0, 0.0, 1.0),  // green
    vec4(0.0, 0.0, 1.0, 1.0),  // blue
    vec4(1.0, 0.0, 1.0, 1.0),  // magenta
    vec4(1.0, 1.0, 1.0, 1.0),  // white
    vec4(0.0, 1.0, 1.0, 1.0)   // cyan

    */


];

var indices = [
    1, 0, 3,
    3, 2, 1,
    2+8, 3+8, 7+8,
    7+8, 6+8, 2+8,
    3+16, 0+16, 4+16,
    4+16, 7+16, 3+16,
    6+16, 2+16, 1+16,
    1+16, 5+16, 6+16,
    4, 5, 6,
    6, 7, 4,
    5+8, 4+8, 0+8,
    0+8, 1+8, 5+8
];

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2', {});
    if (!gl) { alert("WebGL2 isn't available"); }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // array element buffer for vertex indices

    let iBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW);

    // vertex array attribute buffer code goes here
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);


    // color array attribute buffer code goes here
    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertexColors), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    // thetaLoc uniform variable code goes here
    thetaLoc = gl.getUniformLocation(program, "theta");
    gl.uniform3fv(thetaLoc, theta);

    document.getElementById("xButton").onclick =
        function () {
            axis = xAxis;
        };
    document.getElementById("yButton").onclick =
        function () {
            axis = yAxis;
        };
    document.getElementById("zButton").onclick =
        function () {
            axis = zAxis;
        };

    render();
}

function render() {
    // render code goes here
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    theta[axis] += 2;
    gl.uniform3fv(thetaLoc, theta);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0);
    requestAnimFrame(render);
}