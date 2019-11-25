<?php
function get_toppings() {
    global $db;
    $query = 'SELECT topping FROM menu_toppings';
    $statement = $db->prepare($query);
    $statement->execute();
    $toppings = $statement->fetchAll();
    $statement->closeCursor();
    return $toppings;    
}
?>