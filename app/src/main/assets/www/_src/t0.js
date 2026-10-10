/**
 * Afterface — offline face swap for phone browsers.
 * Portrait is warped onto the clip using MediaPipe landmarks so
 * mouth/eye motion (expression) follows the video.
 */

const FACE_OVAL = [
  10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377,
  152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109,
];
const INTERIOR = [1, 4, 5, 6, 13, 14, 61, 91, 168, 195, 197, 291, 321, 405];
const MAX_SECONDS = 8;
const MAX_EDGE = 480;

const $ = (id) => document.getElementById(id);

const photoInput = $("photoInput");
const videoInput = $("videoInput");
const photoPreview = $("photoPreview");
const videoPreview = $("videoPreview");
const trimSection = $("trimSection");
const trimVideo = $("trimVideo");
const startRange = $("startRange");
const endRange = $("endRange");
const startLabel = $("startLabel");
const endLabel = $("endLabel");
const strengthEl = $("strength");
const expressionEl = $("expression");
const strengthLabel = $("strengthLabel");
const exprLabel = $("exprLabel");
const swapBtn = $("swapBtn");
const cancelBtn = $("cancelBtn");
const statusEl = $("status");
const outCanvas = $("outCanvas");
const resultVideo = $("resultVideo");
const emptyStage = $("emptyStage");
const saveBtn = $("saveBtn");

let photoMesh = null;
let clipFile = null;
let clipUrl = null;
let resultUrl = null;
let landmarker = null;
let abortCtrl = null;
let videoClock = 0;
