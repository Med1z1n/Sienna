const serviceUUID = '4a980001-1cc4-e7c1-c757-f1267dd021e8';
const charUUID = '4a980002-1cc4-e7c1-c757-f1267dd021e8';

const backgrounds = [
    'background.jpg',
    'background2.jpg',
    'background3.jpg',
    'background4.jpg',
    'background5.jpg',
    'background6.png',
    'background7.jpg',
];

let bgIndex = 0; // current background index

let device;
let characteristic;

// Resize text to fit container
function fitTextToBox(element) {
    const parent = element.parentElement;
    let fontSize = 40; // starting font size
    element.style.fontSize = fontSize + "px";

    while ((element.scrollWidth > parent.clientWidth || element.scrollHeight > parent.clientHeight) && fontSize > 10) {
        fontSize -= 1;
        element.style.fontSize = fontSize + "px";
    }
}

// Update message and resize text
function updateMessage(text) {
    const msgLabel = document.getElementById("messageLabel");
    msgLabel.textContent = text;
    fitTextToBox(msgLabel);

    // Cycle background
    document.body.style.backgroundImage = `url('${backgrounds[bgIndex]}')`;
    bgIndex = (bgIndex + 1) % backgrounds.length; // loop through array
}


document.getElementById('connectButton').addEventListener('click', async () => {
    try {
        device = await navigator.bluetooth.requestDevice({
            filters: [{ name: 'Cycler' }],
            optionalServices: [serviceUUID]
        });

        const server = await device.gatt.connect();
        const service = await server.getPrimaryService(serviceUUID);
        characteristic = await service.getCharacteristic(charUUID);

        await characteristic.startNotifications();
        characteristic.addEventListener('characteristicvaluechanged', handleNotification);

        updateMessage("Connected!");
    } catch (error) {
        console.error(error);
        alert("Failed to connect: " + error);
    }
});

function handleNotification(event) {
    const value = event.target.value;
    
    // If your firmware sends strings
    const message = new TextDecoder().decode(value);

    // If your firmware sends numeric codes, you can map them:
    // const code = value.getUint8(0);
    // const message = messages[code];

    updateMessage(message);
}
