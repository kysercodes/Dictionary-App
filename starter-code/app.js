const dropdownToggle = document.getElementById('dropdown-toggle');
const dropdownMenu = document.getElementById('dropdown-menu');
let audioPlay 

  dropdownToggle.addEventListener('click', function (event) {
    const checkbox = document.getElementById('light-toggle');
    if(checkbox.checked){
        dropdownMenu.classList.add('night-mode')
    }
    event.stopPropagation();
    dropdownMenu.classList.toggle('active');
    
  });
   
  document.addEventListener('click', function () {
    dropdownMenu.classList.remove('active');
});


//  toggle light and dark mode

  function toggleLightOrDark() {
  const element = document.body;
  const inputElement = document.getElementById('search')
  const checkbox = document.getElementById('light-toggle');
  const dropdown = document.getElementById('dropdown-menu')
  const wikiSource = document.getElementById('sourceLink')

  if (checkbox.checked) {
    element.classList.add('night-mode'); // Apply dark mode
    inputElement.classList.add('input-dark');
    dropdown.classList.add('night-mode');
    wikiSource.classList.add('night-mode-text');
  } else {
    element.classList.remove('night-mode'); // Remove dark mode
    inputElement.classList.remove('input-dark');
    dropdown.classList.remove('night-mode');
    wikiSource.classList.remove('night-mode-text');
  }
  }

  const myCheckbox = document.getElementById('light-toggle');
    myCheckbox.addEventListener('click', toggleLightOrDark);
//   ends toggle for light and dark

    //  clears previous fonts
    function clearAllFonts() {
        const element = document.body;
        element.classList.remove('sans-font', 'serif-font', 'mono-font');
    }
    
    // select fonts
    function changeToSans() {
        clearAllFonts();
        const element = document.body;
        element.classList.add('sans-font')
        document.getElementById('font').innerText = 'Sans Serif'
        
    }
    
    const sansLi = document.getElementById('sans');
    sansLi.addEventListener('click', changeToSans);
    
    function changeToSerif() {
        clearAllFonts();
        const element = document.body;
        element.classList.add('serif-font')
        document.getElementById('font').innerText = 'Serif'
    }
    
    const serifLi = document.getElementById('serif');
    serifLi.addEventListener('click', changeToSerif);
    
    function changeToMono() {
        clearAllFonts();
        const element = document.body;
        element.classList.add('mono-font')
        document.getElementById('font').innerText = 'Mono'
    }
    
    const monoLi = document.getElementById('mono');
    monoLi.addEventListener('click', changeToMono);

    const form = document.getElementById('search-form');
    const searchInput = document.getElementById('search');




// Meat and potatoes




function searchWord(event) {
  event.preventDefault();
  const wordToSearch = searchInput.value.trim(); // Trim the input value to remove leading/trailing whitespace

  if (wordToSearch !== "") {
    console.log(wordToSearch);
    searchInput.value = ""; // Clear the input after logging the word
     audioPlay = ""  // clears audio file

    const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${wordToSearch}`;
    fetchData(apiUrl); // Call the fetchData function with the API URL
  } else {
//    violating DRY   this section is what happens when nothing is entered
      const wordSection = document.getElementById("word-title");
      const phoneticWord = document.getElementById("phonetic")
      const playButton = document.getElementById('playButton');
      wordSection.innerHTML = ""
      phoneticWord.innerHTML = ""
      playButton.innerHTML = ""

    const contentWrapper = document.getElementById('content');
    const existingSections = contentWrapper.querySelectorAll('section.partOfSpeech,section.source');

    if (existingSections.length > 0 ) {
        // If sections exist, remove them from the DOM
    
        existingSections.forEach(section => section.remove());
        
      }


    const meaningSection = document.createElement("section")
    meaningSection.classList.add('partOfSpeech');
    const emptyMessage = document.createElement('p');
    emptyMessage.textContent = "Input word is empty. Please enter a word."
    meaningSection.appendChild(emptyMessage)
    contentWrapper.appendChild(meaningSection)
    console.log("Input word is empty. Please enter a word.");
  }
}

form.addEventListener("submit", searchWord);

// Function to fetch data from the API
async function fetchData(apiUrl) {
  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
   

    data[0].phonetics.forEach((phonetic) => {
        if(phonetic.audio !== "") {
            audioPlay = new Audio(phonetic.audio)
        }
        
    })
    

    const newWord = document.getElementById('word-title')
    newWord.textContent = data[0].word
    const newPhonetic = document.getElementById('phonetic')
    newPhonetic.textContent = data[0].phonetic

//   genrates the play button image
    const playButton = document.getElementById('playButton');
    // here selecting the image that exists so you need an extra 
    const existingImg = playButton.querySelector('img[src="./assets/images/icon-play.svg"]');

    if (!existingImg) {
    // Image with the specified src does not exist as a direct child of the playButton element
    const newImage = document.createElement("img");
    newImage.src = "./assets/images/icon-play.svg";
    playButton.appendChild(newImage);
    }

    function playWord() {
        if (audioPlay) {  // Check if an Audio object was created
            audioPlay.play();
        }
        else {
            console.log('No audio to play');
        }
    }
   
    playButton.addEventListener('click', playWord);
    
        
    // const definitionList = document.getElementById('definitions');
    const contentWrapper = document.getElementById('content')
    const existingSections = contentWrapper.querySelectorAll('section.partOfSpeech');
    const existingSource = contentWrapper.querySelector('.source');
    if (existingSections.length > 0 ) {
        // If sections exist, remove them from the DOM
        existingSections.forEach(section => section.remove());
        
      }

      if (existingSource ) {
        // if sections exist, remove them from the DOM
        existingSource.remove()
        
      }
    
    // aww yeah thats the flavor this generates this section the meanings everything!
    data[0].meanings.forEach((part) => {
        const meaningSection = document.createElement("section")
        meaningSection.classList.add('partOfSpeech');
        const newSpeechPart = document.createElement('h3')
        newSpeechPart.id = "speechPart"
        newSpeechPart.textContent = part.partOfSpeech
        meaningSection.appendChild(newSpeechPart);
        const meaningHeading = document.createElement('h4')
        meaningHeading.textContent = 'Meaning'
        meaningSection.appendChild(meaningHeading)
        const definitionList = document.createElement('ul');
        definitionList.id = "definitions"
        meaningSection.appendChild(definitionList)
      
       
        // create the section and all its elements
        const definitionObj = part.definitions
        
        for (const value of Object.values(definitionObj)) {
                    // appends list items to ul
                let definitionItem = document.createElement("li");
                definitionItem.textContent = value.definition
                definitionList.appendChild(definitionItem)
                
         
        }
        if(part.synonyms.length > 0) {
            
            let synonymArray = part.synonyms;
            const synonymSection = document.createElement("div")
            synonymSection.classList.add('synonym-container')
            const synonymHeading = document.createElement('h5')
            synonymHeading.classList.add('synonyms')
            synonymHeading.textContent = "Synonyms"
            synonymSection.appendChild(synonymHeading)
            let synonymParagraph = document.createElement('p');
            synonymParagraph.textContent = synonymArray.join(",  ")
            synonymSection.appendChild(synonymParagraph)
            meaningSection.appendChild(synonymSection)
            // if(part.synonyms.length > 5) {
            //     synonymSection.classList.add("")
            // }
           }
          
          
           contentWrapper.appendChild(meaningSection);
        //    contentWrapper.appendChild(sectionElement);
         
           
       
    }); // Do something with the fetched data
    const sourceSection = document.createElement('section');
    sourceSection.classList.add('source');
    
    const sourceHeader = document.createElement('h4');
    sourceHeader.textContent = "Source";
    sourceSection.appendChild(sourceHeader);  // append the object, not the string
    
    const sourceLink = document.createElement("a");
    sourceLink.id = "sourceLink"
    sourceLink.href = data[0].sourceUrls.join(" ")
    sourceLink.textContent = data[0].sourceUrls.join(" ");  // I added ", " here to separate URLs
    sourceSection.appendChild(sourceLink);  // append the object, not the string
    contentWrapper.appendChild(sourceSection) // uncomment this line if you want to append the sourceSection to the contentWrapper
    
   
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}
