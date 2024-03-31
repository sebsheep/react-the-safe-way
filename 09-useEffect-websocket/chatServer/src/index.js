// @ts-check

const WebSocket = require("ws");
const { v4: uuidv4 } = require("uuid");

const PORT = 4242;
// Create a WebSocket server
const wss = new WebSocket.Server({ port: PORT });

/** @type {Map<string, WebSocket>} */
const connections = new Map();

/**
 * @param {string} data
 * @param {undefined|string} [dontSendTo=undefined]
 */
function broadcast(data, dontSendTo = undefined) {
  connections.forEach((client, clientId) => {
    if (dontSendTo !== clientId && client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

// Event listener for when a client connects
wss.on("connection", function connection(ws) {
  // Add the new connection to the set
  const currentId = uuidv4();
  const currentName = generateFunnyName(currentId);
  connections.set(currentId, ws);
  console.log(`+++ ${currentName}[${currentId}] joined!`);
  simulateNetworkDelay(() => {
    ws.send(
      JSON.stringify({
        kind: "Welcome",
        userId: currentId,
        userName: currentName,
      })
    );
    broadcast(
      JSON.stringify({
        kind: "Joined",
        userId: currentId,
        userName: currentName,
      }),
      currentId
    );
  });

  // Event listener for when a client sends a message
  ws.on("message", function incoming(message) {
    console.log(`[${currentName} - ${currentId.slice(0, 5)}] ${message}`);
    simulateNetworkDelay(() =>
      broadcast(
        JSON.stringify({
          kind: "Message",
          userId: currentId,
          userName: currentName,
          message: JSON.parse(message.toString()),
        })
      )
    );
  });

  // Event listener for when a client disconnects
  ws.on("close", function () {
    console.log(`--- ${currentName}[${currentId}] left!`);
    simulateNetworkDelay(() =>
      broadcast(
        JSON.stringify({
          kind: "Left",
          userId: currentId,
          userName: currentName,
        })
      )
    );
    connections.delete(currentId);
  });
});

function generateFunnyName(uuid) {
  const words = [
    "Happy",
    "Angry",
    "Sleepy",
    "Sneaky",
    "Giggly",
    "Dizzy",
    "Cheeky",
    "Wacky",
    "Fluffy",
    "Silly",
    "Cranky",
    "Zany",
    "Fuzzy",
    "Bouncy",
    "Goofy",
    "Chubby",
    "Squishy",
    "Spooky",
    "Snuggly",
    "Whizzy",
    "Dopey",
    "Bubbly",
    "Jolly",
    "Sassy",
    "Grumpy",
    "Clumsy",
    "Merry",
    "Boozy",
    "Wobbly",
    "Nerdy",
    "Curious",
    "Zippy",
    "Droopy",
    "Tipsy",
    "Dreamy",
    "Fancy",
    "Rowdy",
    "Nifty",
    "Hairy",
    "Gloomy",
  ];

  const animals = [
    "Alligator",
    "Cat",
    "Dog",
    "Elephant",
    "Giraffe",
    "Hippo",
    "Kangaroo",
    "Lion",
    "Monkey",
    "Ostrich",
    "Penguin",
    "Raccoon",
    "Sloth",
    "Tiger",
    "Unicorn",
    "Vampire",
    "Yeti",
    "Zebra",
    "Dragon",
    "Narwhal",
    "Hamster",
    "Bear",
    "Fox",
    "Deer",
    "Dolphin",
    "Panda",
    "Polar Bear",
    "Whale",
    "Gorilla",
    "Rhino",
    "Cheetah",
    "Seal",
    "Eagle",
    "Rabbit",
    "Octopus",
    "Turtle",
    "Cobra",
    "Jaguar",
    "Wolf",
    "Puma",
    "Otter",
    "Lemur",
    "Hedgehog",
    "Koala",
    "Porcupine",
  ];

  // Use UUID to ensure consistency
  const seed = parseInt(uuid.replace(/-/g, "").slice(0, 10), 16);
  const randomWordIndex = seed % words.length;
  const randomAnimalIndex = (seed * 13) % animals.length;

  return `${words[randomWordIndex]} ${animals[randomAnimalIndex]}`;
}

function simulateNetworkDelay(funct) {
  setTimeout(funct, 500);
}
console.log(`Listening websockets on port ${PORT}`);
