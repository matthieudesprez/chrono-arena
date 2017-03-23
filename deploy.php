<?php

// Set these dependant on your BB credentials

$username = 'username';
$password = 'password';

$branch = 'master';

// FTP Credentials

$ftp_host = 'example.com';
$ftp_username = 'username';
$ftp_password = 'password';
$ftp_path = '/public_html/directory/';

// Grab the data from BB's POST service and decode
$json = stripslashes($_POST['payload']);
$data = json_decode($json);

// Set some parameters to fetch the correct files

$uri = $data->repository->absolute_url;
$node = $data->commits[0]->node;
$files = $data->commits[0]->files;

if($data->commits[0]->branch == $branch){

    $author = $data->commits[0]->author;
    $comm_msg = $data->commits[0]->message;

    $log = "\n\n------NEW COMMIT------\n\nAuthor: $author\nMessage: $comm_msg\n\n";

    $fp = fopen('deploy_log', 'a');
    fwrite($fp, $log);
    fclose($fp);

    // Connect to FTP

    $conn_id = ftp_connect($ftp_host);
    $login_result = ftp_login($conn_id, $ftp_username, $ftp_password);

    // We're gonna need these later!

    function make_directory($ftp_stream, $dir){
        if (ftp_is_dir($ftp_stream, $dir) || @ftp_mkdir($ftp_stream, $dir)) return true;
        if (!make_directory($ftp_stream, dirname($dir))) return false;
        return ftp_mkdir($ftp_stream, $dir);
    }

    function ftp_is_dir($ftp_stream, $dir){
        $original_directory = ftp_pwd($ftp_stream);
        if ( @ftp_chdir( $ftp_stream, $dir ) ) {
            ftp_chdir( $ftp_stream, $original_directory );
            return true;
        } else {
            return false;
        }
    }

    // Foreach through the files and curl them over

    foreach ($files as $file) {

        $logmsg = '';

        $path = $file->file;

        if ($file->type == "removed") {

            ftp_delete($conn_id, $ftp_path.$path);

            $logmsg .= "[".date('d-m-Y h:i:s')."] - Removed $path\n";

        } else {

            $url = "https://api.bitbucket.org/1.0/repositories".$uri."raw/".$node."/".$file->file;

            $dirname = dirname($path);

            $chdir = @ftp_chdir($conn_id, $ftp_path.$dirname);

            if($chdir == false){
                if(make_directory($conn_id, $ftp_path.$dirname)){
                    $logmsg .= "[".date('d-m-Y h:i:s')."] - Created new directory '$dirname'\n";
                } else {
                    $logmsg .= "[".date('d-m-Y h:i:s')."] - Failed to create directory '$dirname'\n";
                }
            }

            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_USERPWD, "$username:$password");
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_FOLLOWLOCATION, false);

            $data = curl_exec($ch);

            curl_close($ch);

            $temp = tmpfile();
            fwrite($temp, $data);
            fseek($temp, 0);

            ftp_fput($conn_id, $ftp_path.$path, $temp, FTP_BINARY);

            fclose($temp);

            $logmsg .= "[".date('d-m-Y h:i:s')."] - Uploaded $path\n";

        }

        $log = "$logmsg";

        $fp = fopen('deploy_log', 'a');
        fwrite($fp, $log);
        fclose($fp);

    }

    ftp_close($conn_id);

    $log = "\n\n------END COMMIT------\n\n";

    $fp = fopen('deploy_log', 'a');
    fwrite($fp, $log);
    fclose($fp);

}