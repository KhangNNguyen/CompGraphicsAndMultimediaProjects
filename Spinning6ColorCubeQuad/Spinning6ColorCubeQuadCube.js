/*
 * Course: CS 4722
 * Section: 01
 * Name: Khang Nguyen
 * Professor: Shaw
 * Assignment #: Mod 2 Assignment 2 Part 2
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
var firstColors = true;
var cBuffer;

var vertices = [
    vec3(-0.5, -0.5, 0.5),
    vec3(-0.5, 0.5, 0.5),
    vec3(0.5, 0.5, 0.5),
    vec3(0.5, -0.5, 0.5),
    vec3(-0.5, -0.5, -0.5),
    vec3(-0.5, 0.5, -0.5),
    vec3(0.5, 0.5, -0.5),
    vec3(0.5, -0.5, -0.5),

];



var vertexColors = [
    vec4(0.0, 1.0, 1.0, 1.0),  // cyan
    vec4(0.0, 0.0, 0.0, 1.0),  // black
    vec4(1.0, 0.0, 0.0, 1.0),  // red
    vec4(1.0, 1.0, 0.0, 1.0),  // yellow
    vec4(0.0, 1.0, 0.0, 1.0),  // green
    vec4(1.0, 1.0, 1.0, 1.0),  // white
    vec4(0.0, 0.0, 1.0, 1.0),  // blue
    vec4(1.0, 0.0, 1.0, 1.0),   // magenta

];

var vertexColors2 = [
    vec4(0.2, 0.4, 1.0, 1.0),
    vec4(0.1, 0.2, 0.6, 1.0),  
    vec4(0.8, 0.8, 0.8, 1.0),  
    vec4(0.1, 0.1, 0.2, 1.0),  
    vec4(0.2, 0.4, 0.1, 1.0),  
    vec4(1.0, 1.0, 0.0, 1.0),  
    vec4(1.0, 0.0, 1.0, 1.0),  
    vec4(0.5, 1.0, 1.0, 1.0)
]
var points = [];
var colors = [];
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
    makeCube();


    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);


    // vertex array attribute buffer code goes here
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);


    // color array attribute buffer code goes here
    cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

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
    document.getElementById("cButton").onclick =
        function () {
            firstColors = !firstColors;
            points = [];
            colors = [];
            makeCube();
            gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
        };

    function makeCube() {
        quad(1, 0, 3, 2);
        quad(2, 3, 7, 6);
        quad(3, 0, 4, 7);
        quad(5, 1, 2, 6);
        quad(4, 5, 6, 7);
        quad(5, 4, 0, 1);
    }

    function quad(a, b, c, d) {
        let indices = [a, b, c, a, c, d];
        for (let i = 0; i < indices.length; ++i) {
            points.push(vertices[indices[i]]);

            // for solid colored faces
            if (firstColors) {
                colors.push(vertexColors[c]);
            } else {
                colors.push(vertexColors2[c]);
            }        }
    }

    render();
}

function render() {
    // render code goes here
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    theta[axis] += 2;
    gl.uniform3fv(thetaLoc, theta);
    gl.drawArrays(gl.TRIANGLES, 0, points.length);
    requestAnimFrame(render);
}