let wordElement = document.querySelector(".word");
let definitionElement = document.querySelector(".definition");
let posElement = document.querySelector(".partOfSpeech");
let pronounciationElement = document.querySelector(".pronounciation");
let button = document.querySelector(".newWord");

let APIKEY = "YOURAPIKEY";

if (APIKEY = "YOURAPIKEY"){
    alert("Hey, try adding your wordnik API key")
}

window.addEventListener('DOMContentLoaded', renderUI);

async function renderUI(){
    let word = await getWord();
    let wordData = await getWordData(word);

    console.log("word - ", wordData.word)
    console.log("pronounciation - ", wordData.pronounciation)
    console.log("part of speech - ", wordData.partOfSpeech)
    console.log("definition - ", wordData.definition)

    wordElement.textContent = wordData.word;
    definitionElement.textContent = wordData.definition;
    posElement.textContent = wordData.partOfSpeech;
    pronounciationElement.textContent = wordData.pronounciation;

}

async function getWord(){
    let response;
    document.querySelector(".alert").textContent = ""
    try{
        response =  await fetch(`https://api.wordnik.com/v4/words.json/randomWord?hasDictionaryDef=true&includePartOfSpeech=noun%2C%20adjective%2C%20verb%2C%20adverb%2C%20interjection%2C%20pronoun%2C%20preposition%2C%20affix%2C%20verb-intransitive%2C%20verb-transitive&minLength=5&minCorpusCount=1000&api_key=${APIKEY}`);
        if (response.status != 200){
            throw new Error (response.status)
        }
        let wordData = await response.json();
        console.log(wordData.word)
        return wordData.word;
    }catch(err){
        if (err == 429){
            console.log("slow down")
            document.querySelector(".alert").textContent = "Slow down bud"
            setTimeout(getWord(), 3000);
        }
    }
    
}

async function getWordData(word){
    let pronounciation;
    let partOfSpeech;
    let definition;

    try{
        let response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        
        if (response.status != 200){
            throw new Error (response.status)
        }

        let definitionData = await response.json();
        if(definitionData.title || definitionData[0].meanings.length == 0){
            return {};
        }else{

            definition = definitionData[0].meanings[0].definitions[0].definition;
            partOfSpeech = definitionData[0].meanings[0].partOfSpeech;

            if(definitionData[0].phonetics.length == 0 ){
                pronounciation = ""; 
            }else{
                pronounciation = definitionData[0].phonetics[0].text;
            }
        
            return {
                word: word,
                definition: definition,
                partOfSpeech: partOfSpeech,
                pronounciation: pronounciation
            }
        }
    }catch(err){
        console.log("ERROR",err);
    }
}

button.addEventListener("click", renderUI);





//---------------------------PROBLEMS TO ACCOUNT FOR

//no pronounciation of word (when the phonetics array is empty)

//no meaning (but he word is still present see below - the meaning array is empty) 
// [
//     {
//     "word": "coquettishness",
//     "phonetics": [
//     {
//     "text": "/koʊˈkɛdɪʃnəs/",
//     "audio": "https://lex-audio.useremarkable.com/mp3/coquettishness_us_1.mp3"
//     }
//     ],
//     "meanings": []
//     }
// ]

//word not found

// {
//     "title": "No Definitions Found",
//     "message": "Sorry pal, we couldn't find definitions for the word you were looking for.",
//     "resolution": "You can try the search again at later time or head to the web instead."
// }