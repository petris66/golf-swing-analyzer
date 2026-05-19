# golf-swing-analyzer
6 kuvaa swingistä ja verrataan Tommy Fleetwoodin swingiin
<body>
    <h1>Golf Swing Analyzer</h1>

    <div id="instructions" style="background-color:#f0f0f0; padding:15px; border-radius:8px; margin:10px;">
        <h2>Ohjeet Swing Analyzerin käyttöön</h2>
        <ol>
            <li><strong>Ota swingistä video</strong>: Tallenna video puhelimeesi.</li>
            <li><strong>Avaa analyysiwebapp</strong>: Safari tai Chrome -selaimella osoitteessa <a href="https://analyze.golf" target="_blank">analyze.golf</a>.</li>
            <li><strong>Säädä videon nopeus</strong>: Oikeassa alakulmassa on nopeusmittari, aseta nopeus 0,1x.</li>
            <li><strong>Pysäytä video ja ota screenshotit</strong> kuudesta vaiheesta:
                <ol type="a">
                    <li>Osoiteasento</li>
                    <li>Takahuiskun alku</li>
                    <li>Takahuiskun huippu</li>
                    <li>Downswingin alku</li>
                    <li>Juuri ennen kontaktia</li>
                    <li>Follow-through</li>
                </ol>
            </li>
            <li><strong>Lataa screenshotit Swing Analyzeriin</strong> vaiheittain ja napsauta "Analysoi Swing".</li>
        </ol>
        <p><em>Vinkki:</em> Käytä selkeitä kuvia ja pyri ottamaan kuvat saman kokoisina ja oikeassa kulmassa. Safari toimii parhaiten iPhonessa.</p>
    </div>

    <div id="upload-container"></div>
    <button id="analyzeBtn" disabled>Analysoi Swing</button>
    <div id="results"></div>

    <script src="app.js"></script>
</body>
