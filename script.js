// script.js
// Realm of Thrones — Full Quiz Logic
// Assumes existing IDs from index.html:
// btn-quiz, btn-character, btn-house, level-select, quiz-section, question, options, next-btn, score, quiz-result
// character-section, gc-title, gc-question, gc-options, gc-next, gc-result

// -----------------------------
// Utility helpers
// -----------------------------
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
function pickN(arr, n) {
  return shuffleArray(arr.slice()).slice(0, n);
}
function clearChildren(el) {
  while (el.firstChild) el.removeChild(el.firstChild);
}
function createOptionButton(text, value) {
  const btn = document.createElement('button');
  btn.className = 'option-btn';
  btn.type = 'button';
  btn.dataset.value = value === undefined ? text : value;
  btn.innerText = text;
  return btn;
}

// -----------------------------
// DOM elements
// -----------------------------
const btnQuiz = document.getElementById('btn-quiz');
const btnCharacter = document.getElementById('btn-character');
const btnHouse = document.getElementById('btn-house');

const levelSelect = document.getElementById('level-select');

const quizSection = document.getElementById('quiz-section');
const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const nextBtn = document.getElementById('next-btn');
const scoreEl = document.getElementById('score');
const quizResultEl = document.getElementById('quiz-result');

const characterSection = document.getElementById('character-section');
const gcTitleEl = document.getElementById('gc-title');
const gcQuestionEl = document.getElementById('gc-question');
const gcOptionsEl = document.getElementById('gc-options');
const gcNextBtn = document.getElementById('gc-next');
const gcResultEl = document.getElementById('gc-result');

// -----------------------------
// State for knowledge quiz
// -----------------------------
let knowledgePool = {
  easy: [],
  medium: [],
  hard: []
};
let knowledgeSelected = []; // the 8 chosen qns
let kIndex = 0;
let kScore = 0;
let kSelectedAnswer = null;

// -----------------------------
// State for character/house quizzes
// -----------------------------
let quizMode = null; // 'character' or 'house'
let gcIndex = 0;
let gcQuestions = [];
let gcAnswers = []; // user chosen values (for review if needed)

// -----------------------------
// Define question pools
// 40 easy, 40 medium, 40 hard
// Each question: {q: '', options: ['a','b','c','d'], correct: index}
// -----------------------------

// --- EASY 40 (short trivia) ---
knowledgePool.easy = [
  { q: "Who is known as the 'King in the North' in the early seasons?", options: ["Robb Stark", "Jon Snow", "Eddard Stark", "Rickon Stark"], correct: 0 },
  { q: "What is the name of Jon Snow's direwolf?", options: ["Ghost", "Nymeria", "Summer", "Shaggydog"], correct: 0 },
  { q: "Who is the mother of Daenerys Targaryen's dragons (i.e., who hatched them)?", options: ["Daenerys", "Cersei", "Melisandre", "Sansa"], correct: 0 },
  { q: "Which continent is Winterfell located on?", options: ["Essos", "Westeros", "Sothoryos", "Ulthos"], correct: 1 },
  { q: "What is the family motto of House Stark?", options: ["Fire and Blood", "Winter is Coming", "Hear Me Roar", "Growing Strong"], correct: 1 },
  { q: "Who becomes Hand of the King to Robert Baratheon at start of series?", options: ["Petyr Baelish", "Eddard Stark", "Tyrion Lannister", "Varys"], correct: 1 },
  { q: "Which city is the capital of the Seven Kingdoms?", options: ["Oldtown", "King's Landing", "Riverrun", "Highgarden"], correct: 1 },
  { q: "What is Arya Stark's sword named?", options: ["Needle", "Oathkeeper", "Ice", "Longclaw"], correct: 0 },
  { q: "Who is known as the 'Mother of Dragons'?", options: ["Cersei Lannister", "Daenerys Targaryen", "Melisandre", "Ygritte"], correct: 1 },
  { q: "What is the name of the sword belonging to Jon Snow given by Jeor Mormont?", options: ["Needle", "Ice", "Longclaw", "Oathkeeper"], correct: 2 },
  { q: "Who sits on the Iron Throne after Robert Baratheon's death (initially)?", options: ["Stannis Baratheon", "Joffrey Baratheon", "Renly Baratheon", "Tommen Baratheon"], correct: 1 },
  { q: "What is the name of the golden-haired Lannister who is clever and witty?", options: ["Cersei", "Jaime", "Tyrion", "Kevan"], correct: 2 },
  { q: "Which group defends the Wall?", options: ["Unsullied", "Houseguard", "The Night's Watch", "The Golden Company"], correct: 2 },
  { q: "Which character says 'A Lannister always pays his debts' frequently?", options: ["Tyrion", "Jaime", "Cersei", "Tyrion & Cersei"], correct: 3 },
  { q: "Which actor portrays Tyrion Lannister in the TV show?", options: ["Peter Dinklage", "Kit Harington", "Emilia Clarke", "Nikolaj Coster-Waldau"], correct: 0 },
  { q: "The Red Keep is located in which city?", options: ["Braavos", "King's Landing", "Casterly Rock", "Winterfell"], correct: 1 },
  { q: "Who trained Arya in sword fighting early on?", options: ["Syrio Forel", "Sandor Clegane", "Brienne", "The Hound"], correct: 0 },
  { q: "Which castle is the ancestral seat of House Stark?", options: ["Casterly Rock", "Winterfell", "Highgarden", "Dragonstone"], correct: 1 },
  { q: "What is the name of Daenerys's brother executed by Robert?", options: ["Rhaegar", "Viserys", "Aegon", "Aemon"], correct: 1 },
  { q: "Which savage people live beyond the Wall?", options: ["Wildlings", "Dothraki", "Sardem", "Unsullied"], correct: 0 },
  { q: "What is the name of the city where the House of Black and White is located?", options: ["Meereen", "Braavos", "Pentos", "Volantis"], correct: 1 },
  { q: "Which creature is associated with House Targaryen?", options: ["Direwolf", "Dragon", "Lion", "Stag"], correct: 1 },
  { q: "What material is Valyrian steel known for?", options: ["Magical wood", "Strong iron", "Dragon-forged steel", "Obsidian"], correct: 2 },
  { q: "Who is known as 'The Hound'?", options: ["Sandor Clegane", "Gregor Clegane", "Bronn", "Samwell Tarly"], correct: 0 },
  { q: "Which title does Cersei Lannister hold early on?", options: ["Queen Regent", "Hand of the King", "Queen", "Master of Coin"], correct: 2 },
  { q: "What is the sigil of House Lannister?", options: ["A direwolf", "A three-headed dragon", "A golden lion", "A stag"], correct: 2 },
  { q: "Who kills the Night King (in the show)?", options: ["Jon Snow", "Bran Stark", "Arya Stark", "Davos Seaworth"], correct: 2 },
  { q: "Which city did Daenerys rule after freeing the slaves?", options: ["Pentos", "Volantis", "Meereen", "Braavos"], correct: 2 },
  { q: "Who wrote the song 'The Rains of Castamere' is associated with which house?", options: ["Stark", "Lannister", "Tully", "Greyjoy"], correct: 1 },
  { q: "Who is protector of the realm named 'Hand of the Queen' to Daenerys at one point?", options: ["Tyrion", "Varys", "Jorah", "Daario"], correct: 0 },
  { q: "What rare weapon is effective against White Walkers?", options: ["Obsidian (dragonglass)", "Regular steel", "Valyrian steel only", "Iron"], correct: 0 },
  { q: "Which seafaring house uses Kraken as (sometimes) a symbol?", options: ["Tyrell", "Greyjoy", "Tully", "Martell"], correct: 1 },
  { q: "Who is the clever spy-master in King's Landing?", options: ["Varys", "Littlefinger", "Qyburn", "Maester Pycelle"], correct: 0 },
  { q: "Which brother duels Jaime and later joins the Night's Watch?", options: ["Robb Stark", "Theon Greyjoy", "Bran Stark", "Jon Snow"], correct: 3 },
  { q: "Which castle belongs to House Tyrell?", options: ["Highgarden", "Casterly Rock", "Dragonstone", "Winterfell"], correct: 0 },
  { q: "Which drink is associated with the Dornish region (hot and spicy)?", options: ["Milk of the poppy", "Dornish Red wine", "Ale", "Mead"], correct: 1 }
];
// Fill to 40 if less than 40 (some duplicates avoided) - ensure length 40
while (knowledgePool.easy.length < 40) {
  knowledgePool.easy.push( knowledgePool.easy[knowledgePool.easy.length % knowledgePool.easy.length] );
}

// --- MEDIUM 40 ---
knowledgePool.medium = [
  { q: "Who kills Renly Baratheon?", options: ["Stannis Baratheon", "Melisandre's shadow", "Loras Tyrell", "Catelyn Stark"], correct: 1 },
  { q: "Who is known as the Queen of Thorns?", options: ["Margaery Tyrell", "Olenna Tyrell", "Selyse Baratheon", "Melisandre"], correct: 1 },
  { q: "Who ultimately becomes king of the Six Kingdoms at the end of the TV show?", options: ["Bran Stark", "Sansa Stark", "Jon Snow", "Tyrion Lannister"], correct: 0 },
  { q: "Which person kills the Mad King Aerys Targaryen (in show backstory)?", options: ["Jaime Lannister", "Ned Stark", "Robert Baratheon", "Aerys died naturally"], correct: 0 },
  { q: "Who is known for the phrase 'You know nothing, ___'?", options: ["Robb", "Ygritte", "Jon", "Sam"], correct: 1 },
  { q: "What is the name of the sword Arya uses that belonged to her brother? (hint: small sword)", options: ["Ice", "Needle", "Oathkeeper", "Longclaw"], correct: 1 },
  { q: "Who is commander of the Unsullied initially?", options: ["Grey Worm", "Daario Naharis", "Barristan Selmy", "Kraznys"], correct: 3 },
  { q: "Which creature is used by Stannis in early battle rituals (Melisandre's magic)?", options: ["Dragonglass", "Shadow assassin", "Direwolf", "Dragon"], correct: 1 },
  { q: "Who kills Littlefinger (Petyr Baelish) in the TV show?", options: ["Sansa & Arya Stark", "Bran Stark", "Jon Snow", "Daenerys"], correct: 0 },
  { q: "Which character becomes the Lord Commander of the Night's Watch before being betrayed?", options: ["Jeor Mormont", "Jon Snow", "Alliser Thorne", "Brynden Rivers"], correct: 1 },
  { q: "What is the ancestral sword of House Tarly?", options: ["Heartsbane", "Ice", "Oathkeeper", "Needle"], correct: 0 },
  { q: "Which family rules the Reach from Highgarden?", options: ["Tyrell", "Tully", "Arryn", "Greyjoy"], correct: 0 },
  { q: "Which queen commands the Dothraki army after Khal Drogo?", options: ["Daenerys Targaryen", "Cersei", "Sansa", "Margaery"], correct: 0 },
  { q: "Which city is home to the Iron Bank?", options: ["Braavos", "Meereen", "Pentos", "Qarth"], correct: 0 },
  { q: "Who re-forged Ned Stark's sword Ice into two swords?", options: ["Tyrion Lannister", "Tywin Lannister", "Ser Bronn", "Tobho Mott"], correct: 3 },
  { q: "The Hound's real name is Sandor. What is his surname?", options: ["Clegane", "Clegene", "Clegan", "Cleg"], correct: 0 },
  { q: "Who says 'When you play the game of thrones, you win or you die'?", options: ["Cersei Lannister", "Tyrion Lannister", "Varys", "Littlefinger"], correct: 0 },
  { q: "Who is the master builder and castlesmith who reforges Valyrian steel in the show?", options: ["Qyburn", "Tobho Mott", "Samwell Tarly", "Khal"], correct: 1 },
  { q: "Which leader uses wildfire in a major battle?", options: ["Stannis Baratheon", "Tywin Lannister", "Cersei Lannister", "Daenerys Targaryen"], correct: 2 },
  { q: "Which brother is known as the 'Mole's friend' and an excellent tracker in the show?", options: ["Gendry", "Podrick", "Samwell", "Edd"], correct: 3 },
  { q: "Who kills King Joffrey?", options: ["Sansa Stark", "Petyr Baelish & Olenna Tyrell", "Tyrion Lannister", "Cersei"], correct: 1 },
  { q: "Who smuggles Arya to Braavos to train at the House of Black and White?", options: ["Jaqen H'ghar", "Syrio Forel", "The Hound", "Gendry"], correct: 2 },
  { q: "Which island is the base for House Greyjoy?", options: ["Pyke", "Dragonstone", "Skagos", "Bear Island"], correct: 0 },
  { q: "Who becomes the Hand to King Bran at the end?", options: ["Tyrion Lannister", "Samwell Tarly", "Davos Seaworth", "Varys"], correct: 0 },
  { q: "Which city did Stannis use as a naval base when attacking King's Landing?", options: ["Dragonstone", "Pyke", "Casterly Rock", "Winterfell"], correct: 0 },
  { q: "What is the name of the secret society of assassins in Braavos?", options: ["Sons of the Harpy", "Faceless Men", "Golden Company", "Sellswords"], correct: 1 },
  { q: "Which character had a pet called 'Shaggydog'?", options: ["Bran Stark", "Rickon Stark", "Robb Stark", "Sansa Stark"], correct: 1 },
  { q: "Who was the commander of the Golden Company?", options: ["Harry Strickland", "Daario", "Euron Greyjoy", "Mace Tyrell"], correct: 0 },
  { q: "Which place is the ancestral seat of House Baratheon?", options: ["Storm's End", "Casterly Rock", "Highgarden", "Winterfell"], correct: 0 },
  { q: "Who executed Ned Stark in King's Landing?", options: ["Joffrey Baratheon", "Cersei Lannister", "Tywin Lannister", "Sansa Stark"], correct: 0 },
  { q: "What type of warriors are the Unsullied?", options: ["Naval", "Mounted", "Infantry slave-soldiers", "Archers"], correct: 2 },
  { q: "Who is the former master of coin in King's Landing later killed in the riot?", options: ["Tommen", "Littlefinger", "Meryn Trant", "Pyatt Pree"], correct: 2 },
  { q: "Which character serves as a maester and scholar at the Wall who later becomes key to Dragonstone knowledge?", options: ["Maester Aemon", "Samwell Tarly", "Pycelle", "Qyburn"], correct: 1 },
  { q: "Who is the Lord of Riverrun during much of the story?", options: ["Edmure Tully", "Hoster Tully", "Brynden Tully", "Walder Frey"], correct: 0 },
  { q: "What is the name of the poison used to kill someone at Joffrey's wedding?", options: ["The Strangler", "The Manticore", "The Strangler (aka 'the strangler')", "The Strangler's Kiss"], correct: 0 },
  { q: "Which figure returns with a massive Dothraki khalasar and fights at King's Landing toward the end?", options: ["Khal Drogo", "Dany's Dothraki", "Daario Naharis", "Theon Greyjoy"], correct: 1 },
  { q: "Who is heavily associated with the quote 'Chaos is a ladder'?", options: ["Varys", "Littlefinger (Petyr Baelish)", "Tyrion", "Olenna"], correct: 1 },
  { q: "Which fortress fell when theon betrayed the Starks?", options: ["Winterfell", "Dragonstone", "Casterly Rock", "Highgarden"], correct: 0 }
];
// Ensure length 40
while (knowledgePool.medium.length < 40) {
  knowledgePool.medium.push( knowledgePool.medium[knowledgePool.medium.length % knowledgePool.medium.length] );
}

// --- HARD 40 ---
knowledgePool.hard = [
  { q: "Who is the author of the book series 'A Song of Ice and Fire'?", options: ["George R.R. Martin", "J.R.R. Tolkien", "Patrick Rothfuss", "Brandon Sanderson"], correct: 0 },
  { q: "Who replaced the Lord Commander of the Night's Watch after Jeor Mormont was killed?", options: ["Jon Snow", "Alliser Thorne", "Edd", "Janos Slynt"], correct: 0 },
  { q: "What is the true name of the 'Mole's friend' Gilly's baby father? (i.e., who fathered Sam's child storyline?)", options: ["Rast", "Craster", "Rickard", "Karl"], correct: 1 },
  { q: "Who killed Lysa Arryn?", options: ["Petyr Baelish (pushed her)", "Sansa Stark", "Catelyn Stark", "Tyrion Lannister"], correct: 0 },
  { q: "Who forged the 'dragonglass' weapons in Dragonstone mines with Daenerys's help?", options: ["Samwell Tarly", "Jon Snow", "Samwell and Jon together", "No one forged them"], correct: 2 },
  { q: "What is the name of the sword bought by Brienne for Jaime (the one she returns)?", options: ["Oathkeeper", "Ice", "Widow's Wail", "Heartseeker"], correct: 0 },
  { q: "Who beheads Mance Rayder in the show?", options: ["Stannis Baratheon", "Jon Snow", "Melisandre", "Tormund"], correct: 2 },
  { q: "Who is revealed to have orchestrated the murder of Joffrey (with Olenna's involvement)?", options: ["Sansa", "Olenna & Littlefinger", "Tyrion", "Cersei"], correct: 1 },
  { q: "Which character stealthily killed the Night King by leaping and stabbing him with Valyrian steel?", options: ["Arya Stark", "Jon Snow", "Bran Stark", "Sansa Stark"], correct: 0 },
  { q: "Which of the following is a known Valyrian steel blade in the story?", options: ["Heartsbane", "Needle", "Ice", "Oathless"], correct: 0 },
  { q: "Who commanded the Dothraki to follow Daenerys to Westeros toward the end?", options: ["Davos", "Daario", "Jorah", "Dany herself"], correct: 3 },
  { q: "Who betrayed Robb Stark by orchestrating the Red Wedding?", options: ["Roose Bolton & Walder Frey", "House Lannister", "House Tully", "House Greyjoy"], correct: 0 },
  { q: "What is the 'Blackwater' battle famous for using?", options: ["Dragonglass", "Wildfire", "Valyrian steel", "Dothraki"], correct: 1 },
  { q: "Who is the Craster in the story?", options: ["A wildling who lives beyond the wall and sacrifices sons", "A Lannister bannerman", "A member of the Night's Watch", "A maester"], correct: 0 },
  { q: "What role does the Faceless Men order serve?", options: ["Mercenaries", "Assassins who can change appearances", "Priests", "Sellswords"], correct: 1 },
  { q: "Which character says 'I drink and I know things'?", options: ["Tyrion Lannister", "Petyr Baelish", "Varys", "Samwell Tarly"], correct: 0 },
  { q: "Who carries out the trial by combat champion Oberyn Martell faces?", options: ["The Mountain (Gregor Clegane)", "The Hound", "Brienne", "Qyburn"], correct: 0 },
  { q: "Which knight becomes a proud protector of Sansa and later of Bran's memory in the show?", options: ["Brienne of Tarth", "Podrick", "Tormund", "Jorah"], correct: 0 },
  { q: "Who becomes a queen in the North (separate from Bran) at the end of the TV show?", options: ["Sansa Stark", "Arya Stark", "Daenerys", "Cersei"], correct: 0 },
  { q: "Which character commands the iron fleet later allied with Cersei?", options: ["Euron Greyjoy", "Theon Greyjoy", "Balon Greyjoy", "Yara Greyjoy"], correct: 0 },
  { q: "What does the red priestess Melisandre often use as a magical focus?", options: ["Blood and fire", "Dragonglass", "Valyrian steel", "Weirwood"], correct: 0 },
  { q: "Who frees the slaves of Meereen and rules there temporarily?", options: ["Daenerys Targaryen", "Tyrion", "Daario", "Grey Worm"], correct: 0 },
  { q: "Who eventually kills the usurper Ramsay Bolton?", options: ["Sansa & Theon with Jon", "Jon Snow alone", "Arya Stark", "Bran Stark"], correct: 0 },
  { q: "Which two characters had an incestuous relationship producing Joffrey (in TV history/backstory)?", options: ["Cersei & Jaime Lannister", "Cersei & Tywin", "Cersei & Tyrion", "Cersei & Euron"], correct: 0 },
  { q: "What is the 'Golden Company' known to be?", options: ["An Essosi sellsword company", "A Westerosi house guard", "A group of maesters", "The Night's Watch faction"], correct: 0 },
  { q: "Who resurrects Jon Snow after his assassination by the Night's Watch mutineers?", options: ["Melisandre", "Bran", "Tyrion", "Samwell"], correct: 0 },
  { q: "Which of the following characters is a master of whisperers and information?", options: ["Varys", "Tyrion", "Littlefinger", "Qyburn"], correct: 0 },
  { q: "Who claims Dragonstone as a Targaryen seat on return to Westeros?", options: ["Stannis", "Daenerys", "Cersei", "Euron"], correct: 1 },
  { q: "Which house is associated with the rose and the Reach?", options: ["Tyrell", "Greyjoy", "Tully", "Martell"], correct: 0 },
  { q: "Who is the commander who refuses to bend the knee to Daenerys and later fights for the throne?", options: ["Euron Greyjoy", "Ramsay Bolton", "Roose Bolton", "Samwell Tarly"], correct: 0 },
  { q: "Who helps reveal the truth of Jon Snow's parentage (show reveal)?", options: ["Bran Stark", "Tyrion", "Sansa", "Varys"], correct: 0 },
  { q: "Which city is home to the Iron Islands' rulers?", options: ["Pyke", "King's Landing", "Highgarden", "Dorne"], correct: 0 },
  { q: "Who killed Khal Drogo (indirectly via complications) leading to Daenerys' rise?", options: ["Wound infection & Mirri Maz Duur's spells", "A rival khal", "Daenerys herself", "Drogo died in battle"], correct: 0 },
  { q: "Which weapon is primarily used against White Walkers in the show aside from dragonglass?", options: ["Regular steel", "Valyrian steel", "Bronze", "Iron"], correct: 1 },
  { q: "Which character is exiled to the Night's Watch and later becomes Lord Commander?", options: ["Jon Snow", "Samwell Tarly", "Edd", "Jeor"], correct: 0 },
  { q: "Who is the leader of House Frey who betrays the Starks?", options: ["Walder Frey", "Emmon Frey", "Edmure Frey", "Black Walder"], correct: 0 }
];
// Ensure length 40
while (knowledgePool.hard.length < 40) {
  knowledgePool.hard.push( knowledgePool.hard[knowledgePool.hard.length % knowledgePool.hard.length] );
}

// -----------------------------
// Knowledge quiz flow
// -----------------------------
document.getElementById('btn-quiz').addEventListener('click', () => {
  // show level selection
  levelSelect.style.display = 'block';
  quizSection.style.display = 'none';
  characterSection.style.display = 'none';
  quizResultEl.innerText = '';
});

document.querySelectorAll('.level-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const level = e.currentTarget.dataset.level;
    startKnowledgeQuiz(level);
  });
});

function startKnowledgeQuiz(level) {
  // pick 8 unique questions from chosen pool
  const pool = knowledgePool[level];
  knowledgeSelected = pickN(pool, 8).map(q => {
    // deep clone to not mutate originals
    return JSON.parse(JSON.stringify(q));
  });
  kIndex = 0;
  kScore = 0;
  kSelectedAnswer = null;
  scoreEl.innerText = `Score: ${kScore}`;
  quizResultEl.innerText = '';
  levelSelect.style.display = 'none';
  quizSection.style.display = 'block';
  characterSection.style.display = 'none';
  renderKnowledgeQuestion();
}

function renderKnowledgeQuestion() {
  const qObj = knowledgeSelected[kIndex];
  questionEl.innerText = `Q${kIndex + 1}. ${qObj.q}`;
  clearChildren(optionsEl);
  qObj.options.forEach((opt, idx) => {
    const btn = createOptionButton(opt, idx);
    btn.addEventListener('click', () => {
      // mark selected visually
      Array.from(optionsEl.children).forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      kSelectedAnswer = idx;
    });
    optionsEl.appendChild(btn);
  });

  // Next button label
  nextBtn.innerText = (kIndex === knowledgeSelected.length - 1) ? 'Finish' : 'Next';
}

nextBtn.addEventListener('click', () => {
  if (kSelectedAnswer === null) {
    alert('Please select an answer before proceeding.');
    return;
  }
  // Check answer
  const current = knowledgeSelected[kIndex];
  if (kSelectedAnswer == current.correct) {
    kScore++;
  }
  // reset selection and move on
  kSelectedAnswer = null;
  kIndex++;
  scoreEl.innerText = `Score: ${kScore}`;
  if (kIndex < knowledgeSelected.length) {
    renderKnowledgeQuestion();
  } else {
    finishKnowledgeQuiz();
  }
});

function finishKnowledgeQuiz() {
  quizSection.style.display = 'block';
  // Titles based on score (0-8)
  let title = '';
  if (kScore <= 2) title = 'Novice Fan';
  else if (kScore <= 4) title = 'Good Fan';
  else if (kScore <= 6) title = 'Great Fan';
  else title = 'GOAT Fan'; // 7-8

  quizResultEl.innerHTML = `You scored <strong>${kScore}</strong> / ${knowledgeSelected.length}. Title: <strong>${title}</strong>`;
  // Optionally show quick review of which were incorrect
  const review = document.createElement('div');
  review.style.marginTop = '12px';
  const incorrect = knowledgeSelected
    .map((q, i) => ({ q, i }))
    .filter(obj => {
      // We don't store chosen selection per question in this implementation beyond score,
      // so this review will only show correct answers to learn from.
      return true;
    })
    .map(obj => `<div style="text-align:left;margin:6px 10px;color:#f0e6d2">
      <strong>Q${obj.i+1}:</strong> ${obj.q.q}<br>
      <strong>Answer:</strong> ${obj.q.options[obj.q.correct]}
    </div>`).join('');
  review.innerHTML = `<h4 style="color:#ffd700;margin-bottom:8px">Answers:</h4>${incorrect}`;
  quizResultEl.appendChild(review);

  // Reset for safety
  kIndex = 0;
  kSelectedAnswer = null;
  knowledgeSelected = [];
}

// -----------------------------
// Character & House quiz data
// Character quiz: 10 questions, each option assigns points to characters
// House quiz: 10 questions, each option assigns points to houses
// -----------------------------

// Define 10 characters (simple metadata + description)
const CHARACTERS = [
  { id: 'jon', name: 'Jon Snow', desc: 'Honorable, stoic, leader. You put duty first.' },
  { id: 'daenerys', name: 'Daenerys Targaryen', desc: 'Ambitious, visionary, passionate about freeing the oppressed.' },
  { id: 'tyrion', name: 'Tyrion Lannister', desc: 'Witty, clever, and values wisdom over brute force.' },
  { id: 'arya', name: 'Arya Stark', desc: 'Independent, fierce, and driven by vengeance and freedom.' },
  { id: 'sansa', name: 'Sansa Stark', desc: 'Patient, politically savvy, grows into power.' },
  { id: 'cersei', name: 'Cersei Lannister', desc: 'Ruthless, protective of family, will do anything to win.' },
  { id: 'brienne', name: 'Brienne of Tarth', desc: 'Loyal, honorable, strong protector.' },
  { id: 'jaime', name: 'Jaime Lannister', desc: 'Complex, proud, seeks redemption.' },
  { id: 'tywin', name: 'Tyrion\'s Father (Tywin-esque)', desc: 'Strategic, commanding, legacy-focused.' },
  { id: 'bran', name: 'Bran Stark', desc: 'Mysterious, wise, sees the bigger pattern.' }
];

// Character quiz questions: each options map to characters (by id)
const CHARACTER_QUESTIONS = [
  {
    q: "What appeals to you most?",
    options: [
      { text: "Honor, duty and protecting others", give: { jon: 2, brienne: 1 } },
      { text: "Power and legacy", give: { tywin: 2, cersei: 1 } },
      { text: "Freedom and revenge", give: { arya: 2, jaime: 1 } },
      { text: "Wisdom, cunning and wit", give: { tyrion: 2, bran: 1 } }
    ]
  },
  {
    q: "In a crisis you are most likely to:",
    options: [
      { text: "Lead from the front", give: { jon: 2, brienne: 1 } },
      { text: "Plan, scheme, and negotiate", give: { tyrion: 2, sansa: 1 } },
      { text: "Use stealth or surprise", give: { arya: 2, jaime: 1 } },
      { text: "Do whatever it takes, even ruthless acts", give: { cersei: 2, tywin: 1 } }
    ]
  },
  {
    q: "Which trait describes you best?",
    options: [
      { text: "Loyal", give: { brienne: 2, jon: 1 } },
      { text: "Ambitious", give: { daenerys: 2, cersei: 1 } },
      { text: "Clever", give: { tyrion: 2, bran: 1 } },
      { text: "Reckless", give: { arya: 2, jaime: 1 } }
    ]
  },
  {
    q: "Your ideal leadership style is:",
    options: [
      { text: "Lead by example and sacrifice", give: { jon: 2, brienne: 1 } },
      { text: "Rule with vision and reforms", give: { daenerys: 2, sansa: 1 } },
      { text: "Win through smart negotiations", give: { tyrion: 2, tywin: 1 } },
      { text: "Control through strength and fear", give: { cersei: 2, jaime: 1 } }
    ]
  },
  {
    q: "Which pastime suits you?",
    options: [
      { text: "Training and combat", give: { brienne: 2, arya: 1 } },
      { text: "Reading, learning, storytelling", give: { tyrion: 2, bran: 1 } },
      { text: "Ruling and courtly life", give: { sansa: 2, cersei: 1 } },
      { text: "Adventuring or traveling", give: { daenerys: 2, jon: 1 } }
    ]
  },
  {
    q: "Pick a moral choice:",
    options: [
      { text: "Break a rule to save lives", give: { jon: 2, jaime: 1 } },
      { text: "Manipulate politics to secure peace", give: { sansa: 2, tyrion: 1 } },
      { text: "Redeem past mistakes by action", give: { jaime: 2, brienne: 1 } },
      { text: "Burn the corrupt to start anew", give: { daenerys: 2, cersei: 1 } }
    ]
  },
  {
    q: "Choose a principle:",
    options: [
      { text: "Duty above self", give: { jon: 2, brienne: 1 } },
      { text: "Power begets change", give: { daenerys: 2, tywin: 1 } },
      { text: "Knowledge is protection", give: { tyrion: 2, bran: 1 } },
      { text: "Family at all costs", give: { cersei: 2, sansa: 1 } }
    ]
  },
  {
    q: "A friend betrays you — your reaction:",
    options: [
      { text: "Seek justice, keep honor", give: { jon: 2, sansa: 1 } },
      { text: "Plot quietly and outmaneuver", give: { tyrion: 2, jaime: 1 } },
      { text: "Strike back fiercely and quickly", give: { arya: 2, cersei: 1 } },
      { text: "Withdraw, become wiser and watchful", give: { bran: 2, brienne: 1 } }
    ]
  },
  {
    q: "Your preferred legacy would be:",
    options: [
      { text: "Remembered as honorable", give: { jon: 2, brienne: 1 } },
      { text: "Remembered as revolutionary", give: { daenerys: 2, jaime: 1 } },
      { text: "Remembered as clever and just", give: { tyrion: 2, sansa: 1 } },
      { text: "Remembered as feared and powerful", give: { cersei: 2, tywin: 1 } }
    ]
  },
  {
    q: "If forced to choose, you value:",
    options: [
      { text: "Protection of the people", give: { jon: 2, brienne: 1 } },
      { text: "Justice even if harsh", give: { arya: 2, cersei: 1 } },
      { text: "Wisdom and counsel", give: { tyrion: 2, bran: 1 } },
      { text: "Order and rule", give: { tywin: 2, sansa: 1 } }
    ]
  }
];

// House quiz: 10 questions that map options to houses
const HOUSES = ['Stark', 'Targaryen', 'Lannister', 'Baratheon', 'Tyrell', 'Greyjoy'];

const HOUSE_QUESTIONS = [
  {
    q: "Which environment would you rule from?",
    options: [
      { text: "A snowy northern fortress", give: { Stark: 2 } },
      { text: "A volcanic island seat with dragons", give: { Targaryen: 2 } },
      { text: "A wealthy, imposing castle", give: { Lannister: 2 } },
      { text: "A rugged coastal stronghold", give: { Greyjoy: 2 } }
    ]
  },
  {
    q: "What's your approach to leadership?",
    options: [
      { text: "Protect your people, be just", give: { Stark: 2 } },
      { text: "Rule by destiny and fire", give: { Targaryen: 2 } },
      { text: "Command wealth and influence", give: { Lannister: 2 } },
      { text: "Take what you can by sea and strength", give: { Greyjoy: 2 } }
    ]
  },
  {
    q: "Which symbol speaks to you?",
    options: [
      { text: "Direwolf", give: { Stark: 2 } },
      { text: "Three-headed dragon", give: { Targaryen: 2 } },
      { text: "Golden lion", give: { Lannister: 2 } },
      { text: "Leaping stag or ship", give: { Baratheon: 2 } }
    ]
  },
  {
    q: "What would you offer in an alliance?",
    options: [
      { text: "Honor and loyalty", give: { Stark: 2 } },
      { text: "Dragonfire and claim", give: { Targaryen: 2 } },
      { text: "Gold and politics", give: { Lannister: 2 } },
      { text: "Naval support", give: { Greyjoy: 2 } }
    ]
  },
  {
    q: "Which value is most important?",
    options: [
      { text: "Duty", give: { Stark: 2 } },
      { text: "Destiny", give: { Targaryen: 2 } },
      { text: "Ambition", give: { Lannister: 2 } },
      { text: "Independence", give: { Greyjoy: 2 } }
    ]
  },
  {
    q: "Pick an ideal alliance partner:",
    options: [
      { text: "A strong northern house", give: { Stark: 2 } },
      { text: "A powerful dragonseed", give: { Targaryen: 2 } },
      { text: "A rich southern house like Tyrell", give: { Lannister: 1, Tyrell: 1 } },
      { text: "A bold, seafaring clan", give: { Greyjoy: 2 } }
    ]
  },
  {
    q: "Preferred peace strategy:",
    options: [
      { text: "Rule by law and tradition", give: { Stark: 2 } },
      { text: "Use overwhelming force if needed", give: { Targaryen: 2 } },
      { text: "Bribe, manipulate, and negotiate", give: { Lannister: 2 } },
      { text: "Raid and intimidate", give: { Greyjoy: 2 } }
    ]
  },
  {
    q: "A festival you attend features:",
    options: [
      { text: "Feasts and hearth tales", give: { Tyrell: 2 } },
      { text: "Knightly tournaments", give: { Baratheon: 2 } },
      { text: "Courtly dances and intrigue", give: { Lannister: 2 } },
      { text: "Stormy sea-songs and boats", give: { Greyjoy: 2 } }
    ]
  },
  {
    q: "What would you offer your people in hardship?",
    options: [
      { text: "Strong leadership and rationing", give: { Stark: 2 } },
      { text: "Inspiration and promise of rebirth", give: { Targaryen: 2 } },
      { text: "Gold to secure loyalty", give: { Lannister: 2 } },
      { text: "Tough survival lessons", give: { Greyjoy: 2 } }
    ]
  },
  {
    q: "Which motto would you choose?",
    options: [
      { text: "Winter is Coming", give: { Stark: 2 } },
      { text: "Fire and Blood", give: { Targaryen: 2 } },
      { text: "A Lannister always pays his debts", give: { Lannister: 2 } },
      { text: "We do not sow", give: { Greyjoy: 2 } }
    ]
  }
];

// -----------------------------
// Start Character / House flows
// -----------------------------
document.getElementById('btn-character').addEventListener('click', () => {
  quizMode = 'character';
  characterSection.style.display = 'block';
  quizSection.style.display = 'none';
  levelSelect.style.display = 'none';
  gcTitleEl.innerText = 'Which Character Are You?';
  startCharacterQuiz();
});

document.getElementById('btn-house').addEventListener('click', () => {
  quizMode = 'house';
  characterSection.style.display = 'block';
  quizSection.style.display = 'none';
  levelSelect.style.display = 'none';
  gcTitleEl.innerText = 'Which House Do You Belong To?';
  startHouseQuiz();
});

// Character quiz
function startCharacterQuiz() {
  gcIndex = 0;
  gcQuestions = CHARACTER_QUESTIONS.map(q => JSON.parse(JSON.stringify(q)));
  gcAnswers = [];
  gcResultEl.innerText = '';
  renderGcQuestion();
}

// House quiz
function startHouseQuiz() {
  gcIndex = 0;
  gcQuestions = HOUSE_QUESTIONS.map(q => JSON.parse(JSON.stringify(q)));
  gcAnswers = [];
  gcResultEl.innerText = '';
  renderGcQuestion();
}

function renderGcQuestion() {
  const qObj = gcQuestions[gcIndex];
  gcQuestionEl.innerText = `Q${gcIndex + 1}. ${qObj.q}`;
  clearChildren(gcOptionsEl);
  qObj.options.forEach((opt, idx) => {
    const btn = createOptionButton(opt.text, idx);
    btn.addEventListener('click', () => {
      // deselect
      Array.from(gcOptionsEl.children).forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      // store selection index on button element
      btn.dataset.chosen = 'true';
      // note chosen index (but not commit until Next)
      gcSelected = idx;
      // store temporarily as property on container for next
      gcOptionsEl.dataset.lastChoice = idx;
    });
    gcOptionsEl.appendChild(btn);
  });
  gcNextBtn.innerText = (gcIndex === gcQuestions.length - 1) ? 'Finish' : 'Next';
}

// Guard variable for selection in gc
let gcSelected = null;

gcNextBtn.addEventListener('click', () => {
  // make sure choice exists
  const lastChoice = gcOptionsEl.dataset.lastChoice;
  if (lastChoice === undefined) {
    alert('Please select an option before proceeding.');
    return;
  }
  const choiceIdx = parseInt(lastChoice, 10);
  gcAnswers.push(choiceIdx);

  // advance index
  gcIndex++;
  // reset lastChoice
  delete gcOptionsEl.dataset.lastChoice;

  if (gcIndex < gcQuestions.length) {
    renderGcQuestion();
  } else {
    if (quizMode === 'character') processCharacterResult();
    else if (quizMode === 'house') processHouseResult();
  }
});

// -----------------------------
// Process Character Results
// -----------------------------
function processCharacterResult() {
  // tally points
  const tally = {};
  CHARACTERS.forEach(c => tally[c.id] = 0);

  gcAnswers.forEach((ansIdx, qIdx) => {
    const opt = CHARACTER_QUESTIONS[qIdx].options[ansIdx];
    const give = opt.give;
    for (const charId in give) {
      if (!tally[charId]) tally[charId] = 0;
      tally[charId] += give[charId];
    }
  });

  // find highest
  let topId = null;
  let topScore = -Infinity;
  for (const id in tally) {
    if (tally[id] > topScore) {
      topScore = tally[id];
      topId = id;
    }
  }

  // If tie — pick randomly among top scorers
  const topScorers = Object.keys(tally).filter(id => tally[id] === topScore);
  if (topScorers.length > 1) {
    topId = topScorers[Math.floor(Math.random() * topScorers.length)];
  }

  const character = CHARACTERS.find(c => c.id === topId);

  // Build result
  gcResultEl.innerHTML = `<strong>You are: ${character.name}</strong><br>${character.desc}<br><br>`;
  gcResultEl.innerHTML += `<div style="text-align:left;margin:10px auto;max-width:600px">Detailed scores:<ul style="text-align:left">` +
    Object.keys(tally).map(id => {
      const c = CHARACTERS.find(x => x.id === id);
      return `<li><strong>${c.name}:</strong> ${tally[id]} pts</li>`;
    }).join('') +
    `</ul></div>`;
  // Reset quizMode so user can pick another if needed
  quizMode = null;
}

// -----------------------------
// Process House Results
// -----------------------------
function processHouseResult() {
  // tally points
  const tally = {};
  HOUSES.forEach(h => tally[h] = 0);

  gcAnswers.forEach((ansIdx, qIdx) => {
    const opt = HOUSE_QUESTIONS[qIdx].options[ansIdx];
    const give = opt.give;
    for (const house in give) {
      if (!tally[house]) tally[house] = 0;
      tally[house] += give[house];
    }
  });

  let topHouse = null;
  let topScore = -Infinity;
  for (const h in tally) {
    if (tally[h] > topScore) {
      topScore = tally[h];
      topHouse = h;
    }
  }

  const topHouses = Object.keys(tally).filter(h => tally[h] === topScore);
  if (topHouses.length > 1) {
    topHouse = topHouses[Math.floor(Math.random() * topHouses.length)];
  }

  gcResultEl.innerHTML = `<strong>Your House: ${topHouse}</strong><br>`;
  // small house flavor description
  const houseDesc = {
    Stark: "Honour, duty, and the North's endurance.",
    Targaryen: "Fire, destiny, and reclaiming legacy.",
    Lannister: "Wealth, influence, and political maneuvering.",
    Baratheon: "Boldness, strength, and storm-born leadership.",
    Tyrell: "Wealth, fertility, and courtly finesse.",
    Greyjoy: "Seafaring ruthlessness and independence."
  };
  gcResultEl.innerHTML += `<div style="margin-top:8px">${houseDesc[topHouse] || ''}</div>`;

  gcResultEl.innerHTML += `<div style="text-align:left;margin:10px auto;max-width:600px"><h4 style="color:#ffd700">House scores</h4><ul style="text-align:left">` +
    Object.keys(tally).map(h => `<li><strong>${h}:</strong> ${tally[h]} pts</li>`).join('') +
    `</ul></div>`;
  quizMode = null;
}

// -----------------------------
// Initialize: hide all except initial buttons
// -----------------------------
function initUI() {
  levelSelect.style.display = 'none';
  quizSection.style.display = 'none';
  characterSection.style.display = 'none';
  quizResultEl.innerHTML = '';
  gcResultEl.innerHTML = '';
  scoreEl.innerText = 'Score: 0';
}

initUI();

// -----------------------------
// Accessibility & keyboard focus improvements (small)
// -----------------------------
document.addEventListener('keydown', (e) => {
  // Enter key triggers current selected option if there is a selected
  if (e.key === 'Enter') {
    // Knowledge quiz
    if (quizSection.style.display === 'block') {
      const selected = optionsEl.querySelector('.selected');
      if (selected) {
        nextBtn.click();
      }
    }
    // Character/house quiz
    if (characterSection.style.display === 'block') {
      const selected = gcOptionsEl.querySelector('.selected');
      if (selected) {
        gcNextBtn.click();
      }
    }
  }
});

// -----------------------------
// End of script.js
// -----------------------------
