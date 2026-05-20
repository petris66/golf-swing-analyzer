// app.js - Golf Swing Analyzer

const swingStages = [
  "Osoiteasento",
  "Takahuiskun alku",
  "Takahuiskun huippu",
  "Downswingin alku",
  "Juuri ennen kontaktia",
  "Follow-through"
];

const selectedImages = Array(6).fill(null);
const container = document.getElementById("upload-container");
const analyzeBtn = document.getElementById("analyzeBtn");
const resultsDiv = document.getElementById("results");

// Luo kuvan upload elementit
swingStages.forEach((stage, index) => {
  const div = document.createElement("div");
  div.innerHTML = `
    <label>${stage}: <input type="file" accept="image/*" id="img${index}"></label>
    <img id="preview${index}" style="max-width:100px; display:block; margin-top:5px;">
  `;
  container.appendChild(div);

  document.getElementById(`img${index}`).addEventListener('change', e => {
    const file = e.target.files[0];
    if(file){
      selectedImages[index] = file;
      const reader = new FileReader();
      reader.onload = function(ev){
        document.getElementById(`preview${index}`).src = ev.target.result;
      }
      reader.readAsDataURL(file);
    }
    analyzeBtn.disabled = selectedImages.includes(null);
  });
});

// Lähetä kuvat API:lle analysoitavaksi
analyzeBtn.addEventListener('click', async () => {
  resultsDiv.innerHTML = "";

  try {
    // Muuta kuvat base64:ksi
    const base64Images = await Promise.all(selectedImages.map(file => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target.result.split(',')[1]); // pelkkä base64 ilman prefixiä
      reader.onerror = err => reject(err);
      reader.readAsDataURL(file);
    })));

    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ images: base64Images })
    });

    const data = await response.json();

    if(data.analysis){
      const div = document.createElement("div");
      div.innerHTML = `<p>${data.analysis}</p>`;
      resultsDiv.appendChild(div);
    } else if(data.error){
      resultsDiv.innerHTML = `<p style="color:red">${data.error}</p>`;
    }

  } catch (err) {
    resultsDiv.innerHTML = `<p style="color:red">Error: ${err.message}</p>`;
  }
});
