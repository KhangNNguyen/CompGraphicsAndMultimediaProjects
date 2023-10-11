﻿/*
 * Course: CS 4722
 * Section: 01
 * Name: Khang Nguyen
 * Professor: Shaw
 * Assignment #: Module 3 Assignment 1 Part 2
 */
"use strict";

var canvas;
var gl;

var maxNumVertices = 200;
var index = 0;

var cindex = 0;

var colors = [
    vec4(0.0, 1.0, 0.6, 1.0),  // Green
    vec4(1.0, 0.0, 0.0, 1.0),  // red
    vec4(1.0, 1.0, 0.0, 1.0),  // yellow
    vec4(0.0, 1.0, 0.0, 1.0),  // green
    vec4(0.0, 0.0, 1.0, 1.0),  // blue
    vec4(1.0, 0.0, 1.0, 1.0),  // magenta
    vec4(0.0, 1.0, 1.0, 1.0)   // cyan
];

var t;
var numPolygons = 0;
var numIndices = [];
numIndices[0] = 0;
var start = [0];

var bufferId;
var cBufferId;

var useBlackLoc;

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2', {});
    if (!gl) { alert("WebGL2 isn't available"); }

    canvas.addEventListener("mousedown", function (event) {
        let x = -1 + 2 * event.offsetX / canvas.width;
        let y = 1 - 2 * event.offsetY / canvas.height;
        addPoint(x, y);
        render();
    });

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.8, 0.8, 0.8, 1.0);

    //
    //  Load shaders and initialize attribute buffers
    //
    let program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, 8 * maxNumVertices, gl.STATIC_DRAW);
    let vPos = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPos, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPos);

    cBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, 16 * maxNumVertices, gl.STATIC_DRAW);
    let vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    document.getElementById("menuval").onchange =
        function (event) {
            cindex = Number(document.getElementById('menuval').value);
        };


    document.getElementById("buttonval").onclick =
        function () {
            numPolygons++;
            numIndices[numPolygons] = 0;
            start[numPolygons] = index;
            render();
        };

    useBlackLoc = gl.getUniformLocation(program, "useBlack");
    gl.uniform1i(useBlackLoc, false);     // For int or bool val

}

function addPoint(x, y) {
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    let t = vec2(x, y);
    gl.bufferSubData(gl.ARRAY_BUFFER, 8 * index, flatten(t));

    gl.bindBuffer(gl.ARRAY_BUFFER, cBufferId);
    t = vec4(colors[cindex]);
    gl.bufferSubData(gl.ARRAY_BUFFER, 16 * index, flatten(t));

    numIndices[numPolygons]++;
    index++;
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    for (let i = 0; i < numPolygons; i++) {
        gl.drawArrays(gl.TRIANGLE_STRIP, start[i], numIndices[i]);

        gl.uniform1i(useBlackLoc, true);

        for (let j = start[i]; j < start[i] + numIndices[i] - 2; j++) {
            gl.drawArrays(gl.LINE_LOOP, j, 3);

        }
        gl.uniform1i(useBlackLoc, false);
    }
    gl.drawArrays(gl.LINE_STRIP, start[numPolygons], numIndices[numPolygons]);
}