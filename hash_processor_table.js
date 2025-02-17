
function hideMaxHashImgSelect() {
    let area = document.getElementById("myMaxImageSelectHash");
    area.style.display = "none";
}

function showMaxHashImgSelect() {
    let area = document.getElementById("myMaxImageSelectHash");
    area.style.display = "block";
}

function getSearchStrategy() {
    let radios = document.getElementsByName("match_strategy_hash");
    let retval = 0;

    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            retval = i;
            break;
        }
    }
    return retval;
}

function getSelectedIndex() {
    let selectBox = document.getElementById("myMaxImageSelectHashId");
    let selectedIndex = selectBox.selectedIndex + 1;
    return selectedIndex;
}

function getLocalImageInBase64(imageid) {
    let localimages = getLocalImageArray();
    for (let i = 0; i < localimages.ImagesToHash.length; i++) {
        if (imageid == localimages.ImagesToHash[i].id) {
            return "data:image;base64," + localimages.ImagesToHash[i].image;
        }
    }
    return "";
}

function hideZoomArea() {
    let area = document.getElementById("zoom-container-hash");
    area.style.display = "none";
}

function showZoomArea() {
    let area = document.getElementById("zoom-container-hash");
    area.style.display = "block";
}

function hideTableArea() {
    let area = document.getElementById("table-container-hash");
    area.style.display = "none";
}

function showTableArea() {
    let area = document.getElementById("table-container-hash");
    area.style.display = "block";
}

function zoomImage(data) {

    let zoomarea = document.getElementById("zoom-container-hash");
    hideTableArea();
    showZoomArea();
    zoomarea.innerHTML = "<center><img src=\"" + data + "\"><p>" +
        "<button type=\"button\" " +
        "onclick=\"hideZoomArea();" +
        "showTableArea();\">Close</button>" +
        "</center>";
}

function tabularize(s) {
    let retval = "";
    for (let i = 0; i < s.length; i++) {
        retval += s.charAt(i);
        if ((i % 10) == 9) {
            retval += "<br>"
        }
    }
    return retval;
}

function buildTableRow(sourcehash, similarimgs, exactsearch) {

    if (sourcehash == "")
        return;

    let tablerow = "<center><table>";
    tablerow += "<tr>";

    // source hash
    tablerow += "<td valign=\"top\">";
    tablerow += "<table style =\"border: none;\"><tr><td>";
    tablerow += "<center>Image Hash</center><br>";
    tablerow += tabularize(sourcehash);
    tablerow += "</td></tr></table>";
    tablerow += "</td>";

    //----------------------
    tablerow += "<td>";
    // similar images subtable

    if (similarimgs.length == 0) {
        tablerow += "<center><h3>No Similar images found</h3></center>";
    } else { // ---------------------------
        tablerow += "<table style =\"border: none;\">";
        tablerow += "<tr>";
        tablerow += "<td><center>Similar image found</center></td>";
        tablerow += "<td><center>Score</center></td>";
        tablerow += "</tr>";

        let n = 1;
        if (exactsearch == false) {

            let maxImagesAllowed = getSelectedIndex();

            if (maxImagesAllowed >= similarimgs.length) {
                n = similarimgs.length;
            } else {
                n = maxImagesAllowed;
            }
        }

        for (let i = 0; i < n; i++) {

			// ignore score <0.9
			if (similarimgs[i].score < 0.9) {
				continue;
			}
			
            let imgurl = alliesBaseURL() + "images/" +
                similarimgs[i].id + ".jpg";

            let mini_image = "<img src=\"" + imgurl +
                "\" onclick=\"zoomImage('" + imgurl +
                "')\"width=\"200\">";

            tablerow += "<tr>";
            tablerow += "<td>";
            // image similar src
            tablerow += mini_image;
            tablerow += "</td>";

            tablerow += "<td>";
            // score
            tablerow += "<center><b><h3>" +
                (similarimgs[i].score * 100).toFixed(2) +
                "%</h3><b></center>";
            tablerow += "</td>";

            tablerow += "</tr>";
        }
        tablerow += "</table>";
    } // ---------------------------

    tablerow += "</td>";
    tablerow += "</tr>";
    tablerow += "</center></table>";
    return tablerow;
}

async function searchHashImages() {

    let imagesTable = "";
    let exactsearch = true;

    if (getSearchStrategy() == 1) {
        exactsearch = false;
    }

    let scoreBoard = getHashDistanceScore();
    console.log(JSON.stringify(scoreBoard));

    for (let i = 0; i < scoreBoard.ScoredHashes.length; i++) {
        let sourceid = scoreBoard.ScoredHashes[i].id;
        let sourceIdHash = scoreBoard.ScoredHashes[i].hash;
        let similarimgs = scoreBoard.ScoredHashes[i].similar_images_sorted;
        imagesTable += buildTableRow(sourceIdHash, similarimgs, exactsearch);
    }

    let tableContainer = document.getElementById('table-container-hash');
    tableContainer.innerHTML = imagesTable;
}
