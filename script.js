console.log(localStorage.getItem("userId"));


var page = document.getElementById("content");
var movieList = document.getElementById("movieList")
AddMovie('Harry Potter', 3);
AddMovie('Titanic', 2);
AddMovie('xfiles', 4);
AddMovie('Peter Pan', 1);

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

        /*fetch("users.json")
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
            });*/
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
    page.insertAdjacentHTML("beforeend", '<button id="Welcomepage">Login</button>')

    var welcomePageButton = document.getElementById("Welcomepage");

    welcomePageButton.addEventListener("click", function () {

        showLoginPage();

    })
}

function AddMovie(name, stock) {

    var data = {
        name: name,
        stock: stock
    };

    fetch('https://localhost:44361/api/film', {
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
    fetch("https://localhost:44361/api/film")
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