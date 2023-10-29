<?php
use OCP\Util;
$appId = OCA\CatGifs\AppInfo\Application::APP_ID;
Util::addScript($appId, $appId . '-mainScript');
Util::addStyle($appId, 'main');
?>

<div id="app-content">
<?php
if ($_['app_version']) {
    // you can get the values you injected as template parameters in the "$_" array
    echo '<h3>Report generation app version: ' . $_['app_version'] . '</h3>';
}
?>

    <div class="container">
        <form id="detailsForm">
            <label for="companyName">Company Name:</label><br>
            <input type="text" id="companyName" name="companyName"><br><br>

            <label for="industry">Industry:</label><br>
            <input type="text" id="industry" name="industry"><br><br>

            <label for="mission">Mission:</label><br>
            <textarea id="mission" name="mission"></textarea><br><br>

            <label for="vision">Vision:</label><br>
            <textarea id="vision" name="vision"></textarea><br><br>

            <label for="extraDetails">Extra Details:</label><br>
            <textarea id="extraDetails" name="extraDetails"></textarea><br><br>

            <input type="submit" value="Submit">
            <button type="button" id="clearFormBtn">Clear Form</button>
        </form>

        <div id="rightDiv">

        <div id="response"></div>
        <div id="loader" class="loader"></div>

        </div>
    </div>

</div>