//webkitURL is deprecated but nevertheless
URL = window.URL || window.webkitURL;
 
var gumStream; //stream from getUserMedia()
var rec; //Recorder.js object
var input; //MediaStreamAudioSourceNode we'll be recording
var user;
// shim for AudioContext when it's not avb. 
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext;
var gen;
 
var recordButton = document.getElementById("recordButton");
var stopButton = document.getElementById("stopButton");
var pauseButton = document.getElementById("pauseButton"); 
var showtext = document.getElementById("text");
var container = document.getElementById("cont");
var show = document.getElementById("showtext-btn");

var container1 = document.getElementById("container");
var control = document.getElementById("controls");
var i=0; 
var text= document.getElementById("nepalitext");

//add events to those 3 buttons
showtext.addEventListener("click",ShowText);
recordButton.addEventListener("click", startRecording);
stopButton.addEventListener("click", stopRecording);
pauseButton.addEventListener("click", pauseRecording);


var usertext=new Array("नमस्कार "," तर्फ़ बाट यहाँलाई न्यानो अभिवादन", "आफु र आफ्नो परिवार पालना हरेक व्यक्तिले इमान्दारीका साथ् आ-आफ्नो दक्ष अनुसार पेसा वत काम गर्नु पर्छ ", " तर कुनै मान्छेले पनि मेसिनझैं  काम  गर्न  सक्दैन "," सबैलाई काम बाहेक पारिवारिक समयको खाँचो  पर्दछ "," पारिवारिक मात्र नभई दिमाग लाई आराम दिन का निम्ति सेल्फ-तिमे पनि हुन सक्छ "," यस संगै हाम्रा चाड पर्व पनि हामीलाई मनाउन उत्तिकै जरुरि हुन्छ", "सरकारले हालै ल्याएको सार्वजनिक बिदा न्यूनीकरण प्रणाली ल्याएको छ "," यसले अफिस कार्य छिटै नै सम्पन्न हुने आश्वाशन दिलाउन्छ"," किनकि यसले जन शक्ति उपयोग बढी हुने तथ्याँख देखाउन्छ"," तर निजि भविष्यमा सरकारले यस प्रणाली विरुद्ध आलोचना झेल्नु पर्ने पनि हुन सक्छ");
      
function ShowText(){
    alert('help');
    container.style.visibility="hidden";
    show.style.visibility="hidden";
    container1.style.height="35%";
    /*document.getElementById("container").style.width="50%";*/
    control.style.visibility="visible";
    text.innerHTML=usertext[i];
}

function startRecording() {
    audioContext = new AudioContext(); //new audio context to help us record
    console.log("recordButton clicked");
 
    /*
    Simple constraints object, for more advanced audio features see
    <div class="video-container"><blockquote class="wp-embedded-content" data-secret="cVHlrYJoGD"><a href="https://addpipe.com/blog/audio-constraints-getusermedia/">Supported Audio Constraints in getUserMedia()</a></blockquote><iframe class="wp-embedded-content" sandbox="allow-scripts" security="restricted" style="position: absolute; clip: rect(1px, 1px, 1px, 1px);" src="https://addpipe.com/blog/audio-constraints-getusermedia/embed/#?secret=cVHlrYJoGD" data-secret="cVHlrYJoGD" width="600" height="338" title="“Supported Audio Constraints in getUserMedia()” — Pipe Blog" frameborder="0" marginwidth="0" marginheight="0" scrolling="no"></iframe></div>
    */
    
    var constraints = { audio: true, video:false }
 
    /*
    Disable the record button until we get a success or fail from getUserMedia()
    */
 
    recordButton.disabled = true;
    stopButton.disabled = false;
    pauseButton.disabled = false
 
    /*
    We're using the standard promise based getUserMedia()
    https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
    */
 
    navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
        console.log("getUserMedia() success, stream created, initializing Recorder.js ...");
        alert('Recording');
 
        /* assign to gumStream for later use */
        gumStream = stream;
 
        /* use the stream */
        input = audioContext.createMediaStreamSource(stream);
 
        /* 
        Create the Recorder object and configure to record mono sound (1 channel)
        Recording 2 channels  will double the file size
        */
        rec = new Recorder(input,{numChannels:1})
 
        //start the recording process
        rec.record()
 
        console.log("Recording started");
 
    }).catch(function(err) {
        //enable the record button if getUserMedia() fails
        recordButton.disabled = false;
        stopButton.disabled = true;
        pauseButton.disabled = true
        alert('failes');
    });
}


function pauseRecording(){
    console.log("pauseButton clicked rec.recording=",rec.recording );
    if (rec.recording){
        //pause
        rec.stop();
        pauseButton.innerHTML="Resume";
    }else{
        //resume
        rec.record()
        pauseButton.innerHTML="Pause";
    }
}


function stopRecording() {
    console.log("stopButton clicked");
    i++;

    text.innerHTML=usertext[i];
    //disable the stop button, enable the record too allow for new recordings
    stopButton.disabled = true;
    recordButton.disabled = false;
    pauseButton.disabled = true;
 
    //reset button just in case the recording is stopped while paused
    pauseButton.innerHTML="Pause";
 
    //tell the recorder to stop the recording
    rec.stop();
 
    //stop microphone access
    gumStream.getAudioTracks()[0].stop();
 
    //create the wav blob and pass it on to createDownloadLink
    rec.exportWAV(createDownloadLink);
   

}

function createDownloadLink(blob) {
 
    var url = URL.createObjectURL(blob);
    var au = document.createElement('audio');
    var li = document.createElement('li');
    var link = document.createElement('a');
 
    //add controls to the <audio> element
    au.controls = true;
    au.src = url;
 
    //link the a element to the blob
    link.href = url;
    link.download = new Date().toISOString() + '.wav';
    link.innerHTML = link.download;
 
    //add the new audio and a elements to the li element
    li.appendChild(au);
    li.appendChild(link);

    var filename = new Date().toISOString(); //filename to send to server without extension
    //upload link
    var upload = document.createElement('a');
    upload.href="#";
    upload.innerHTML = "Upload";
    upload.addEventListener("click", function(event){
            alert("hello");
          var xhr=new XMLHttpRequest();
          xhr.onload=function(e) {
              if(this.readyState === 4) {
                  console.log("Server returned: ",e.target.responseText);
              }
          };
          var fd=new FormData();
          
          fd.append("audio_data",blob, filename);
          fd.append("username",user);
          fd.append("gender",gen);         
          xhr.open("POST","process.php",true);
          xhr.send(fd);

         

    })
    li.appendChild(document.createTextNode (" "))//add a space in between
    li.appendChild(upload)//add the upload link to li
 
    //add the li element to the ordered list
    recordingsList.appendChild(li);
}




function exports(username,gender){
    user = username;
    gen = gender;
    alert(gen);
}
    

