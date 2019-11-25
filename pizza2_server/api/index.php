<?php
require __DIR__ . '/../vendor/autoload.php';
require 'initial.php';
// provide aliases for long classname--
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

set_local_error_log(); // redirect error_log to ../php_server_errors.log
// Instantiate the app
$app = new \Slim\App();
// Add middleware that can add CORS headers to response (if uncommented)
// These CORS headers allow any client to use this service (the wildcard star)
// We don't need CORS for the ch05_gs client-server project, because
// its network requests don't come from the browser. Only requests that
// come from the browser need these headers in the response to satisfy
// the browser that all is well. Even in that case, the headers are not
// needed unless the server for the REST requests is different than
// the server for the HTML and JS. When we program in Javascript we do
// send requests from the browser, and then the server may need to
// generate these headers.
// Also specify JSON content-type, and overcome default Allow of GET, PUT
// Note these will be added on failing cases as well as sucessful ones
$app->add(function ($req, $res, $next) {
    $response = $next($req, $res);
    return $response
                    ->withHeader('Access-Control-Allow-Origin', '*')
                    ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
                    ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
                    ->withHeader('Content-Type', 'application/json')
                    ->withHeader('Allow', 'GET, POST, PUT, DELETE');
});
// Turn PHP errors and warnings (div by 0 is a warning!) into exceptions--
// From https://stackoverflow.com/questions/1241728/can-i-try-catch-a-warning
set_error_handler(function($errno, $errstr, $errfile, $errline) {
    // error was suppressed with the @-operator--
    // echo 'in error handler...';
    if (0 === error_reporting()) {
        return false;
    }
    throw new ErrorException($errstr, 0, $errno, $errfile, $errline);
});

// Slim has default error handling, but not super useful
// so we'll override those handlers so we can handle errors 
// in this code, and report file and line number.
// This also means we don't set $config['displayErrorDetails'] = true;
// because that just affects the default error handler.
// See https://akrabat.com/overriding-slim-3s-error-handling/
// To see this in action, put a parse error in your code
$container = $app->getContainer();
$container['errorHandler'] = function ($container) {
    return function (Request $request, Response $response, $exception) {
        // retrieve logger from $container here and log the error
        $response->getBody()->rewind();
        $errorJSON = '{"error":{"text":' . $exception->getMessage() .
                ', "line":' . $exception->getLine() .
                ', "file":' . $exception->getFile() . '}}';
        //     echo 'error JSON = '. $errorJSON;           
        error_log("server error: $errorJSON");
        return $response->withStatus(500)
                        //            ->withHeader('Content-Type', 'text/html')
                        ->write($errorJSON);
    };
};

// This function should not be called because errors are turned into exceptons
// but it still is, on error 'Call to undefined function' for example
$container['phpErrorHandler'] = function ($container) {
    return function (Request $request, Response $response, $error) {
        // retrieve logger from $container here and log the error
        $response->getBody()->rewind();
        echo 'PHP error:  ';
        print_r($error->getMessage());
        $errorJSON = '{"error":{"text":' . $error->getMessage() .
                ', "line":' . $error->getLine() .
                ', "file":' . $error->getFile() . '}}';
        error_log("server error: $errorJSON");
        return $response->withStatus(500)
                        //  ->withHeader('Content-Type', 'text/html)
                        ->write($errorJSON);
    };
};
$app->get('/day', 'getDay');
// TODO add routes and functions for them,using ch05_gs_server code as a guide
$app->post('/day', 'postDay');
$app->get('/toppings/2', 'getToppings2');
$app->get('/toppings', 'getToppings');
$app->get('/sizes', 'getSizes');
$app->get('/users', 'getUsers');
$app->get('/orders/{id}', 'getOrdersID');
$app->get('/orders', 'getOrders');
$app->post('/orders', 'postOrders');
$app->put('/orders/{id}', 'putOrdersID');

// Take over response to URLs that don't match above rules, to avoid sending
// HTML back in these cases
$app->map(['GET', 'POST', 'PUT', 'DELETE'], '/{routes:.+}', function($req, $res) {
    $uri = $req->getUri();
    $errorJSON = '{"error": "HTTP 404 (URL not found) for URL ' . $uri . '"}';
    return $res->withStatus(404)
                    ->write($errorJSON);
});
$app->run();

// functions without try-catch are depending on overall
// exception handlers set up above, which generate HTTP 500
// Functions that need to generate HTTP 400s (client errors)
// have try-catch
// Function calls that don't throw return HTTP 200
function getDay(Request $request, Response $response) {
    error_log("server getDay");
    $sql = "select current_day FROM pizza_sys_tab";
    $db = getConnection();
    $stmt = $db->query($sql);
    // fetch just column 0 value--
    return $stmt->fetch(PDO::FETCH_COLUMN, 0);
}

function postDay(Request $request, Response $response) {
    error_log("server postDay");
    $db = getConnection();
    initial_db($db);
    return "1";  // new day value
}

function getToppings2(Request $request, Response $response) {
    error_log("server getToppings");
    $db = getConnection();
    $query = 'SELECT * FROM menu_toppings WHERE id = "2"';
    $statement = $db->prepare($query);
    $statement->execute();
    $toppings = $statement->fetchAll(PDO::FETCH_ASSOC);
    $statement->closeCursor();
    echo json_encode($toppings);
}

function getToppings(Request $request, Response $response) {
    error_log("server getToppings");
    $db = getConnection();
    $query = 'SELECT * FROM menu_toppings';
    $statement = $db->prepare($query);
    $statement->execute();
    $toppings = $statement->fetchAll(PDO::FETCH_ASSOC);
    $statement->closeCursor();
    echo json_encode($toppings);
}

function getSizes(Request $request, Response $response) {
    error_log("server getSizes");
    $db = getConnection();
    $query = 'SELECT * FROM menu_sizes';
    $statement = $db->prepare($query);
    $statement->execute();
    $sizes = $statement->fetchAll(PDO::FETCH_ASSOC);
    $statement->closeCursor();
    echo json_encode($sizes);
}

function getUsers(Request $request, Response $response) {
    error_log("server getUsers");
    $db = getConnection();
    $query = 'SELECT * FROM shop_users';
    $statement = $db->prepare($query);
    $statement->execute();
    $users = $statement->fetchAll(PDO::FETCH_ASSOC);
    $statement->closeCursor();
    echo json_encode($users);
}

function getOrdersID(Request $request, Response $response, $args) {
    error_log("server getOrdersID");
    $id = $args['id'];
    $db = getConnection();
    $query = 'SELECT * FROM pizza_orders WHERE id = :id';
    $statement = $db->prepare($query);
    $statement->bindValue(":id", $id);
    $statement->execute();
    $orders = $statement->fetch(PDO::FETCH_ASSOC);
    if ($orders === FALSE) {
        // can't find orders, so return not-found
        $errorJSON = '{"error": "HTTP 404": "orders not found"}';
        error_log("server error $errorJSON");
        return $response->withStatus(404) // client error
                        ->write($errorJSON);     
    }
    $statement->closeCursor();
    echo json_encode($orders);
}

function getOrders(Request $request, Response $response) {
    error_log("server getOrders");
    $db = getConnection();
    $query = 'SELECT * FROM pizza_orders';
    $statement = $db->prepare($query);
    $statement->execute();
    $orders = $statement->fetchAll(PDO::FETCH_ASSOC);
    $statement->closeCursor();
    echo json_encode($orders);
}

function postOrders(Request $request, Response $response) {
    error_log("server postOrders");
    error_log("server: body: " . $request->getBody());
    $orders = $request->getParsedBody();  // Slim does JSON_decode here
    error_log('server: parsed orders = ' . print_r($orders, true));
    if ($orders == NULL) { // parse failed (bad JSON)
        $errorJSON = '{"error":{"HTTP 400":"bad JSON in request"}}';
        error_log("server error $errorJSON");
        return $response->withStatus(400)  //client error
                        ->write($errorJSON);
    }
    try {
        $db = getConnection();
        $orderID = addOrder($db, $orders['user_id'], $orders['size'], $orders['day'], $orders['status']);
    } catch (PDOException $e) {
        // if duplicate product, blame client--
        if (strstr($e->getMessage(), 'SQLSTATE[23000]')) {
            $errorJSON = '{"error":{"HTTP 400":' . $e->getMessage() .
                    ', "line":' . $e->getLine() .
                    ', "file":' . $e->getFile() . '}}';
            error_log("server error $errorJSON");
            return $response->withStatus(400) // client error
                            ->write($errorJSON);
        } else {
            throw($e);  // generate HTTP 500 as usual         
        }
    }
    $orders['id'] = $orderID;  // fix up id to current one
    $JSONcontent = json_encode($orders);
    //echo $JSONcontent;  // wouldn't provide location header
    $location = $request->getUri() . '/' . $orders["id"];
    return $response->withHeader('Location', $location)
                    ->withStatus(200)
                    ->write($JSONcontent);
}

function addOrder($db, $user_id, $size, $day, $status) {
    error_log("server addOrder");
    $query = 'INSERT INTO pizza_orders
                 (user_id, size, day, status)
              VALUES
                 (:user_id, :size, :day, :status)';
    $statement = $db->prepare($query);
    $statement->bindValue(':user_id', $user_id);
    $statement->bindValue(':size', $size);
    $statement->bindValue(':day', $day);
    $statement->bindValue(':status', $status);
    $statement->execute();
    $statement->closeCursor();
    $id = $db->lastInsertId();
    return $id;
}

function putOrdersID(Request $request, Response $response, $args) {
    error_log("server putOrdersID");
    $id = $args['id'];
    $db = getConnection();
    $query = 'UPDATE pizza_orders SET status=\'Baked\' WHERE id = :id';
    $statement = $db->prepare($query);
    $statement->bindValue(":id", $id);
    $statement->execute();
    $statement->closeCursor();
}

// set up to execute on XAMPP or at topcat.cs.umb.edu:
// --set up a mysql user named pizza_user on your own system
// --see database/dev_setup.sql and database/createdb.sql
// --load your mysql database on topcat with the pizza db
// Then this code figures out which setup to use at runtime
function getConnection() {
    if (gethostname() === 'topcat') {
        $dbuser = 'wasajana';  // CHANGE THIS to your cs.umb.edu username
        $dbpass = 'wasajana';  // CHANGE THIS to your mysql DB password on topcat 
        $dbname = $dbuser . 'db'; // our convention for mysql dbs on topcat   
    } else {  // dev machine, can create pizzadb
        $dbuser = 'pizza_user';
        $dbpass = 'pa55word';  // or your choice
        $dbname = 'pizzadb';
    }
    $dsn = 'mysql:host=localhost;dbname=' . $dbname;
    $dbh = new PDO($dsn, $dbuser, $dbpass);
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $dbh;
}
