import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';

export function VideoStream() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [visitorCount, setVisitorCount] = useState<number>(0);
  // Store known face descriptors without triggering re-renders.
  const knownDescriptorsRef = useRef<faceapi.Float32Array[]>([]);
  // Similarity threshold for face matching. Lower values are stricter.
  const threshold = 0.6;

  // Load face-api.js models from the public "/models" folder.
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models';
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
    };
    loadModels().then(startVideo);
  }, []);

  // Set up the webcam stream.
  const startVideo = async () => {
    const video = videoRef.current;
    if (video) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
        video.srcObject = stream;
        video.play().catch(err => console.error('Play error:', err));
      } catch (err) {
        console.error('Error accessing webcam:', err);
      }
    }
  };

  // Process video frames for face detection every second.
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    const processFrame = async () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (video && canvas && video.readyState >= 2) {
        const displaySize = { width: video.videoWidth, height: video.videoHeight };
        faceapi.matchDimensions(canvas, displaySize);
        const detections = await faceapi
          .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptors();
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          for (const detection of resizedDetections) {
            const box = detection.detection.box;
            // Draw bounding box around detected face.
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 2;
            ctx.strokeRect(box.x, box.y, box.width, box.height);

            // Compare current face descriptor with known ones.
            const currentDescriptor = detection.descriptor;
            let isNewVisitor = true;
            for (const known of knownDescriptorsRef.current) {
              const distance = faceapi.euclideanDistance(known, currentDescriptor);
              if (distance < threshold) {
                isNewVisitor = false;
                break;
              }
            }
            if (isNewVisitor) {
              knownDescriptorsRef.current.push(currentDescriptor);
              setVisitorCount(prev => prev + 1);
              // Capture a screenshot from the video stream.
              const screenshot = captureScreenshot(video);
              console.log('New visitor detected. Screenshot:', screenshot);
            }
          }
        }
      }
    };

    intervalId = setInterval(processFrame, 1000); // Process a frame every second.
    return () => clearInterval(intervalId);
  }, []);

  // Helper function to capture a screenshot from the video element.
  const captureScreenshot = (video: HTMLVideoElement): string => {
    const screenshotCanvas = document.createElement('canvas');
    screenshotCanvas.width = video.videoWidth;
    screenshotCanvas.height = video.videoHeight;
    const sctx = screenshotCanvas.getContext('2d');
    if (sctx) {
      sctx.drawImage(video, 0, 0, screenshotCanvas.width, screenshotCanvas.height);
      return screenshotCanvas.toDataURL('image/png');
    }
    return '';
  };

  return (
    <div style={{ position: 'relative', maxWidth: '720px', margin: 'auto' }}>
      <h1>Visitor Count: {visitorCount}</h1>
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        style={{ width: '100%', height: 'auto' }}
      />
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', top: 0, left: 0 }}
      />
    </div>
  );
};

export default VideoStream;
