<?php include '../view/header.php'; ?>
<main>
    <section>
    <h1>Topping List</h1>

	<h2>Toppings</h2>
         <table>
            <tr>
                <th>Topping Name</th>
                <th>Has Meat?</th>
                <th>&nbsp;</th>
            </tr>
            <?php foreach ($toppings as $topping) : ?>
            <tr>
                <td><?php echo $topping['topping']; ?></td>
                <td><?php echo $topping['is_meat'] === '1'? 'yes':'no'; ?></td>
                <td><form action="." method="post">
                    <input type="hidden" name="action"
                           value="delete_topping">
                    <input type="hidden" name="topping_id"
                           value="<?php echo $topping['id']; ?>">        
                    <input type="submit" value="Delete">
                </form></td>
            </tr>
            <?php endforeach; ?>
        </table>
    <p>
        <a href=".?action=show_add_form">Add Topping</a>
    </p>
    </section>
</main>
<?php include '../view/footer.php'; 
