function submitHashList() {

    let c1 = document.getElementById('HashList').value;

    let isCommaSeparated = (c1.search(",") > 0);

    let tempHashList = [];

    // csv or lf separation accepted

    if (isCommaSeparated) {
        tempHashList = c1.split(",");
        for (let i = 0; i < tempHashList.length; i++) {
            tempHashList[i] = tempHashList[i].trim();
        }
    } else {
        tempHashList = c1.split("\n");
    }

    let HashList = [];

    for (let i = 0; i < tempHashList.length; i++) {
        if (tempHashList[i] == "")
            continue;

        let obj = {
            id: generateUniqueId(),
            hash: tempHashList[i]
        };
        HashList.push(obj);
    }

    console.log(HashList);
    if (HashList.length == 0) {
        alert('Please enter hashes data');
    }
    uploadHashes(HashList);

}

function clearHashList() {
    document.getElementById('HashList').value = '';
}

async function uploadHashes(hashesList) {

    setLocalHashArray(hashesList);

    const requestHashDistanceScore = {
        "HashesToScore": hashesList,
        "ImageDatabaseHashList": getDbImageHashes(),
        "rank": 10
    };

    try {
        await hashListCompare(requestHashDistanceScore);
        return;

    } catch (error) {
        console.error("Error:", error);
        alert("Error detected!");
    }
}

async function hashListCompare(requestData) {

    //  Call /image distance score api
    const scoreResponse = await fetch('http://160.40.53.31:5000/image_distance_score', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    });

    const scoreData = await scoreResponse.json();
    console.log('Score Response:', scoreData);
    setHashDistanceScore(scoreData);

    if (scoreData.ScoredHashes.length == 0) {
        alert("Error detected!");
    } else {
        open_page("hash_processor_table.html");
    }
    return;
}

function generateUniqueId() {
    return Math.floor(Math.random() * 1000000000).toString(); // Simple random ID generator
}