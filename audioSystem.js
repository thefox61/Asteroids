

export class audioSystem
{
    soundFiles = 
    {
        "shoot": "./laser.wav",
        "explosion": "./explosion.wav",
        "alarm": "./alarm.wav"

    }

    audioMap = {};

    constructor()
    {

    }

    init()
    {
        // load all audio elements
        for (const [key, value] of Object.entries(this.soundFiles)) 
        {
            const currAudio = new Audio(value);

            this.audioMap[key] = currAudio;
        }
    }

    playAudio(action)
    {
        let audio = this.audioMap[action];

        if(audio)
        {
            audio.currentTime = 0;
            audio.play();
        }
    }

    playAudioLoop(action)
    {
        let audio = this.audioMap[action];

        if(audio)
        {
            audio.loop = true;
            audio.currentTime = 0;
            audio.volume = 0.5;
            audio.play();
        }
    }

    pauseAudio(action)
    {
        let audio = this.audioMap[action];

        if(audio)
        {
            audio.pause();
            audio.loop = false;        
        }
    }

    pauseAll()
    {
        for (const [key, value] of Object.entries(this.audioMap)) 
        {
            this.pauseAudio(key);
        }
    }
    
}