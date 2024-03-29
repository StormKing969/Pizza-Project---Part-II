<?php include '../view/header.php'; ?>

<main>
    <section>
        <h1>Build Your Pizza!</h1>
        <form action="index.php" method="post">
            <input type="hidden" name="action" value="add_order">
            <h2>Pizza Size:</h2>
            <?php foreach ($sizes as $size) : ?>
                <input type="radio" name="pizza_size"  value="<?php echo $size['size']; ?>" required="required">
                <label><?php echo $size['size']; ?> </label>
            <?php endforeach; ?><br>

            <h2>Toppings:</h2>

            <div class="tabs">
                <a href="#"><span class="active">Meat</span></a>
                <a href="#"><span>Meatless</span></a>
            </div>
            <div>
                <div class="topping_category active"> 

                    <?php
                    foreach ($toppings as $topping) :
                        if ($topping['is_meat'] === '1') :
                            ?>
                            <input type="checkbox" name="pizza_topping[]"  value="<?php echo $topping['id']; ?>" >
                            <label><?php echo $topping['topping']; ?> </label><br>
                            <?php
                        endif;
                    endforeach;
                    ?> <br>
                </div>
                <div class="topping_category">
                    <?php
                    foreach ($toppings as $topping) :
                        if ($topping['is_meat'] !== '1') :
                            ?>
                            <input type="checkbox" name="pizza_topping[]"  value="<?php echo $topping['id']; ?>" >
                            <label><?php echo $topping['topping']; ?> </label><br>
                            <?php
                        endif;
                    endforeach;
                    ?> <br>
                </div>
            </div>
            <label>Username:</label>
            <select name="user_id" required="required">
                <?php foreach ($users as $user) : ?>
                    <option   <?php
                    if ($user_id == $user['id']) {
                        echo 'selected = "selected"';
                    }
                    ?> 
                        value="<?php echo $user['id']; ?>" > <?php echo $user['username']; ?>
                    </option>
                <?php endforeach; ?> 
            </select>
            </select><br><br>

            <input class="submitbutton" type="submit" value="Order Pizza" /> <br><br>
        </form>
    </section>
</main>
<script src="tabControl.js"></script>
<?php
include '../view/footer.php';
