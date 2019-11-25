<?php include '../view/header.php'; ?>
<main>
    <section>
    <h1>Add Topping</h1>
    <form action="index.php" method="post">
        <input type="hidden" name="action" value="add_topping">

        <label>Topping Name:</label>
        <input type="text" name="topping_name" />
        <br>
        <br>
        <label>Does this topping contain meat?</label>
        <input type="radio" name="is_meat"  value="meat" required="required">
        <label>Has Meat</label>
        <input type="radio" name="is_meat"  value="meatless" required="required">
        <label>Meatless</label>
        <br>
        <br>
        <label>&nbsp;</label>
        <input class="submitbutton" type="submit" value="Add" />
        <br>
        <br>
    </form>
    <p>
        <a href="index.php?action=list_toppings">View Topping List</a>
    </p>
    </section>
</main>
<?php include '../view/footer.php'; 