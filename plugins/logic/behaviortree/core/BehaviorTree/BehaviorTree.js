import { TREE } from '../../constants.js'
import CreateUUID from '../../utils/CreateUUID.js';
import Load from './Load.js';
import Dump from './Dump.js';
import Tick from '../Tick.js';

class BehaviorTree {

    constructor() {

        this.id = CreateUUID();

        this.category = TREE;

        this.title = '';

        this.description = '';

        this.properties = {};

        this._root = null;
    }

    addChild(node) {
        this.root = node;
        return this;
    }

    get root() {
        return this._root;
    }

    set root(node) {
        if (node) {
            this._root = node;
            node.setParent(this);
        } else {
            if (this._root) {
                this._root.setParent(null);
            }
            this._root = null;
        }
    }

    getNodes(out) {
        if (out === undefined) {
            out = [];
        }
        if (this.root) {
            this.root.getChildren(out);
        }

        return out;
    }

    tick(blackboard, target) {
        if (!blackboard) {
            throw 'The blackboard parameter is obligatory and must be an instance of Blackboard';
        }

        /* CREATE TICK OBJECT */
        // TODO: Reuse tick object
        var tick = new Tick();
        tick
            .setBlackBoard(blackboard).setTarget(target)
            .setTree(this)
            .reset();

        /* TICK NODE */
        var state = this.root._execute(tick);

        /* POPULATE BLACKBOARD */
        blackboard.set('openNodes', tick._openNodes.slice(0), this.id);
        blackboard.set('nodeCount', tick._nodeCount, this.id);

        return state;
    }

};

var Methods = {
    load: Load,
    dump: Dump,
}
Object.assign(
    BehaviorTree.prototype,
    Methods
);

export default BehaviorTree;