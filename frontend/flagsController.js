; (function () {
    const toilets = document.querySelectorAll('.toi');

    function responseHandler(response) {
        for (let i in response) {
            if (response[i].state === "busy") {
                toilets[i - 1].classList.remove("free");
                toilets[i - 1].classList.add("busy");
            } else {
                toilets[i - 1].classList.remove("busy");
                toilets[i - 1].classList.add("free");
            }
        }
    }

    function wsconnect() {
        const ws = new WebSocket(`ws://${window.location.host}/notifier/`);

        ws.onmessage = function (event) {
            let response = JSON.parse(event.data);
            if (window.debug) {
                console.log(response);
            }
            responseHandler(response);
        };

        ws.onclose = function (e) {
            if (window.debug) {
                console.log('Socket is closed. Reconnect will be attempted in 5 seconds.', e.reason);
            }
            setTimeout(function () {
                wsconnect();
            }, 5000);
        };

        ws.onerror = function (err) {
            if (window.debug) {
                console.error('Socket encountered error: ', err.message, 'Closing socket');
            }
            ws.close();
        };
    }

    wsconnect();
})();