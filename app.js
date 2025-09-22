const messages = ["Hello", "World", "nRF5340", "Nordic Rocks"]; // optional mapping if using numeric codes
const serviceUUID = '4a980001-1cc4-e7c1-c757-f1267dd021e8';
const charUUID = '4a980002-1cc4-e7c1-c757-f1267dd021e8';

let device;
let characteristic;

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

        document.getElementById('messageLabel').innerText = "Connected!";
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

    document.getElementById('messageLabel').innerText = message;
}
