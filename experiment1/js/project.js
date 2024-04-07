const fillers = {
  planetname: ["Tregia","Salabop","K02V46N325","Loojoogo", "Porpature", "Kraleta", "Vivus","Gomba Bomba", "Silili","Magipakus","Subalee","Hooyaee", "Klugator", "Binnerdoy", "Gabagos"],
  sunpre: ["Ghoo", "Sou","Kla", "Jout", "Vlom", "Res", "Monpo", "Yelli", "Bimmble"],
  sunpost: ["per","tia", "nome", "yallis","neme", "rapus",],
  mooncount: ["1", "5", "25", "94", "67", "32", "15", "a heckuva lot of", "709", "614", "320", "2", "41", "80", "3", "7", "21", "17"],
  moontype: ["spongey", "rocky", "gaseous", "wacky", "icy", "watery", "large", "cheesy", "mega", "flat", "spikey"],
  color: ["blue", "silver", "golden", "red", "orange", "yellow", "pink", "purple", "maroon", "gamboge", "skobeloff", "puce", "caponata"],
  elements: ["hydrogen monoxide", "mercury", "argon", "neon", "americium", "radium", "copper", "bromine", "tungsten", "sulfur"],
  land: ["cheese", "balloons", "soap", "wool", "leaves", "wood", "dust", "skulls", "sand", "flesh", "moss", "marbles", "marshmellows", "granite", "whales", "bricks", "crystals", "mushrooms",],
  mass1: ["thousand foot deep chasms", "volcanoes", "spacious caverns", "mountains", "giant spikes", "blocks of ice", "totem poles"],
  mass2: ["luminous caverns", "electrically charged floating rocks", "floating islands", "train tracks", "abandoned facilities", "giant robots", "candy lands", "blocks of chicken"],
  liquid: ["battery acid", "chicken noodle soup", "soy sauce", "lava", "liquid helium", "lighter fluid", "apple juice", "beer", "blood", "oil", "tomato juice"],
  animal1: ["pikachugs", "goobuggers", "krackleblackers", "mimbie", "3 headed sea cucumbers", "dranacs", "yammyyams", "atersnaps", "1 legged lions"],
  animal2: ["nartels", "popats", "saps", "regular mongooses", "10ft elephants", "magical laser dolphins", "purple dinosaurs", "opipokes", "warmer bears"],
};

const template = `In the outer reaches of the known universe lies a strange, yet fascinating planet called $planetname. It orbits the sun, $sunpre$sunpost, one of the brightest stars known to exist. This planet is known to have $mooncount $moontype moons that orbit it.

As you would enter the atmosphere, you would notice the $color tint in the sky. This is caused by the large amount of $elements in the atmosphere. On the ground, there are $land as far as the eye can see, stretching out for miles. This beautiful landscape is complimented by the wide variety of natural $mass1 and $mass2. 

The weather is usually mellow, but sometimes $liquid will rain from the sky; this liquid creates the lakes, rivers, and oceans. This planet sounds like a very habitable planet from everything discussed, but the fauna on this planet make it very dangerous. Be careful for wild $animal1 and $animal2 because they will rip you to shreds the moment they see movement. 
`;


// STUDENTS: You don't need to edit code below this line.

const slotPattern = /\$(\w+)/;

function replacer(match, name) {
  let options = fillers[name];
  if (options) {
    return options[Math.floor(Math.random() * options.length)];
  } else {
    return `<UNKNOWN:${name}>`;
  }
}

function generate() {
  let story = template;
  while (story.match(slotPattern)) {
    story = story.replace(slotPattern, replacer);
  }

  /* global box */
  $("#box").text(story);
}

/* global clicker */
$("#clicker").click(generate);

generate();
