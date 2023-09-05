<!--Contenido canal digital -->
<img id='ImageDigitalChannel'>
<div id='DigitalChannel'></div>

<iframe id='ContentFrame' src=''></iframe>

<div id='InfoContainer' class='BackgroundInfo'>
    <div class='ChannelNumber'></div>
    <div class='Quality'></div>
    <div class='ChannelName'></div>
    <div class='Date'></div>
    <div class='Title'></div>
    <div class='Duration'></div>
    <div class='Time'></div>
    <div class='Description'></div>
</div>

<div id='ChannelNumber'></div><!-- Cuadro con informacion del canal-->



<!-- Barra Pause Live Tv y Grabacion en reproduccion -->
<div id='BarStatus'></div>
<div id='BarContainer'>
    <div id='BarPosition'></div>
</div>
<div id='BarDuration'></div>
<div id='BarTimes'></div>

<!-- Opciones para grabar un programa -->
<div id='RecordingOptions'>
    <div class='RecordingOptionsButton'>Tune channel</div>
    <div class='RecordingOptionsButton'>Add record</div>
    <div class='RecordingOptionsButton'>Record all shows</div>
    <div class='RecordingOptionsButton'>Close</div>
</div>

<div id='RecordPlayOptions'>
    <div class='RecordingOptionsButton'>Play again</div>
    <div class='RecordingOptionsButton'>Delete</div>
    <div class='RecordingOptionsButton'>Stop</div>
    <div class='RecordingOptionsButton'>Return</div>
</div>

<!-- Opciones para grabar un programa manualmente | OnLoadHourPosition  & Hours[(0 - > 47)]  | -->
<div id='RecordingManualOptions'>
    <i class='fa fa-caret-up'></i><br>
    <div class='TimeNewRecording'>00</div>
    <div class='TimeNewRecording'>00</div>
    <div class='TimeNewRecording'>00</div>
    <div class='TimeNewRecording' style='width: 35%;'>+15 min</div>
    <i class='fa fa-caret-down'></i><br>

    <div class='RecordingOptionsButton'>Accept</div>
    <div class='RecordingOptionsButton'>Close</div>
</div>

<!-- Mensajes para grabaciones -->
<div id='PanelMessage'>
    <div id='RecorderMessage'></div>
    <div id='MessageClose'>OK</div>
</div>


<!-- Panel grabador -->
<div id='PvrContainer'>
    <div id='PvrLogoContainer'>
        <div id='PvrMainLogo'></div>
    </div>

    <div id='PvrLateral'>
        <div id='PvrWeather'>
            <div id='Temperatures'>
                <span id='PvrWeatherFarenheit'></span><span>&deg; F/</span>
                <span id='PvrWeatherCelsius'></span><span>&deg; C</span>
            </div>
            <div id='PvrIcon'>
                <canvas id='PvrWeatherIcon' width='25' height='25'></canvas>
            </div>
        </div>
        <div id='PvrDate'></div>

        <div id='BarCircle'>
            <div id='PercentageCircle' class='c100 center p0'>
                <span id='PercentageText'>34%</span>
                <div class='slice'>
                    <div class='bar'></div>
                    <div class='fill'></div>
                </div>
            </div>
        </div>

    </div>

    <div id='PvrDiskInfo'>
        <div id='UsedSize'></div>
        <div class='BarUsedSize'></div>
        <div id='BarUsedSize'></div>
    </div>

    <div class='PvrHeader'>
        <i class='fa fa-caret-left PvrChevronLeft'></i>
        <div id='CurrentPvrOption'></div>
        <i class='fa fa-caret-right PvrChevronRight'></i>
    </div>

    <div id='PvrList'>
        <div class='PvrProgram'></div>
        <div class='PvrProgram'></div>
        <div class='PvrProgram'></div>
        <div class='PvrProgram'></div>
        <div class='PvrProgram'></div>
        <div class='PvrProgram'></div>
        <div class='PvrProgram'></div>
        <div class='PvrProgram'></div>
        <div class='PvrProgram'></div>
    </div>

    <div id='PvrInfo'>
        <div id='PvrProgramDate'></div>
        <div id='PvrProgramDuration'></div>
        <div id='PvrProgramStars'></div>
        <div id='PvrProgramEpisode'></div>
        <div id='PvrProgramDescription'></div>
        <div id='PvrProgramTitle'></div>
    </div>

    <div id='PvrOptions'>
        <div class='PvrOptionsButton'>Play</div>
        <div class='PvrOptionsButton'>Delete</div>
        <div class='PvrOptionsButton'>Close</div>
    </div>

    <div id='PvrDeleteOptions'>
        <div class='PvrOptionsButton'>Delete</div>
        <div class='PvrOptionsButton'>Close</div>
    </div>
</div>
