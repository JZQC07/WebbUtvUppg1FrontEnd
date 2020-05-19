console.log(localStorage.getItem("userId"));


var page = document.getElementById("content");
var movieList = document.getElementById("movieList")
AddMovie('Harry Potter', 3)



if (localStorage.getItem("userId") !== "null") {
    showWelcomePage();
} else {
    showLoginPage();
}



function showWelcomePage() {
    page.innerHTML = "";
    var print = "Hej och välkommen ";

    fetch("users.json")
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {

            print = print + json[localStorage.getItem("userId")].userName;
            page.insertAdjacentHTML("afterbegin", print);

        });


    page.insertAdjacentHTML("beforeend", "<div><button id='logoutButton'>Logga ut</button></div>");

    var logoutButton = document.getElementById("logoutButton");


    logoutButton.addEventListener("click", function () {
        localStorage.removeItem("userId");
        showLoginPage();
    });
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

        fetch("users.json")
            .then(function (response) {
                return response.json();
            })
            .then(function (json) {

                for (i = 0; i < json.length; i++) {
                    if (getUser == json[i].userLogin && getPass == json[i].userPassword) {
                        console.log("Ja, det stämmer!");
                        localStorage.setItem("userId", i);
                    }
                }

                if (localStorage.getItem("userId") !== null) {
                    showWelcomePage();
                } else {
                    showErrorPage();
                }
            });
    });
}

function RegisterMovieStudio(name, password, verified) {

    console.log("Add movie studio");

    var newMovieStudio = {
        name: name,
        password: password,
        verified: verified
    };

    fetch('https://localhost:44361/api/Filmstudio', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newMovieStudio),
        })
        .then(response => response.json())
        .then(newMovieStudio => {
            console.log('Success:', newMovieStudio);
        })
        .catch((err) => {
            console.error('Error:', err);
        });
}

function AddMovie(name, stock) {

    var data = {
        name: name,
        stock: stock
    };

    fetch('https://localhost:44361/api/Film', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.log('Error:', error);
        });
};



function showMovies() {
    fetch("https://localhost:44361/api/Film")
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            console.log("showMovies", json);
            for (i = 0; i < json.length; i++) {
                console.log(json[i].name)
                movieList.insertAdjacentHTML("beforeend", "<div><p>(" + json[i].id + ")" + json[i].name + "</p></div></div>")
            }
        });
};

var showMoviesButton = document.getElementById("rentMovies");
showMoviesButton.addEventListener("click", function () {
    showMovies();
});

var registerButton = document.getElementById("saveNew");
registerButton.addEventListener("click", function () {
    userName = document.getElementById("firstname", "lastname").value;
    name = document.getElementById("username").value;
    password = document.getElementById("password").value;

    RegisterMovieStudio(name.value, password.value, false);
})