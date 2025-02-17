
function open_page(newpage) {
    current_url = window.location.href;
    let n = current_url.lastIndexOf("/");
    let url_base = current_url.substr(0, n + 1);
    let open_page_url = url_base + newpage;
    console.log(open_page_url);
    window.open(open_page_url, "_self");
}

async function uploadImages() {
    let fileInput = document.getElementById("fileInput");
    let files = fileInput.files;

    if (files.length === 0) {
        alert("Please select at least one file.");
        return;
    }

    let imagesArray = [];

    for (let file of files) {
        let base64String = await convertToBase64(file);
        imagesArray.push({
            id: generateUniqueId(),
            image: base64String
        });
    }

    let requestData = {
        ImagesToHash: imagesArray
    };

    setLocalImageArray(requestData);

    try {
        await hashImageAndCompare(requestData);
        return;

    } catch (error) {
        console.error("Error:", error);
        alert("Error detected!");
    }
}

async function hashImageAndCompare(requestDataImage) {

    // Step 1: Call /hash_production_image

    const hashResponse = await fetch('http://160.40.53.31:5000/hash_production_image', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestDataImage)
    });

    const hashData = await hashResponse.json();
    console.log('Hash Response:', hashData);

    if (!hashData.HashedImages || hashData.HashedImages.length === 0) {
        console.error('No hash received');
        return;
    }

    setUploadedImageHashes(hashData);

    const requestDataDistanceScore = {
        "HashesToScore": getUploadedImageHashes().HashedImages,
        "ImageDatabaseHashList": getDbImageHashes(),
        "rank": 10
    };


    // Step 2: Call /image_distance_score
    const scoreResponse = await fetch('http://160.40.53.31:5000/image_distance_score', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestDataDistanceScore)
    });

    const scoreData = await scoreResponse.json();
    console.log('Score Response:', scoreData);
    setImageDistanceScore(scoreData);
    if (scoreData.ScoredHashes.length == 0) {
        alert("Error detected!");
    } else {
        open_page("image_processor_table.html");
    }
    return;
}

function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]); // Remove metadata (data:image/png;base64,)
        reader.onerror = (error) => reject(error);
    });
}

function generateUniqueId() {
    return Math.floor(Math.random() * 1000000000).toString(); // Simple random ID generator
}

