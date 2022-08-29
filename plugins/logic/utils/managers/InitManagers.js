import SoundManager from '../../../utils/audio/soundmanager/SoundManager.js';
import Timeline from '../../../time/progresses/Timeline.js';

const GetValue = Phaser.Utils.Objects.GetValue;

var InitManagers = function (config) {
    var scene = config.scene;
    var soundManagerConfig = GetValue(config, 'sounds');
    if (soundManagerConfig !== false) {
        this.soundManager = new SoundManager(scene, soundManagerConfig);
    }

    this.gameObjectManagers = {};

    this.timeline = new Timeline(this);

    this.managersScene = scene;
}

export default InitManagers;