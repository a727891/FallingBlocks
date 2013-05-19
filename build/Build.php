<?php
ini_set('auto_detect_line_endings',true);
$src = "";

$files = array("../README.md",
    "../src/main.js",
);

foreach($files as $file) {
    echo 'adding file '.$file.PHP_EOL;
    $src .= file_get_contents($file);
    $src .= "\n\n";
}

file_put_contents("FallingBlock.js", $src);
echo 'done.';
?>

