import ComponentBase from '../../utils/componentbase/ComponentBase.js';
import CreateCover from './CreateCover.js';
import DefaultTransitCallbacks from './DefaultTransitCallbacks.js';
import State from './State.js'

const GetValue = Phaser.Utils.Objects.GetValue;
const Timer = Phaser.Time.TimerEvent;

class Modal extends ComponentBase {
    constructor(gameObject, config) {
        super(gameObject, config);
        // this.parent = gameObject;
        // this.scene

        // Cover : key of modal, to block touch input        
        var coverConfig = GetValue(config, 'cover');
        this.cover = (coverConfig !== false) ? CreateCover(gameObject, coverConfig) : undefined;

        // Close conditions:
        // OK/Cancel buttons, invoke modal.requestClose()
        var userInput = GetValue(config, 'userInput', true);
        // Timeout/any-touch
        if (!userInput) {
            this.setDisplayTime(GetValue(config, 'duration.hold', 2000));
            var anyTouchClose = GetValue(config, 'anyTouchClose', true);
            if (anyTouchClose) {
                this.anyTouchClose();
            }
        } else {
            this.setDisplayTime(-1);
        }

        this.setTransitInTime(GetValue(config, 'duration.in', 200));
        this.setTransitOutTime(GetValue(config, 'duration.out', 200));
        this.setTransitInCallback(GetValue(config, 'transitIn', TransitionMode.popUp));
        this.setTransitOutCallback(GetValue(config, 'transitOut', TransitionMode.scaleDown));

        this.timer = new Timer();
        this._state = new State(this, { eventEmitter: false });

        // Start
        this._state.next();
    }

    get state() {
        return this._state.state;
    }

    shutdown(fromScene) {
        // Already shutdown
        if (this.isShutdown) {
            return;
        }

        // Registered in anyTouchClose()
        if (!this.cover) {
            this.scene.input.off('pointerup', this.requestClose, this);
        }

        if (this.cover && !fromScene) {
            this.cover.destroy();
            this.cover = undefined;
        }

        this.transitInCallback = undefined;
        this.transitOutCallback = undefined;

        this.timer.remove();
        this.timer = undefined;

        super.shutdown(fromScene);
    }

    anyTouchClose() {
        if (this.cover) {
            this.cover.once('pointerup', this.requestClose, this);
        } else {
            this.scene.input.once('pointerup', this.requestClose, this);
        }
        return this;
    }

    delayCall(delay, callback, scope, args) {
        if (args === undefined) {
            args = [];
        }
        this.timer.reset({
            delay: delay,
            callback: callback,
            args: args,
            callbackScope: scope
        })
        this.scene.time.addEvent(this.timer);
        return this;
    }

    removeDelayCall() {
        this.timer.remove();
        return this;
    }

    setTransitInTime(time) {
        this.transitInTime = time;
        return this;
    }

    setDisplayTime(time) {
        this.displayTime = time;
        return this;
    }

    setTransitOutTime(time) {
        this.transitOutTime = time;
        return this;
    }

    setTransitInCallback(callback) {
        if (typeof (callback) === 'string') {
            callback = TransitionMode[callback];
        }

        switch (callback) {
            case TransitionMode.popUp:
                callback = DefaultTransitCallbacks.popUp;
                break;
            case TransitionMode.fadeIn:
                callback = DefaultTransitCallbacks.fadeIn;
                break;
        }

        this.transitInCallback = callback;
        // callback = function(gameObject, cover, duration) {}
        return this;
    }

    setTransitOutCallback(callback) {
        if (typeof (callback) === 'string') {
            callback = TransitionMode[callback];
        }

        switch (callback) {
            case TransitionMode.scaleDown:
                callback = DefaultTransitCallbacks.scaleDown;
                break;
            case TransitionMode.fadeOut:
                callback = DefaultTransitCallbacks.fadeOut;
                break;
        }

        this.transitOutCallback = callback;
        // callback = function(gameObject, cover, duration) {}
        return this;
    }

    requestClose() {
        // Only can close modal in OPEN state
        if (this._state.state === 'OPEN') {
            this._state.next(); // OPEN -> TRANS_CLOSE 
        }
        return this;
    }
}

const TransitionMode = {
    popUp: 0,
    fadeIn: 1,
    scaleDown: 0,
    fadeOut: 1,
}

export default Modal;