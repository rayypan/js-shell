'use strict';

// help variable
const help = "<font color=\"#7d7d7d\">General codes:</font>\n" +
             "help                    -- view this menu\n" +
             "echo(value, color)      -- print value in color, color is optional, no linefeed\n" +
             "println(value)          -- print value, with time, code, and line feed\n" +
             "printObj(value)         -- print value as JSON\n" +
             "printerr(value)         -- println() in red\n" +
             "printwrn(value)         -- println() in yellow\n" +
             "richPrint(value, color) -- print in color, color is optional\n" +
             "console.log()           -- same as println()\n" +
             "console.err()           -- same as printerr()\n" +
             "console.wrn()           -- same as printwrn()\n" +
             "console.cls()           -- same as cls()\n" +
             "cls()                   -- clear screen";

// extended help
const xhlp = "<font color=\"#7d7d7d\">DB management codes</font>\n" +
             "dbRoot                  -- prints local root path\n" +
             "getData(path)           -- print data at path as JSON\n" +
             "startDBListener(path)   -- start listening for database changes at path\n" +
             "runningListeners()      -- list currently running database listeners\n" +
             "stopDBListener(path)    -- stops listening at path\n" +
             "setData(path, value)    -- sets data = value(value is an object) to path\n" +
             "rmData(path)            -- removes data from path\n" +
             "encode(value)           -- converts special symbols to special string codes\n" +
             "decode(value)           -- opposite of encode()\n" +
             "\n<font color=\"red\">Warning:</font>\n" +
             " - If path is not passed to a function, it'll default to dbRoot, which is safe\n" +
             " - If you don't know what you're doing, DO NOT enter paths starting with '/'";

// debug flag
let debug = false;

// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// These credentials belong to a different person
let firebaseConfig = {
    apiKey: "AIzaSyCYFUVI60UBdQzY3kS0pinv2fPXtepqkRY",
    databaseURL: "https://cinexhome-default-rtdb.firebaseio.com",
    projectId: "cinexhome",
    storageBucket: "cinexhome.appspot.com",
    messagingSenderId: "979041174461",
    appId: "1:979041174461:web:61e0a0149d547bbd1648d4",
    measurementId: "G-R30VJ5L7JY"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
let database = firebase.database();

// database root
const dbRoot = "/ujff6jtn9zllr5oislx8wjf9fsof95bg90gd20nbonvjnqadqaah0awvfulbsi20/dbmonitor/";

// replace unsupported firebase characters with something else
function encode(str) {
    let spChars = "\n\r!\"#$%&'./<=>@[\\]{}";
    for (c of spChars) {
        str = str.replaceAll(c, "ASCII" + c.charCodeAt(0));
    }
    if (debug) console.info("Log: encode(): str = " + str);
    return str;
}

// data decoder function, replace encoded chars with special characters
function decode(str) {
    let spChars = "\n\r!\"#$%&'./<=>@[\\]{}";
    for (c of spChars) {
        str = str.replaceAll("ASCII" + c.charCodeAt(0), c);
    }
    if (debug) console.info("Log: decode(): str = " + str);
    return str;
}

let Code = "";

// simple print function
function echo(val, color) {
    color = color || "#eee";
    if (document.getElementById("console").innerHTML == "<font color=\"#7d7d7d\">Output appears here</font>") {
        document.getElementById("console").innerHTML = "";
    }
    if (typeof val === "object" && val.__classname__) {
        val = "[object " + val.__classname__ + "]";
    }
    val = "" + val;
    val = val.replaceAll("\n", "<br>")
             .replaceAll(" ", "&nbsp;")
             .replaceAll("\t", "&emsp;");
    document.getElementById("console").innerHTML += "<font color=\"" + color + "\">" + val + "</font>";
    document.getElementById("console").scrollTop = document.getElementById("console").scrollHeight;
}

// rich print function
function richPrint(val, color) {
    if (document.getElementById("console").innerHTML == "<font color=\"#7d7d7d\">Output appears here</font>") {
        document.getElementById("console").innerHTML = "";
    }
    val = val || "";
    color = color || "#eee";
    let Time = new Date();
    let timestamp = "<font color=\"#7d7d7d\">Time: [" + Time.getHours() + ":" + Time.getMinutes() + ":" + Time.getSeconds() + "]</font><br>";
    let code = "<font color=\"#7d7d7d\">Code: " + Code + "</font><br>";
    if (typeof val === "object" && val.__classname__) {
        val = "[object " + val.__classname__ + "]";
    }
    val = "" + val;
    val = val.replaceAll("\n", "<br>")
             .replaceAll(" ", "&nbsp;")
             .replaceAll("\t", "&emsp;");
    let output = timestamp + code + val + (val == "" ? "" : "<br>") + "<br>";
    document.getElementById("console").innerHTML += "<font color=\"" + color + "\">" + output + "</font>";
    document.getElementById("console").scrollTop = document.getElementById("console").scrollHeight;
}

// other print functions
function println(val) {
    val = val || "";
    richPrint(val, "#eee");
}

function printerr(val) {
    richPrint(val, "red");
}

function printwrn(val) {
    richPrint("" + val, "orange");
}

// print objects function
function printObj(obj) {
    println(JSON.stringify(obj, null, 4));
}

function cls() {
    document.getElementById("console").innerHTML = "<font color=\"#7d7d7d\">Output appears here</font>";
}

function updateWindowDotConsole() { 

    // redefining console.log to print output to the textarea
    window.console.log = function(val) {
        echo(val + "\n");
    };
    window.console.error = function(val) {
        printerr(val);
    };
    window.console.warn = function(val) {
        printwrn(val);
    };
    window.console.cls = function(val) {
        cls();
    };
}

// by element removal function array
Array.prototype.remove = function() {
    let what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
       }
    }
    return this;
};

// global data variable
let data;

// get data to variable 'data'
function getData(path) {
    if (path == undefined) {
        path = dbRoot;
    }
    else {
        path = (path.charAt(0) == "/") ? path : (dbRoot + path);
    }
    println();
    echo("<font color=\"#7d7d7d\">Path: " + path + "</font>\n");
    echo("Getting data...\n");
    database.ref(path).get().then(snapshot => {
        if (snapshot.exists()) {
            printObj(snapshot.val());
        }
        else {
            printerr("Failed: snapshot non-existent");
            data = null;
        }
    }).catch(error => {
        printerr(error);
        data = null;
    });
}

// holds paths of running listeners
let listeners = [];

// starts a listener
function startDBListener(path) {
    if (path == undefined) {
        path = dbRoot;
    }
    else {
        path = (path.charAt(0) == "/") ? path : (dbRoot + path);
    }
    println("Starting listener at: " + path);
    database.ref(path).on("value",(snapshot) => {
        if (snapshot.exists()) {
            data = snapshot.val();
            setTimeout(function() {
                println("Database update fetched: " + path);
            }, 1000);
            if (!listeners.includes(path)) {
                listeners.push(path);
            }
        }
        else {
            printerr("Failed: snapshot non-existent\nListener won't start");
            data = null;
            database.ref(path).off();
        }
    },
   (error) => {
        printerr(error);
        data = null;
    });
}

function runningListeners() {
    printObj(listeners);
}

function stopDBListener(path) {
    if (path == undefined) {
        path = dbRoot;
    }
    else {
        path = (path.charAt(0) == "/") ? path : (dbRoot + path);
    }
    if (listeners.includes(path)) {
        listeners.remove(path);
        database.ref(path).off();
        println("Stopped listening at: " + path);
    }
    else {
        printerr("Error: no listeners at: " + path);
    }
}

function setData(path, value) {
    if (arguments.length === 1) {
        [value] = arguments;
        path = dbRoot;
    }
    else {
        path = (path.charAt(0) == "/") ? path : (dbRoot + path);
    }
    value = value || "";
    println();
    echo("<font color=\"#7d7d7d\">Path: " + path + "</font>\n");
    if (value == "") {
        echo("Error: empty value\n", "red");
    }
    else {
        if (window.confirm("You are about to modify:\n" + path)) {
            try {
                database.ref(path).update(value).catch(error => {
                    echo(error + "\n", "red");
                    return;
                });
                echo("Data updated\n");
            }
            catch(e) {
                echo(e + "\n", "red");
            }
        }
        else {
            echo("Warning: action cancelled or failed\n", "yellow");
        }
    }
}

function rmData(path) {
    if (path == undefined) {
        printerr("Error: empty path");
        return;
    }
    else {
        path = (path.charAt(0) == "/") ? path : (dbRoot + path);
    }
    println();
    echo("<font color=\"#7d7d7d\">Path: " + path + "</font>\n");
    if (window.confirm("You are about to wipe:\n" + path)) {
        try {
            database.ref(path).remove().catch(error => {
                echo(error + "\n", "red");
                return;
            });
            echo("Data deleted\n");
        }
        catch(e) {
            echo(e + "\n", "red");
        }
    }
    else {
        echo("Warning: action cancelled or failed\n", "yellow");
    }
}

// function code history declared
function codeHistory(){};

// copy HTML
function copy(id, thisdom)
{
    navigator.clipboard.writeText(document.getElementById(id).innerHTML.replace(/<br>/g, '\n').replace(/<[^>]*>/g, ''))
    .then(() => {
        thisdom.innerHTML = "&ensp;Copied! ";
    })
    .catch(err => {
        thisdom.innerHTML = "&ensp;Failed! ";
        console.error(err);
    });
    setTimeout(function() {
        thisdom.innerHTML = "";
    }, 2000);
}

// modify value of console.log
updateWindowDotConsole();

// array to store previous commands of the session
let commands = {
    com: [],
    now: 0
};

// activity to run when run button clicked
document.getElementById("btn_run").addEventListener("click", function() {
    document.getElementById("terminal").focus();

    // replace all previous occurance of that code with new occurance
    if (commands.com.includes(Code = document.getElementById("terminal").value))
        commands.com.remove(Code);
    commands.com.push(Code);
    commands.now = commands.com.length;
    let ret = eval(Code);
    if (ret)
        println(ret);
    document.getElementById("terminal").value = "";
});

// code history and keyboard events defined
codeHistory = function(e) {
    if (document.getElementById("terminal") === document.activeElement && typeof e != "number")
        return;
    if (typeof e != "number")
        e = e.keyCode;
    switch (e) {
        case 13: // enter key
            document.getElementById("btn_run").click();
            document.getElementById("terminal").value = "";
        break;
        case 38: // up key
            if (commands.now >= 0 && commands.com [--commands.now] != undefined) {
                document.getElementById("terminal").value = commands.com [commands.now];
            }
            if (commands.now < 0) {
                commands.now = 0;
            }
        break;
        case 40:  // down key
            if (commands.now < commands.com.length && commands.com [++commands.now] != undefined) {
                document.getElementById("terminal").value = commands.com [commands.now];
            }
            if (commands.now > commands.com.length) {
                commands.now = commands.com.length;
            }
        break;
    }
}

// actions taken when arrow keys are pressed
document.onkeydown = function(e) {  
    codeHistory(e);
};

// setting version value
document.getElementById("footer").innerHTML = "Version 2023.06.02.19.35";
window.onerror = function(error) {
    console.error("Error: " + error);
}
