
function hideMaxImgSelect() {
    let area = document.getElementById("myMaxImageSelect");
    area.style.display = "none";
}

function showMaxImgSelect() {
    let area = document.getElementById("myMaxImageSelect");
    area.style.display = "block";
}

function getSearchStrategy() {
    let radios = document.getElementsByName("match_strategy");
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
    let selectBox = document.getElementById("myMaxImageSelectId");
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
    let area = document.getElementById("zoom-container");
    area.style.display = "none";
}

function showZoomArea() {
    let area = document.getElementById("zoom-container");
    area.style.display = "block";
}

function hideTableArea() {
    let area = document.getElementById("table-container");
    area.style.display = "none";
}

function showTableArea() {
    let area = document.getElementById("table-container");
    area.style.display = "block";
}

function zoomImage(data) {

    let zoomarea = document.getElementById("zoom-container");
    hideTableArea();
    showZoomArea();
    zoomarea.innerHTML = "<center><img src=\"" + data + "\"><p>" +
        "<button type=\"button\" " +
        "onclick=\"hideZoomArea();" +
        "showTableArea();\">Close</button>" +
        "</center>";
}

function buildTableRow(sourceimgbase64, similarimgs, exactsearch) {

    if (sourceimgbase64 == "")
        return;

    let orig_image = "<img src=\"" +
        sourceimgbase64 +
        "\" onclick=\"zoomImage('" +
        sourceimgbase64 +
        "')\"  width=\"200\">";

    //----------------------

    let tablerow = "<center><table>";
    tablerow += "<tr>";

    // source image
    tablerow += "<td valign=\"top\">";
    tablerow += "<table style =\"border: none;\"><tr><td>";
    tablerow += "<center>Original image</center><br>";
    tablerow += orig_image;
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
        tablerow += "<td><center>Similar found</center></td>";
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

async function searchImages() {

    let imagesTable = "";
    let exactsearch = true;

    if (getSearchStrategy() == 1) {
        exactsearch = false;
    }

    let scoreBoard = getImageDistanceScore();
    console.log(JSON.stringify(scoreBoard));

    for (let i = 0; i < scoreBoard.ScoredHashes.length; i++) {
        let sourceimgid = scoreBoard.ScoredHashes[i].id;
        let sourceimgbase64 = getLocalImageInBase64(sourceimgid);
        let similarimgs = scoreBoard.ScoredHashes[i].similar_images_sorted;
        imagesTable += buildTableRow(sourceimgbase64, similarimgs, exactsearch);
    }

    let tableContainer = document.getElementById('table-container');
    tableContainer.innerHTML = imagesTable;
}
