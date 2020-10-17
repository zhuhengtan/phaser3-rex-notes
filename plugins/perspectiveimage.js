import PerspectiveImageFactory from './gameobjects/perspective/image/Factory.js';
import PerspectiveImageCreator from './gameobjects/perspective/image/Creator.js';
import PerspectiveImage from './gameobjects/perspective/image/Image.js';

import PerspectiveRenderTextureFactory from './gameobjects/perspective/rendertexture/Factory.js';
import PerspectiveRenderTextureCreator from './gameobjects/perspective/rendertexture/Creator.js';
import PerspectiveRenderTexture from './gameobjects/perspective/rendertexture/RenderTexture.js';

import PerspectiveCardFactory from './gameobjects/perspective/card/Factory.js';
import PerspectiveCardCreator from './gameobjects/perspective/card/Creator.js';
import PerspectiveCard from './gameobjects/perspective/card/Card.js';


Phaser.GameObjects.GameObjectFactory.register('rexPerspectiveImage', PerspectiveImageFactory);
Phaser.GameObjects.GameObjectCreator.register('rexPerspectiveImage', PerspectiveImageCreator);

Phaser.GameObjects.GameObjectFactory.register('rexPerspectiveRenderTexture', PerspectiveRenderTextureFactory);
Phaser.GameObjects.GameObjectCreator.register('rexPerspectiveRenderTexture', PerspectiveRenderTextureCreator);

Phaser.GameObjects.GameObjectFactory.register('rexPerspectiveCard', PerspectiveCardFactory);
Phaser.GameObjects.GameObjectCreator.register('rexPerspectiveCard', PerspectiveCardCreator);


export default {
    PerspectiveImage: PerspectiveImage,
    PerspectiveRenderTexture: PerspectiveRenderTexture,
    PerspectiveCard: PerspectiveCard
}