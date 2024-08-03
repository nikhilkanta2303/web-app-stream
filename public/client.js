
const video = document.getElementById('video');
const socket = io();

let pc = new RTCPeerConnection();

// Listen for the offer from the server
socket.on('offer', async (offer) => {
    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    socket.emit('answer', answer);
});

// Listen for ICE candidates from the server
socket.on('candidate', (candidate) => {
    pc.addIceCandidate(new RTCIceCandidate(candidate));
});

// Add the video stream to the video element
pc.ontrack = (event) => {
    video.srcObject = event.streams[0];
};

// ICE candidate event handler
pc.onicecandidate = (event) => {
    if (event.candidate) {
        socket.emit('candidate', event.candidate);
    }
};
