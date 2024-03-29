<?php
require('../model/database.php');
require('../model/order_db.php');
require('../model/topping_db.php');
require('../model/size_db.php');
require('../model/day_db.php');
require('../model/user_db.php');

$action = filter_input(INPUT_POST, 'action');
if ($action == NULL) {
    $action = filter_input(INPUT_GET, 'action');
    if ($action == NULL) {
        $action = 'student_welcome';
    }
}
$user_id = filter_input(INPUT_POST,'user_id',FILTER_VALIDATE_INT);
if ($user_id == NULL) {
    $user_id = filter_input(INPUT_GET, 'user_id');
}
$username = get_username($db, $user_id);
if ($action == 'student_welcome'|| $action == 'set_user') {
    try {
    $sizes = get_sizes($db);
    $toppings = get_toppings($db);
    $users = get_users($db);
    if (!empty($user_id)) {
    $user_preparing_orders = get_preparing_orders_by_user($db, $user_id);
    $user_baked_orders = get_baked_orders_by_user($db, $user_id);
    }
    } catch (PDOException $e) {
      $error_message = $e->getMessage(); 
      include('../errors/rest_error.php');
      exit();
    }
    include('student_welcome.php');
}    
 else if ($action == 'order_pizza') {
    try {
        $sizes = get_sizes($db);
        $toppings = get_toppings($db);
        $meat_toppings = array();
        $meatless_toppings = array();
        foreach($toppings as $top) {
            if ($top['is_meat'] === '1') {
                $meat_toppings[] = $top;
            } else {
                $meatless_toppings[] = $top;
            }
        }
      //    echo '<pre>';
      //  print_r($meat_toppings);
      //  echo '</pre>';
        $users = get_users($db);
    } catch (PDOException $e) {
        $error_message = $e->getMessage();
        include('../errors/database_error.php');    
        exit();
    }
    include ('order_pizza.php');
} elseif ($action == 'add_order') {
    $size = filter_input(INPUT_POST, 'pizza_size');
    try {
        $current_day = get_current_day($db);
    } catch (PDOException $e) {
        $error_message = $e->getMessage();
        include('../errors/database_error.php');
        exit();
    }
    $status = 'Preparing';
    $topping_ids = filter_input(INPUT_POST, 'pizza_topping', 
            FILTER_DEFAULT, FILTER_REQUIRE_ARRAY);
    if ($size == NULL || $size == FALSE || 
             $topping_ids === NULL) {
        $error = "Invalid size or topping data.";
        include('../errors/error.php');
        exit();
    }
    try {
        add_order($db, $user_id, $size, $current_day, $status, $topping_ids);
    } catch (PDOException $e) {
        $error_message = $e->getMessage();
        include('../errors/database_error.php');
        exit();
    }
    header("Location: .?user_id=$user_id");
} elseif ($action == 'update_order_status') {
    try {
        update_to_finished($db, $user_id);
    } catch (PDOException $e) {
        $error_message = $e->getMessage();
        include('../errors/database_error.php');
        exit();
    }
    header("Location: .?user_id=$user_id");
}
