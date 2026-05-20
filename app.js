const swingStages = [
  "Osoiteasento",
  "Takahuiskun alku",
  "Takahuiskun huippu",
  "Downswingin alku",
  "Juuri ennen kontaktia",
  "Follow-through"
];

const selectedFiles = Array(6).fill(null);
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

    document.getElementById(`img${index}`).addEventListener("change", e => {
        const file = e.target.files[0];
        selectedFiles[index] = file || null;

        if(file){
            const reader = new FileReader();
            reader.onload = function(ev){
                document.getElementById(`preview${index}`).src = ev.target.result;
            };
            reader.readAsDataURL(file);
        }

        analyzeBtn.disabled = selectedFiles.includes(null);
    });
});

analyzeBtn.addEventListener("click", async () => {
    resultsDiv.innerHTML = "";
    analyzeBtn.disabled = true;

    try {
        // Muunna kaikki kuvat base64:ksi
        const base64Images = await Promise.all(
            selectedFiles.map(file => fileToBase64(file))
        );

        // POST request serverless functioniin
        const response = await fetch("/api/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ images: base64Images })
        });

        const data = await response.json();

        if(data.error){
            resultsDiv.innerHTML = `<p style="color:red;">Virhe: ${data.error}</p>`;
        } else {
            const lines = data.analysis.split("\n");
            lines.forEach((line, i) => {
                const div = document.createElement("div");
                div.innerHTML = `<h3>${swingStages[i] || ""}</h3><p>${line}</p>`;
                resultsDiv.appendChild(div);
            });
        }

    } catch(err){
        resultsDiv.innerHTML = `<p style="color:red;">Virhe: ${err.message}</p>`;
        console.error(err);
    }

    analyzeBtn.disabled = false;
});

// Funktio File -> base64
function fileToBase64(file){
    return new Promise((resolve, reject) => {
        if(!file) return resolve(null);
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(",")[1]); // vain data
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}
