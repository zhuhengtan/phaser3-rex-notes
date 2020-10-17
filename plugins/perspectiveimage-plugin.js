import PerspectiveImageFactory from './gameobjects/perspective/image/Factory.js';
import PerspectiveImageCreator from './gameobjects/perspective/image/Creator.js';
import PerspectiveImage from './gameobjects/perspective/image/Image.js';

import PerspectiveRenderTextureFactory from './gameobjects/perspective/rendertexture/Factory.js';
import PerspectiveRenderTextureCreator from './gameobjects/perspective/rendertexture/Creator.js';
import PerspectiveRenderTexture from './gameobjects/perspective/rendertexture/RenderTexture.js';

import PerspectiveCardFactory from './gameobjects/perspective/card/Factory.js';
import PerspectiveCardCreator from './gameobjects/perspective/card/Creator.js';
import PerspectiveCard from './gameobjects/perspective/card/Card.js';

import SetValue from './utils/object/SetValue.js';

class PerspectiveImagePlugin extends Phaser.Plugins.BasePlugin {

    constructor(pluginManager) {
        super(pluginManager);

        //  Register our new Game Object type
        pluginManager.registerGameObject('rexPerspectiveImage', PerspectiveImageFactory, PerspectiveImageCreator);
        pluginManager.registerGameObject('rexPerspectiveRenderTexture', PerspectiveRenderTextureFactory, PerspectiveRenderTextureCreator);
        pluginManager.registerGameObject('rexPerspectiveCard', PerspectiveCardFactory, PerspectiveCardCreator);        
    }

    start() {
        var eventEmitter = this.game.events;
        eventEmitter.on('destroy', this.destroy, this);
    }
}

SetValue(window, 'RexPlugins.GameObjects.PerspectiveImage', PerspectiveImage);
SetValue(window, 'RexPlugins.GameObjects.PerspectiveRenderTexture', PerspectiveRenderTexture);
SetValue(window, 'RexPlugins.GameObjects.PerspectiveCard', PerspectiveCard);

export default PerspectiveImagePlugin;