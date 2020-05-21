console.log(localStorage.getItem("userId"));


var page = document.getElementById("content");
var movieList = document.getElementById("movieList")
/*
AddMovie('Harry Potter', 3);
AddMovie('Titanic', 2);
AddMovie('Xfiles', 4);
AddMovie('Peter Pan', 1);
*/

RegisterMovieStudio('Jonatan', '1234', true);
RegisterMovieStudio('Kalle', 'Kalle', true);
RegisterMovieStudio('Peter', 'Peter', true);
RegisterMovieStudio('Stellan', 'Stell', true);




if (localStorage.getItem("userId") !== "null") {
    showWelcomePage();
} else {
    showLoginPage();
}


function showWelcomePage() {
    page.innerHTML = "";
    var print = "Hej och välkommen ";

    fetch("https://localhost:44361/api/filmstudio")
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {

            print = print + localStorage.userName;
            page.insertAdjacentHTML("afterbegin", print);

        });


    page.insertAdjacentHTML("beforeend", "<div><button id='logoutButton'>Logga ut</button></div>");

    var logoutButton = document.getElementById("logoutButton");


    logoutButton.addEventListener("click", function () {
        localStorage.removeItem("userId");
        showLoginPage();
    });

    page.insertAdjacentHTML("beforeend", "<div><input type='text' id='NewMovieName' placeholder='Enter Moviename here: '> <input type='number' id='stock' placeholder='Enter stock here: '> <button class='button' id='addMovieButton'>Add Movie</button></div>")
    var addMovieButton = document.getElementById("addMovieButton");
    addMovieButton.addEventListener("click", function () {
        var NewMovieName = document.getElementById("NewMovieName").value;
        var stock = document.getElementById("stock").value;
        console.log("Nytt filmnamn: " + NewMovieName + " Stock: " + stock);
        AddMovie(NewMovieName, stock);
    })
}



function showErrorPage() {

    page.insertAdjacentHTML("afterbegin", "<div>Dina uppgifter finns inte i vårat system. Har du glömt ditt lösenord?</div>");

}




function showLoginPage() {

    page.innerHTML = "";
    page.insertAdjacentHTML("afterbegin", 'Username: <input type="text" id="user" placeholder="Username"> Password: <input type="password" id="password" placeholder="Password"> <button id="spara">Login</button>');
    page.insertAdjacentHTML("beforeend", '<button id="saveNew">Register</button>');


    var loginButton = document.getElementById("spara");
    loginButton.addEventListener("click", function () {
        console.log("Tryck på login knappen");
        var getUser = document.getElementById("user").value;
        var getPass = document.getElementById("password").value;

        fetch("https://localhost:44361/api/filmstudio")
            .then(response => response.json())
            .catch(error => console.log(error.message))
            .then(json => FindUserAccount(json, getUser, getPass));


    });

    var registerButton = document.getElementById("saveNew");
    registerButton.addEventListener("click", function () {
        console.log("Tryck på register knappen!");
        showRegisterPage();

    });

}

function FindUserAccount(json, getUser, getPass) {
    try {
        var user = json.find(x => x.name === getUser && x.password === getPass && x.verified === true);
        if (user != null) {
            UserLogin(user);
        } else {
            showErrorPage();
        }
    } catch (error) {
        console.log(error.message);
    }
}

function UserLogin(user) {
    localStorage.userId = user.id;
    localStorage.userName = user.name;
    showWelcomePage();
}


function showRegisterPage() {
    page.innerHTML = "";
    page.insertAdjacentHTML("afterbegin", '<div class="RegisterText"><p>Enter Username and Password for your new account..</p></div>');
    page.insertAdjacentHTML("beforeend", 'Username: <input type="text" id="newuser" class="RegisterForm" placeholder="Username"> Password: <input type="password" id="newpassword" class="RegisterForm" placeholder="Password"> <button id="registernew">Register</button>');

    var registerNewButton = document.getElementById("registernew");
    registerNewButton.addEventListener("click", function () {
        console.log("Tryck på register new knappen!");
        var name = document.getElementById("newuser").value;
        var password = document.getElementById("newpassword").value;
        RegisterMovieStudio(name, password, true);

    });

}




function RegisterMovieStudio(name, password, verified) {

    page.innerHTML = "";
    console.log(name, password);


    var newMovieStudio = {
        name: name,
        password: password,
        verified: verified
    };

    fetch('https://localhost:44361/api/filmstudio', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify(newMovieStudio)
        })
        .then(response => response.json())
        .then(newMovieStudio => {
            console.log('Success:', newMovieStudio);
        })
        .catch((err) => {
            console.error('Error:', err);
        });
    page.insertAdjacentHTML("beforeend", '<div class="RegisterText"><p>Your new account has been created! Please login using your new credentials.</p></div>');
    page.insertAdjacentHTML("beforeend", '<button id="Welcomepage">Login</button>');

    var welcomePageButton = document.getElementById("Welcomepage");

    welcomePageButton.addEventListener("click", function () {

        showLoginPage();

    })
}

function AddMovie(NewMovieName, stock) {

    console.log("Inuti AddMovie metoden.");
    var stockString = stock.toString();
    Name = NewMovieName;
    var parsedStockString = parseInt(stockString);

    fetch('https://localhost:44361/api/film', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                Stock: parsedStockString,
                Name
            }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data, stock, stockString);
        })
        .catch((error) => {
            console.log('Error:', error);
        });
    alert("Ny film tillagd i biblioteket. Namn: " + NewMovieName + " Antal: " + stock);
}


var showMoviesButton = document.getElementById("rentMovies");
showMoviesButton.addEventListener("click", function () {
    console.log("Tryck på showMovies knappen");
    showMovies();
});


//LOGIK FÖR ATT VISA TRIVIA FÖR VARJE FILM -- FUNKAR!
function showTrivia(FilmId) {
    console.log("Inne i showTrivia metoden");
    fetch("https://localhost:44361/api/filmtrivia")
        .then(response => response.json())
        .then(trivias => trivias.filter(x => x.filmId == FilmId))
        .then(trivias => listTrivia(trivias))
        .catch(err => console.log(err.message));

}

//Skriver ut TRIVIA på sidan
function listTrivia(trivias) {
    console.log("Inne i listTrivia metoden.");
    trivias.forEach(trivia => {
        page.insertAdjacentHTML("afterbegin", '<div class="RegisterText"><p>Trivia: (' + trivia.trivia + ')</p></div>')
    });
}

//Första funktionen man kastas in i när man vill lägga till Trivia för film.
function CreateNewTrivia(FilmId) {

    console.log("Inne i CreateNewTrivia metoden.");
    console.log("FilmId: " + FilmId);
    page.innerHTML = "";
    page.insertAdjacentHTML("beforeend", '<form class="form" id="form"> <input type="text" id="triviaText" placeholder="Enter trivia text here.." name="studioName"> <button onclick="PostNewTrivia(' + FilmId + ');" type="submit" class="button" id="postTrivia">Save Trivia</button></form>');

}

//Funktionen man kastas in i när man postar trivia.
function PostNewTrivia(FilmId) {

    var Trivia = document.getElementById("triviaText").value;
    console.log("FilmId: " + FilmId + " Trivia Text: " + Trivia);
    console.log("Inne i PostNewTrivia metoden.");

    fetch('https://localhost:44361/api/filmtrivia', {
            method: 'POST',
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify({
                FilmId: Number(FilmId),
                Trivia: Trivia
            }),

        })
        .then(response => response.json())
        .then(json => console.log(json))
        .catch(err => console.log(err.message));

    alert("Tack för att du postar trivia " + localStorage.userName + "! :)");
}

function showMovies() {

    var srcTitanic = "/titanic.jpg";
    var srcXfiles = "/xfiles.png";
    var srcHarryPotter = "/HarryPotter.png";
    var srcPeterPan = "/PeterPan.png";
    console.log("Inne i showMovies metoden.");


    updateMovieList();
    fetch("https://localhost:44361/api/film")
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            console.log("showMovies", json);
            for (i = 0; i < json.length; i++) {
                console.log(json[i].name)
                movieList.insertAdjacentHTML("beforeend", "<div class='movieDiv'><img src='" + srcXfiles + "'/><p> Id: " + json[i].id + " | Title: " + json[i].name + " | Stock: " + json[i].stock + " </p> <button class='button' id='rentMovie1' onclick='RentMovie(" + json[i].id + ");' >Rent Movie</button> <button class='button' id='showTrivia1' onclick='showTrivia(" + json[i].id + ");' >Show Trivia</button> <button class='button' id='SaveTrivia1' onclick='CreateNewTrivia(" + json[i].id + ");' >Save Trivia</button> <button class='button' id='returnMovie' onclick='ReturnMovie(" + json[i].id + ");' >Return Movie</button></div>");
            }
        })
}



//Ta bort 1 från stock när en film har hyrts.
function AdjustQuantityForMovies() {

}






function updateMovieList() {
    for (i = 0; i < movieList.length; i++) {
        if (movieList[i].stock < 1) {
            delete movieList[i];
        }
    }
}

//Kunna hyra film FUNKAR NÄR INLOGGAD!
function RentMovie(FilmId) {
    console.log(" Inne i RentMovie metoden. FilmId: " + FilmId + " userId: " + localStorage.userId);

    fetch("https://localhost:44361/api/rentedfilm", {
            method: 'POST',
            body: JSON.stringify({
                FilmId: Number(FilmId),
                StudioId: Number(localStorage.userId)
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then(response => response.json())
        .catch(err => console.log(err.message));

    page.insertAdjacentHTML("beforeend", "<div><p>Lånet genomfördes. Tack för att du hyr film av oss!</p></div>");
}







//LÄMNA TILLBAKA FILM

function ReturnMovie(FilmId) {
    var studioId = localStorage.userId;
    console.log("Inne i returnMovie metoden. FilmId att lämna tillbaka: " + FilmId + " StudioId: " + studioId);
    fetch("https://localhost:44361/api/rentedfilm")
        .then(response => response.json())
        .catch(error => console.log(error.message))
        .then(json => RemoveRental(FilmId));

}

function RemoveRental(FilmId) {
    console.log("Inne i RemoveRental metoden");
    console.log("Film att lämna tillbaka: " + FilmId);

    fetch("https://localhost:44361/api/rentedfilm/" + FilmId, {
            method: 'DELETE',
        })
        .then(response => response.json())
    alert("Tack " + localStorage.userName + " för att du lämnat tillbaka filmen " + FilmId);
};