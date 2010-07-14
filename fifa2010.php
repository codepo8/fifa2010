<?php
header('Content-type: text/javascript');
echo 'var fifa = {};fifa.data =';
$url = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20csv%20where%20url%3D%22http%3A%2F%2Fspreadsheets.google.com%2Fpub%3Fkey%3D0AhphLklK1Ve4dEdrWC1YcjVKN0ZRbTlHQUhaWXBKdGc%26single%3Dtrue%26gid%3D1%26x%3D1%26output%3Dcsv%22%20and%20columns%3D%22surname%2Cteam%2Cposition%2Ctime%2Cshots%2Cpasses%2Ctackles%2Csaves%22&format=json';
$ch = curl_init(); 
curl_setopt($ch, CURLOPT_URL, $url); 
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); 
$output = curl_exec($ch); 
curl_close($ch);
echo $output;
?>
