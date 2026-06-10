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

analyzeBtn.addEventListener('click', () => {
    resultsDiv.innerHTML = "";
    swingStages.forEach((stage, index) => {
        const analysis = dummyAnalysis(index);
        const div = document.createElement("div");
        div.innerHTML = `<h3>${stage}</h3><p>${analysis}</p>`;
        resultsDiv.appendChild(div);
    });
});

function dummyAnalysis(index){
    switch(index){
        case 0: return "Tasapainoinen setup. Hieman enemmän vartalon pituutta voisi tuoda Fleetwood-tyyliä.";
        case 1: return "Takeaway hallittu. Maila voisi liikkua hieman matalammalla ja pidemmälle taakse.";
        case 2: return "Backswing hyvä, mutta lantio voisi pysyä hieman takana.";
        case 3: return "Downswing alkaa hyvin. Kädet hieman aktiiviset, pidempi lag auttaisi.";
        case 4: return "Impact vaihe hallittu. Paino voisi olla hieman enemmän vasemmalla ja takamus taaempana.";
        case 5: return "Follow-through hyvä, mutta pidempi rotaatio ja kädet korkeammalle voisi lisätä voimaa ja kontrollia.";
    }
}
