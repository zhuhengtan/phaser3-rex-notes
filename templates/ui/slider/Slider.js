import Sizer from '../sizer/Sizer.js';
import OnDragThumb from './OnDragThumb.js';
import OnTouchTrack from './OnTouchTrack.js';
import GetStartPoint from './GetStartPoint.js';
import GetEndPoint from './GetEndPoint.js';
import UpdateThumb from './UpdateThumb.js';
import UpdateIndicator from './UpdateIndicator.js';
import EaseValueMethods from '../../../plugins/utils/ease/EaseValueMethods.js';

const GetValue = Phaser.Utils.Objects.GetValue;
const Clamp = Phaser.Math.Clamp;
const Linear = Phaser.Math.Linear;
const Percent = Phaser.Math.Percent;
const SnapTo = Phaser.Math.Snap.To;

class Slider extends Sizer {
    constructor(scene, config) {
        // Create sizer
        super(scene, config);
        this.type = 'rexSlider';
        this.eventEmitter = GetValue(config, 'eventEmitter', this);

        this.reverseAxis = GetValue(config, 'reverseAxis', false);

        // Add elements
        var background = GetValue(config, 'background', undefined);
        var track = GetValue(config, 'track', undefined);
        var indicator = GetValue(config, 'indicator', undefined);
        var thumb = GetValue(config, 'thumb', undefined);

        if (background) {
            this.addBackground(background);
        }

        if (track) {
            this.add(track,
                {
                    proportion: 1,
                    expand: true,
                    minWidth: ((this.orientation === 0) ? 0 : undefined),
                    minHeight: ((this.orientation === 1) ? 0 : undefined)
                }
            )
        }

        if (indicator) {
            this.pin(indicator); // Put into container but not layout it
        }

        if (thumb) {
            this.pin(thumb); // Put into container but not layout it

        }

        // Input
        var inputMode = GetValue(config, 'input', 0);
        if (typeof (inputMode) === 'string') {
            inputMode = INPUTMODE[inputMode];
        }
        switch (inputMode) {
            case 0: // 'drag'
                if (thumb) {
                    thumb.setInteractive();
                    this.scene.input.setDraggable(thumb);
                    thumb
                        .on('drag', OnDragThumb, this)
                        .on('dragstart', function (pointer) {
                            this.eventEmitter.emit('inputstart', pointer);
                        }, this)
                        .on('dragend', function (pointer) {
                            this.eventEmitter.emit('inputend', pointer);
                        }, this)

                }
                break;
            case 1: // 'click'
                this
                    .on('pointerdown', OnTouchTrack, this)
                    .on('pointermove', OnTouchTrack, this)
                    .on('pointerdown', function (pointer) {
                        this.eventEmitter.emit('inputstart', pointer);
                    }, this)
                    .on('pointerup', function (pointer) {
                        this.eventEmitter.emit('inputend', pointer);
                    }, this)
                    .on('pointerover', function (pointer) {
                        if (pointer.isDown) {
                            this.eventEmitter.emit('inputstart', pointer);
                        }
                    }, this)
                    .on('pointerout', function (pointer) {
                        if (pointer.isDown) {
                            this.eventEmitter.emit('inputend', pointer);
                        }
                    }, this)
                    .setInteractive()

                break;
        }

        this.addChildrenMap('background', background);
        this.addChildrenMap('track', track);
        this.addChildrenMap('indicator', indicator);
        this.addChildrenMap('thumb', thumb);

        var callback = GetValue(config, 'valuechangeCallback', null);
        if (callback !== null) {
            var scope = GetValue(config, 'valuechangeCallbackScope', undefined);
            this.eventEmitter.on('valuechange', callback, scope);
        }
        this.setEnable(GetValue(config, 'enable', undefined));
        this.setGap(GetValue(config, 'gap', undefined));
        this.setValue(GetValue(config, 'value', 0), GetValue(config, 'min', undefined), GetValue(config, 'max', undefined));

        this
            .setEaseValuePropName('value')
            .setEaseValueDuration(GetValue(config, 'easeValue.duration', 0))
            .setEaseValueFunction(GetValue(config, 'easeValue.ease', 'Linear'))
    }

    setEnable(enable) {
        if (enable === undefined) {
            enable = true;
        }
        this.enable = enable;
        return this;
    }

    setGap(gap) {
        this.gap = gap;
        return this;
    }

    get value() {
        return this._value;
    }

    set value(value) {
        if (this.gap !== undefined) {
            value = SnapTo(value, this.gap);
        }
        var oldValue = this._value;
        this._value = Clamp(value, 0, 1);

        if (oldValue !== this._value) {
            this.updateThumb(this._value);
            this.updateIndicator(this._value);
            this.eventEmitter.emit('valuechange', this._value, oldValue, this.eventEmitter);
        }
    }

    setValue(value, min, max) {
        if ((value === undefined) || (value === null)) {
            return this;
        }

        if (min !== undefined) {
            value = Percent(value, min, max);
        }
        this.value = value;
        return this;
    }

    addValue(inc, min, max) {
        if (min !== undefined) {
            inc = Percent(inc, min, max);
        }
        this.value += inc;
        return this;
    }

    getValue(min, max) {
        var value = this.value;
        if (min !== undefined) {
            value = Linear(min, max, value);
        }
        return value;
    }

    runLayout(parent, newWidth, newHeight) {
        // Skip hidden or !dirty sizer
        if (this.ignoreLayout) {
            return this;
        }

        super.runLayout(parent, newWidth, newHeight);
        this.updateThumb();
        this.updateIndicator();
        return this;
    }
}

const INPUTMODE = {
    pan: 0,
    drag: 0,
    click: 1,
    none: -1,
}

var methods = {
    getStartPoint: GetStartPoint,
    getEndPoint: GetEndPoint,
    updateThumb: UpdateThumb,
    updateIndicator: UpdateIndicator,
}

Object.assign(
    Slider.prototype,
    methods,
    EaseValueMethods
);

export default Slider;