
function open_page(newpage) {
	current_url = window.location.href;
	let n = current_url.lastIndexOf("/");
	// extract url base
	let url_base = current_url.substr(0, n + 1);
	let open_page_url = url_base + newpage;
	console.log(open_page_url);
	window.open(open_page_url, "_self");
}

function cleanAll() {
	setDbImageHashes([]);
	setUploadedImageHashes([]);
	setImageDistanceScore([]);
	setLocalImageArray([]);
	setHashDistanceScore([]);
	setLocalHashArray([]);
}

// -------------------------------------------

function alliesBaseURL() {
	return "http://160.40.53.31/ALLIES/";
}

function getDbImageHashes() {
	return JSON.parse(localStorage.getItem("db_image_hashes"));
}

function getUploadedImageHashes() {
	return JSON.parse(localStorage.getItem("uploaded_image_hashes"));
}

function getImageDistanceScore() {
	return JSON.parse(localStorage.getItem("image_distance_score"));
}

function getLocalImageArray() {
	return JSON.parse(localStorage.getItem("local_image_array"));
}

function getLocalHashArray() {
	return JSON.parse(localStorage.getItem("local_hash_array"));
}

function getHashDistanceScore() {
	return JSON.parse(localStorage.getItem("local_hash_distance_score"));
}

// -------------------------------------------

function setDbImageHashes(n) {
	localStorage.setItem("db_image_hashes", JSON.stringify(n));
}

function setUploadedImageHashes(n) {
	localStorage.setItem("uploaded_image_hashes", JSON.stringify(n));
}

function setImageDistanceScore(n) {
	localStorage.setItem("image_distance_score", JSON.stringify(n));
}

function setLocalImageArray(n) {
	localStorage.setItem("local_image_array", JSON.stringify(n));
}


function setHashDistanceScore(n) {
	localStorage.setItem("local_hash_distance_score", JSON.stringify(n));
}

function setLocalHashArray(n) {
	localStorage.setItem("local_hash_array", JSON.stringify(n));
}


