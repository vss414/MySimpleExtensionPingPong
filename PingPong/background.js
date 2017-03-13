function appendMessage(text) {
    document.getElementById('response').innerHTML += "<p>" + text + "</p>";
}

function onNativeMessage(message) {
    appendMessage("Received message: <b>" + JSON.stringify(message) + "</b>");
}

function onDisconnected() {
    appendMessage("Failed to connect: " + chrome.runtime.lastError.message);
}

function send(sender) {

    sender.sendNativeMessage('com.example.ping_pong', {text: "ping"},
        function(response) {
            appendMessage("Received message from sendNativeMessage function: <b>" + JSON.stringify(response) + "</b>");
        });

    var port = sender.connectNative("com.example.ping_pong");

    port.onMessage.addListener(onNativeMessage);
    port.onDisconnect.addListener(onDisconnected);
    port.postMessage({text: "ping"});

    appendMessage('Send message: <b>ping</b>');
}

function check(obj) {
    return typeof obj !== "undefined" &&
        typeof obj.runtime !== "undefined" &&
        typeof obj.runtime.connectNative !== "undefined" &&
        typeof obj.runtime.connectNative === "function"
}

function connect() {

    if (typeof browser !== "undefined" && check(browser)) {
        appendMessage("browser.runtime.connectNative exist");
        send(browser.runtime);
    } else {
        appendMessage("browser.runtime.connectNative not exist");
        if (typeof chrome !== "undefined" && check(chrome)) {
            appendMessage("chrome.runtime.connectNative exist");
            send(chrome.runtime);
        } else {
            appendMessage("chrome.runtime.connectNative not exist");
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('connect-button').addEventListener('click', connect);
});

