

export class audioSystem
{
    soundFiles = 
    {
        "shoot": "./laser.wav",
        "explosion": "./explosion.wav"
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
    
}