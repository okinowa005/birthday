document.addEventListener('DOMContentLoaded', () => {
    const candles = document.querySelectorAll('.candle');
    const message = document.getElementById('message');

    // Use Web Audio API to detect loud sound
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            const audioContext = new AudioContext();
            const audioInput = audioContext.createMediaStreamSource(stream);
            const analyser = audioContext.createAnalyser();
            audioInput.connect(analyser);
            analyser.fftSize = 256;

            const dataArray = new Uint8Array(analyser.frequencyBinCount);

            function detectBlow() {
                analyser.getByteFrequencyData(dataArray);
                const volume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

                if (volume > 50) { // Adjust this threshold based on testing
                    candles.forEach(candle => candle.style.display = 'none');
                    message.style.display = 'flex';
                }

                requestAnimationFrame(detectBlow);
            }

            detectBlow();
        })
        .catch(error => {
            console.error('Error accessing microphone', error);
        });
});
