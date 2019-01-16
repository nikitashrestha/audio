<?php
include('variables.php');
print_r($_FILES); //this will print out the received name, temp name, type, size, etc.
print($count);
$input = $_FILES['audio_data']['tmp_name']; //get the temporary name that PHP gave to the uploaded file
$username = $_POST['username'];
$gender = $_POST['gender'];
print($_POST['username']);
print($_POST['gender']);
$des = "upload/$username$count.wav";//letting the client control the filename is a rather bad idea
 

if (is_uploaded_file($input))
{       
    //in case you want to move  the file in uploads directory
    if(move_uploaded_file($input,$des)){
    	$count=$count+1;
     	echo 'moved file to destination directory';
     	exit;
    }
     
    else{
     	echo "unable to upload";
    }
}
?>