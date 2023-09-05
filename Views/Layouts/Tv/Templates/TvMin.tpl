<!--Contenido canal digital -->
<img id='ImageDigitalChannel'>
<div id='DigitalChannel'></div>
<iframe id='ContentFrame' src=''></iframe>


<div class="lds-grid"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>

<!-- Cuadro con informacion del canal -->

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

<div id='EpgContainer'>
    <!-- Contiene informacion del programa y el canal, fecha y hora -->
    <div id='EpgHeader'>
        <div id='EpgWeather'>
            <div id='TemperatureGroup'>
                <span id='WeatherFarenheit'></span><span>&deg; F/</span>
                <span id='WeatherCelsius'></span><span>&deg; C</span>
            </div>
            <canvas id='WeatherIcon' width='25' height='25'></canvas>
            <div id='WeatherSummary'></div>
        </div>
        <div id='EpgDate'></div>
    </div>

    <!-- -->
    <div id='EpgNowAiring'></div>
    <div id='EpgDays'>
        <div id='EpgDay'></div>
    </div>

    <!-- Lista de canales -->
    <div id='EpgChannels'>
        <div id='ChannelRow1'><div class='ChannelImage'></div><p class='ChannelName'></p></div>
        <div id='ChannelRow2'><div class='ChannelImage'></div><p class='ChannelName'></p></div>
        <div id='ChannelRow3'><div class='ChannelImage'></div><p class='ChannelName'></p></div>
        <div id='ChannelRow4'><div class='ChannelImage'></div><p class='ChannelName'></p></div>
        <div id='ChannelRow5'><div class='ChannelImage'></div><p class='ChannelName'></p></div>
        <div id='ChannelRow6'><div class='ChannelImage'></div><p class='ChannelName'></p></div>
        <div id='ChannelRow7'><div class='ChannelImage'></div><p class='ChannelName'></p></div>
    </div>

    <!-- Contiene las horas en la guia  -->
    <div id='EpgHours'>
        <div class='HourRow'></div>
        <div class='HourRow'></div>
        <div class='HourRow'></div>
        <div class='HourRow'></div>
    </div>

    <!-- Contiene la lista de programas, muestra hora inicio y titulo -->
    <div id='EpgPrograms'>
        <div id='ProgramRow1'></div>
        <div id='ProgramRow2'></div>
        <div id='ProgramRow3'></div>
        <div id='ProgramRow4'></div>
        <div id='ProgramRow5'></div>
        <div id='ProgramRow6'></div>
        <div id='ProgramRow7'></div>
    </div>

    <!-- Contiene las horas en la guia  -->
    <div id='ProgramFocus'></div>
    <div id='Extras'></div>

    <div id='EpgChannelLogo' class='EpgLogo'></div>

    <div id='EpgProgramInfo'>
        <div id='EpgTitle'></div>
        <div id='EpgDescription'></div>
        <div id='EpgTime'></div>
        <div id='EpgDuration'></div>
        <div id='EpgRating'></div>
        <div id='EpgStars'></div>
        <div id='EpgEpisode'></div>
        <div id='EpgRecording'></div>
        <div id='EpgSerie'></div>
    </div>

    <div id='EpgMainLogo'></div>

    <div id='Message'></div>

</div>

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
