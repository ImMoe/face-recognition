const container = document.querySelector(".container");
const video = document.getElementById("video");

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri(location.href + "models"),
  faceapi.nets.faceLandmark68Net.loadFromUri(location.href + "models"),
  faceapi.nets.faceRecognitionNet.loadFromUri(location.href + "models"),
  faceapi.nets.faceExpressionNet.loadFromUri(location.href + "models"),
]).then(startVideo);

function startVideo() {
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then((stream) => (video.srcObject = stream))
    .catch((err) => console.error(err));
}

video.addEventListener("play", () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  container.append(canvas);
  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);
  setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
  }, 100);
});
