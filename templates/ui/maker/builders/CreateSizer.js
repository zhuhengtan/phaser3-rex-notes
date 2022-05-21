import MergeStyle from './MergeStyle.js';
import Sizer from '../../sizer/Sizer.js';
import CreateChild from './CreateChild.js';

var CreateSizer = function (scene, data, view, styles, customBuilders) {
    data = MergeStyle(data, styles);

    var backgroundConfig = data.background;
    delete data.background;
    if (backgroundConfig) {
        if (!Array.isArray(backgroundConfig)) {
            backgroundConfig = [backgroundConfig];
        }
        for (var i = 0, cnt = backgroundConfig.length; i < cnt; i++) {
            var childConfig = backgroundConfig[i];
            if (!childConfig.child) {
                childConfig = { child: childConfig };
                backgroundConfig[i] = childConfig;
            }
            CreateChild(scene, childConfig, 'child', view, styles, customBuilders);
        }
    }

    var childrenConfig = data.children;
    delete data.children;
    if (childrenConfig) {
        for (var i = 0, cnt = childrenConfig.length; i < cnt; i++) {
            var childConfig = childrenConfig[i];
            if (!childConfig.child) {
                childConfig = { child: childConfig };
                childrenConfig[i] = childConfig;
            }
            CreateChild(scene, childConfig, 'child', view, styles, customBuilders);
        }
    }

    var gameObjects = new Sizer(scene, data);
    scene.add.existing(gameObjects);

    if (backgroundConfig) {
        for (var i = 0, cnt = backgroundConfig.length; i < cnt; i++) {
            var childConfig = backgroundConfig[i];
            gameObjects.addBackground(childConfig.child, childConfig.padding);
        }
    }

    if (childrenConfig) {
        for (var i = 0, cnt = childrenConfig.length; i < cnt; i++) {
            var childConfig = childrenConfig[i];
            gameObjects.add(childConfig.child, childConfig);
        }
    }

    return gameObjects;
}

export default CreateSizer;