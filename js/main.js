const calculateButton = document.getElementById("calculate");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function parseJSON(text) {
	try {
		return JSON.parse(text);
	} catch (e) {
		return null;
	}
}

document.forms[0].onsubmit = event => {
	event.preventDefault();
    const foodname = event.target.elements.foodname.value;
	const description = event.target.elements.description.value;
	const calories = event.target.elements.calories.value;
	const vegan = event.target.elements.vegan.value;
    validateFoodname(foodname);
    validateDescription(description);
    validateCalories(calories);
    validateVegan(vegan);
	const nameError = document.getElementById("error-food-name");
	const descriptionError = document.getElementById("error-description");
	const caloriesError = document.getElementById("error-calories");
	const veganError = document.getElementById("error-vegan");

	if (!nameError.innerText && !descriptionError.innerText && !caloriesError.innerText && !veganError.innerText) {
        let xhr = new XMLHttpRequest();
		xhr.onerror = function() {
			alert('We are sorry, a programm error occured. Please contact support.');
		};
		xhr.ontimeout = function() {
			alert('The remote system could not response in time. Please check the connection.')
		};
		let body = { 
			foodname : foodname,
			fooddesc : description,
			calories : calories,
			vegan : vegan
		};
		xhr.open("POST", "./main.php", true);   
		xhr.send(JSON.stringify(body));
		document.forms[0].reset();
	}

	getAllFoods();
}

function validateFoodname(foodname) {
    let nameError = document.getElementById("error-food-name");
    if (!foodname) {
		nameError.innerText = "Food name is required.";
	} else if (foodname.length > 20) {
		nameError.innerText = "Food name must be 20 characters or less.";
	} else {
		nameError.innerText = "";
	}
}

function validateDescription(description) {
    let descriptionError = document.getElementById("error-description");
    if (description.length > 200) {
		descriptionError.innerText = "Description must be 200 characters or less.";
	} else {
		descriptionError.innerText = "";
	}
}

function validateCalories(calories) {
    let caloriesError = document.getElementById("error-calories");
    if (!calories) {
		caloriesError.innerText = "Calories is required.";
	} else if (calories < 0) {
		caloriesError.innerText = "Calories must be higher than zero.";
	} else {
		caloriesError.innerText = "";
	}
}

function validateVegan(vegan) {
    let veganError = document.getElementById("error-vegan");
    if (!vegan) {
		veganError.innerText = "Vegan is required.";
	} else {
		veganError.innerText = "";
	}
}

function validateResponse(response) {
	if (response == null) return false;
	if (!Object.hasOwn(response, 'message')) return false;
	if (response.message == '') return false;
	return true;
}

calculateButton.onclick = () => {
	getAllFoods();
}

function getAllFoods() {
	let xhr = new XMLHttpRequest();
	xhr.onload = function() {
	let response = parseJSON(xhr.responseText);
		if (xhr.status == 200) {
			calculateFridge(response);
		} else {
			alert('We are sorry, a programm error occured. Please contact support.');
			console.error('Error during request: HTTP status = \'' + xhr.status + '\' / responseText = \'' + xhr.responseText + '\'');
		}
	}
	xhr.open("GET", "./main.php", true);
	xhr.send();
}

function calculateFridge(foods) {

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.reset();

	ctx.fillStyle = 'grey';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	let center = canvas.width / 2;
	ctx.moveTo(center, 0);
	ctx.lineTo(center, canvas.height);
	ctx.stroke();

	ctx.moveTo(0, 0);
	ctx.lineTo(canvas.width, 0);
	ctx.lineTo(canvas.width, canvas.height);
	ctx.lineTo(0, canvas.height);
	ctx.lineTo(0, 0);
	ctx.stroke();

	foods.forEach(food => {
		if (food.vegan == 1) {
			ctx.fillStyle = 'green';
			let x = (Math.random() * (canvas.width - 30 - center) + center);
			let y = (Math.random() * (canvas.height - 30));
			ctx.fillRect(x, y, 30, 30);
		} else {
			ctx.fillStyle = 'blue';
			let x = (Math.random() * (center - 30));
			let y = (Math.random() * (canvas.height - 30));
			ctx.fillRect(x, y, 30, 30);
		}
	});	
}