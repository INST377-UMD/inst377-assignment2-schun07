function startVoice() {
    if (annyang) {
      annyang.start();
      alert("Voice recognition started");
    }
  }
  
  function stopVoice() {
    if (annyang) {
      annyang.abort();
      alert("Voice recognition stopped");
    }
  }
  
  if (annyang) {
    commands = {
      'hello': () => alert('Hello World!'),
      'change the color to *color': (color) => {
        document.body.style.backgroundColor = color;
      },
      'navigate to *page': (page) => {
        const target = page.toLowerCase();
        if (target === 'home') window.location.href = 'index.html';
        else if (target === 'stocks') window.location.href = 'stocks.html';
        else if (target === 'dogs') window.location.href = 'dogs.html';
      }
    };
  
    annyang.addCommands(commands);
  }
  