
async function loadDogImages() {
    try {
      res = await fetch('https://dog.ceo/api/breeds/image/random/10');
      data = await res.json();
      slider = document.querySelector('.slider');
      slider.innerHTML = '';
      data.message.forEach(imgUrl => {
        const img = document.createElement('img');
        img.src = imgUrl;
        img.style.width = "100%";
        slider.appendChild(img);
      });
      new SimpleSlider('.slider');
    } catch (err) {
      console.error("Error loading dog images", err);
    }
  }
  
  async function loadDogBreeds() {
    try {
      res = await fetch('https://api.thedogapi.com/v1/breeds');
      data = await res.json();
      buttonContainer = document.getElementById('breed-buttons');
  
      data.forEach(breed => {
        const btn = document.createElement('button');
        btn.innerText = breed.name;
        btn.className = "button";
        btn.setAttribute("data-breed-id", breed.id);
        btn.onclick = () => showBreedInfo(breed);
        buttonContainer.appendChild(btn);
      });
  
      setupBreedVoiceCommands(data);
    } catch (err) {
      console.error("Failed to load breed list", err);
    }
  }
  
  function showBreedInfo(breed) {
    document.getElementById('breed-name').innerText = "Name: " + breed.name;
    document.getElementById('breed-description').innerText = "Breed Description" + breed.temperament || "No description available.";
    document.getElementById('breed-lifespan').innerText = `Lifespan: ${breed.life_span}`;
    document.getElementById('breed-info').style.display = 'block';
  }
  
  function setupBreedVoiceCommands(breeds) {
    if (!annyang) return;
  
    commands = {
      'load dog breed *name': function(name) {
        const breed = breeds.find(b =>
          b.name.toLowerCase() === name.toLowerCase()
        );
        if (breed) showBreedInfo(breed);
        else alert("Breed not found. Please try again.");
      }
    };
  
    annyang.addCommands(commands);
  }
  
  loadDogImages();
  loadDogBreeds();
  