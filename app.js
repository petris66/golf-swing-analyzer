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

analyzeBtn.addEventListener('click', async () => {
    resultsDiv.innerHTML = "<p>Analysoidaan...</p>";
    
    try {
        // Muunna kuvat base64-muotoon
        const base64Images = await Promise.all(selectedImages.map(file => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result.split(",")[1]); // Poistetaan data:image/... osa
                reader.onerror = () => reject("Kuvan lukeminen epäonnistui");
                reader.readAsDataURL(file);
            });
        }));

        // Lähetä POST-pyyntö omaan APIiin
        const response = await fetch("/api/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ images: base64Images })
        });

        if(!response.ok){
            throw new Error("Analyysi epäonnistui palvelimella");
        }

        const data = await response.json();
        resultsDiv.innerHTML = `<p>${data.analysis}</p>`;
    } catch (err) {
        console.error(err);
        resultsDiv.innerHTML = `<p style="color:red;">Virhe: ${err.message}</p>`;
    }
});
