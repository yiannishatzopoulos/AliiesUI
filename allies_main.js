

function readUrlSync(url) {
    let retval = "";
    try {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url, false); // false makes the request synchronous
        xhr.send();
        if (xhr.status === 200) {
            retval = xhr.responseText;
            console.log(retval); // Output the array to console for verification
        } else {
            console.error(`HTTP error! Status: ${xhr.status}`);
        }
    } catch (error) {
        console.error("Error fetching image IDs:", error);
    }
    return retval;
}

function fetchImageIDsAndHashes() {
    let local_db_image_hashes = [];

    let url = alliesBaseURL() + "image_ids.txt";
    let image_ids = [];

    try {
        text = readUrlSync(url);
        image_ids = text.split("\n").map(line => line.trim()).filter(line => line !== "");
        console.log(image_ids); // Output the array to console for verification

        for (i = 0; i < image_ids.length; i++) {
            image_id = image_ids[i];
            image_hash = fetchImageHash(image_id);
            local_db_image_hashes.push({
                id: image_id,
                hash: image_hash
            });
        }

        setDbImageHashes(local_db_image_hashes);

    } catch (error) {
        console.error("Error fetching image IDs and hashes:", error);
    }
}

function fetchImageHash(imageid) {
    let url = alliesBaseURL() + "hashes/" + imageid + ".txt";
    let image_hash = "";
    try {
        image_hash = readUrlSync(url);
        console.log(image_hash); // Output the array to console for verification
    } catch (error) {
        console.error("Error fetching image IDs:", error);
    }
    return image_hash;
}

function onLoadFunction() {
    fetchImageIDsAndHashes();
}


