
<style>
    @font-face {
        font-family: miller;
        src: url(Media/Miller-Banner-Semibold-01.ttf);
    }

    @font-face {
        font-family: gotham;
        src: url(Media/Gotham-Book-A.ttf);
    }

    body, html {
        background-image:url(tv:);
        background:url(tv:);
        -webkit-background-composite: clear;
        margin: 0;
        padding: 0;
        min-height: 100%;
        min-width: 100%;
        scrollbar-face-color: RGBA(255, 255, 255, 0.9);
        scrollbar-highlight-color: RGBA(255, 255, 255, 0.9);
        scrollbar-shadow-color: RGBA(255, 255, 255, 0.9);
        scrollbar-3dlight-color: RGBA(255, 255, 255, 0.9);
        scrollbar-arrow-color: RGBA(255, 255, 255, 0.9);
        scrollbar-track-color: RGBA(255, 255, 255, 0.9);
        scrollbar-darkshadow-color: RGBA(255, 255, 255, 0.9);
    }

    div.GeneralBox {
        width: 100%;
        height: 100%;
        position: fixed;
    }

    div.Box {
        width: 30%;
        height: 40%;
        background: #fff;
        border: 5px solid #fff;
        position: fixed;
    }

    div#Box1 {
        left: 0;
        bottom: 0;
    }

    div#Box2 {
        bottom: 0;
        left: 30%;
    }

    div#BigBox {
        width: 40%;
        height: 100%;
        background: #fff;
        position: fixed;
        right: 0;
        top: 0;
    }

    h1 {
        font-family: miller;
        text-align: center;
        top: 25%;
        position: fixed;
        width: 40%;
    }

    p{
        font-family: gotham;
        text-align: center;
        top: 35%;
        position: fixed;
        width: 40%;
        font-size: 19px;
    }

    #slider {
        opacity:1;
        transition: opacity 1s;
        width: 379px;
        margin-top: 6.5%;

    }

    #slider.fadeOut {
        opacity:0;
    }

    #slider2 {
        opacity:1;
        transition: opacity 1s;
        width: 379px;
        margin-top: 6.5%;

    }

    #slider2.fadeOut {
        opacity:0;
    }


    div#Header {

        position: fixed;
        z-index: 1;
        height: 20%;
        width: 50%;
        color: #000;
        font-size: 25px;
        right: 0;
    }

    div#Weather {
        width: 47%;
        float: right;
        margin: 2.5%;
    }

    div#CurrentDate {
        width: 43%;
        float: right;
        margin: 2.5%;
        text-align: right;
    }

    div#TemperatureGroup {
        float: left;
        margin-right: 2.5%;
    }
</style>




<video id='TopVideo' src='./Media/Logos/lider.mp4'></video>s
<div class='Box' id='Box1'>
    <img id="slider">
</div>
<div class='Box' id='Box2'>
    <img id="slider2">
</div>
<div class="Line" style="width: 100%;position: fixed;height: 8%;background: white;bottom: 0;"><div></div></div>
<div id='BigBox'>

    <h1>Why Vidanta?</h1>

    <p>We take an innovative approach to our resort and cruising experiences, and it shows in every meal placed at your table, every interaction with the staff, and every wonderful memory you make.</p>
</div>

<script>
    var VideoScreen     = document.getElementById('TopVideo'),

    var Box1   = document.getElementById('Box1'),
        Box2   = document.getElementById('Box2');

    var Videosrc = 'http://201.116.203.114/Demos/Media/Claseazul9OCT_ing.mp4';

    var imgArray = [
            'http://201.116.203.114/Demos/Media/1.png',
            'http://201.116.203.114/Demos/Media/2.jpg',
            'http://201.116.203.114/Demos/Media/3.png',
            'http://201.116.203.114/Demos/Media/4.jpg'
        ],
        curIndex = 0;
    imgDuration = 5000;

    function slideShow() {
        document.getElementById('slider').className += "fadeOut";
        setTimeout(function() {
            document.getElementById('slider').src = imgArray[curIndex];
            document.getElementById('slider').className = "";
        },2000);
        curIndex++;
        if (curIndex == imgArray.length) { curIndex = 0; }
        setTimeout(slideShow, imgDuration);
    }
    slideShow();


    var imgArray2 = [
            'http://201.116.203.114/Demos/Media/dining.png',
            'http://201.116.203.114/Demos/Media/dining1.jpg',
            'http://201.116.203.114/Demos/Media/activi.png',
            'http://201.116.203.114/Demos/Media/activi1.jpg'
        ],
        curIndex2 = 0;
    imgDuration2 = 6000;

    function slideShow2() {
        VideoScreen.play();
        document.getElementById('slider2').className += "fadeOut";
        setTimeout(function() {
            document.getElementById('slider2').src = imgArray2[curIndex2];
            document.getElementById('slider2').className = "";
        },2000);
        curIndex2++;
        if (curIndex2 == imgArray2.length) { curIndex2 = 0; }
        setTimeout(slideShow2, imgDuration2);
    }
    slideShow2();



</script>