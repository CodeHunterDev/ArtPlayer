import style from 'bundle-text:./style/index.less';
import validator from 'option-validator';
import Emitter from './utils/emitter';
import * as utils from './utils';
import scheme from './scheme';
import config from './config';
import Whitelist from './whitelist';
import Template from './template';
import I18n from './i18n';
import Player from './player';
import Control from './control';
import Contextmenu from './contextmenu';
import Info from './info';
import Subtitle from './subtitle';
import Events from './events';
import Hotkey from './hotkey';
import Layer from './layer';
import Loading from './loading';
import Notice from './notice';
import Mask from './mask';
import Icons from './icons';
import Setting from './setting';
import Storage from './storage';
import Plugins from './plugins';
import Mobile from './mobile';

let id = 0;
const instances = [];
export default class Artplayer extends Emitter {
    constructor(option, readyCallback) {
        super();

        this.id = ++id;

        const mergeOption = utils.mergeDeep(Artplayer.option, option);
        this.option = validator(mergeOption, scheme);

        this.isLock = false;
        this.isReady = false;
        this.isFocus = false;
        this.isInput = false;
        this.isDestroy = false;

        this.whitelist = new Whitelist(this);
        this.template = new Template(this);
        this.events = new Events(this);

        if (this.whitelist.state) {
            this.storage = new Storage(this);
            this.icons = new Icons(this);
            this.i18n = new I18n(this);
            this.notice = new Notice(this);
            this.player = new Player(this);
            this.layers = new Layer(this);
            this.controls = new Control(this);
            this.contextmenu = new Contextmenu(this);
            this.subtitle = new Subtitle(this);
            this.info = new Info(this);
            this.loading = new Loading(this);
            this.hotkey = new Hotkey(this);
            this.mask = new Mask(this);
            this.setting = new Setting(this);
            this.plugins = new Plugins(this);
        } else {
            this.mobile = new Mobile(this);
        }

        if (typeof readyCallback === 'function') {
            this.on('ready', () => readyCallback.call(this));
        }

        instances.push(this);
    }

    static get instances() {
        return instances;
    }

    static get version() {
        return process.env.APP_VER;
    }

    static get env() {
        return process.env.NODE_ENV;
    }

    static get build() {
        return process.env.BUILD_DATE;
    }

    static get config() {
        return config;
    }

    static get utils() {
        return utils;
    }

    static get scheme() {
        return scheme;
    }

    static get Emitter() {
        return Emitter;
    }

    static get validator() {
        return validator;
    }

    static get kindOf() {
        return validator.kindOf;
    }

    static get html() {
        return Template.html;
    }

    static get option() {
        return {
            container: '#artplayer',
            url: '',
            poster: '',
            title: '',
            type: '',
            theme: '#f00',
            volume: 0.7,
            isLive: false,
            muted: false,
            autoplay: false,
            autoSize: false,
            autoMini: false,
            loop: false,
            flip: false,
            playbackRate: false,
            aspectRatio: false,
            screenshot: false,
            setting: false,
            hotkey: true,
            pip: false,
            mutex: true,
            backdrop: true,
            fullscreen: false,
            fullscreenWeb: false,
            subtitleOffset: false,
            miniProgressBar: false,
            useSSR: false,
            playsInline: true,
            lock: false,
            fastForward: false,
            autoPlayback: false,
            autoOrientation: false,
            airplay: false,
            layers: [],
            contextmenu: [],
            controls: [],
            settings: [],
            quality: [],
            highlight: [],
            plugins: [],
            whitelist: [],
            thumbnails: {
                url: '',
                number: 60,
                column: 10,
            },
            subtitle: {
                url: '',
                type: '',
                style: {},
                encoding: 'utf-8',
            },
            moreVideoAttr: {
                controls: false,
                preload: utils.isSafari ? 'auto' : 'metadata',
            },
            icons: {},
            customType: {},
            lang: navigator.language.toLowerCase(),
        };
    }

    get proxy() {
        return this.events.proxy;
    }

    get query() {
        return this.template.query;
    }

    destroy(removeHtml = true) {
        this.events.destroy();
        this.template.destroy(removeHtml);
        instances.splice(instances.indexOf(this), 1);
        this.isDestroy = true;
        this.emit('destroy');
    }
}

Artplayer.NOTICE_TIME = 2000;
Artplayer.SETTING_WIDTH = 250;
Artplayer.SETTING_ITEM_WIDTH = 200;
Artplayer.SETTING_ITEM_HEIGHT = 35;
Artplayer.INDICATOR_SIZE = 14;
Artplayer.INDICATOR_SIZE_ICON = 16;
Artplayer.INDICATOR_SIZE_MOBILE = 18;
Artplayer.INDICATOR_SIZE_MOBILE_ICON = 20;
Artplayer.VOLUME_PANEL_WIDTH = 60;
Artplayer.VOLUME_HANDLE_WIDTH = 12;
Artplayer.RESIZE_TIME = 500;
Artplayer.SCROLL_TIME = 200;
Artplayer.SCROLL_GAP = 50;
Artplayer.AUTO_PLAYBACK_MAX = 10;
Artplayer.AUTO_PLAYBACK_MIN = 5;
Artplayer.AUTO_PLAYBACK_TIMEOUT = 3000;
Artplayer.RECONNECT_TIME_MAX = 5;
Artplayer.RECONNECT_SLEEP_TIME = 1000;
Artplayer.CONTROL_HIDE_TIME = 3000;
Artplayer.DB_CLICE_TIME = 300;
Artplayer.MOBILE_AUTO_PLAYBACKRATE = 3;
Artplayer.MOBILE_AUTO_PLAYBACKRATE_TIME = 1000;
Artplayer.MOBILE_AUTO_ORIENTATION_TIME = 200;
Artplayer.INFO_LOOP_TIME = 1000;
Artplayer.FAST_FORWARD_VALUE = 3;
Artplayer.FAST_FORWARD_TIME = 1000;

if (typeof document !== 'undefined') {
    if (!document.getElementById('artplayer-style')) {
        const $style = document.createElement('style');
        $style.id = 'artplayer-style';
        $style.textContent = style;
        document.head.appendChild($style);
    }
}

if (typeof window !== 'undefined') {
    window['Artplayer'] = Artplayer;
}

// eslint-disable-next-line no-console
console.log(
    `%c ArtPlayer %c ${Artplayer.version} %c https://artplayer.org`,
    'color: #fff; background: #5f5f5f',
    'color: #fff; background: #4bc729',
    '',
);
